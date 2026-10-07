#!/usr/bin/env python3
"""Build the dashboard SQLite database from the checked-in source fixtures."""

import argparse
import csv
import gzip
import json
from pathlib import Path
import sqlite3
import tempfile


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "apps/web/data/operations"
SCHEMA = ROOT / "data/operations/schema.json"


def quote(name):
    return '"' + name.replace('"', '""') + '"'


def add_dashboard_data(connection):
    manifest = json.loads((SOURCE / "manifest.json").read_text())
    core = {table["name"] for table in json.loads(SCHEMA.read_text())["tables"]}
    for table in manifest["tables"]:
        if table["id"] in core:
            continue
        with gzip.open(SOURCE / (table["id"] + ".jsonl.gz"), "rt") as stream:
            rows = [json.loads(line) for line in stream]
        columns = table["columns"]
        definitions = []
        for column in columns:
            values = [row[column] for row in rows if row[column] is not None]
            kind = (
                "INTEGER"
                if values and all(isinstance(v, int) for v in values)
                else "TEXT"
            )
            definitions.append(quote(column) + " " + kind)
        connection.execute(
            "CREATE TABLE " + quote(table["id"]) + " (" + ",".join(definitions) + ")"
        )
        connection.executemany(
            "INSERT INTO "
            + quote(table["id"])
            + " VALUES ("
            + ",".join("?" for _ in columns)
            + ")",
            [[row[column] for column in columns] for row in rows],
        )
    connection.execute(
        "CREATE TABLE dashboard_metadata (name TEXT PRIMARY KEY, value TEXT NOT NULL CHECK(json_valid(value)))"
    )
    connection.execute(
        "CREATE TABLE source_downloads (table_id TEXT PRIMARY KEY, content BLOB NOT NULL)"
    )
    connection.execute(
        "CREATE TABLE handout_tables (position INTEGER PRIMARY KEY, id TEXT UNIQUE NOT NULL, metadata TEXT NOT NULL CHECK(json_valid(metadata)))"
    )
    connection.execute(
        "CREATE TABLE handout_rows (table_id TEXT NOT NULL, position INTEGER NOT NULL, data TEXT NOT NULL CHECK(json_valid(data)), PRIMARY KEY(table_id, position))"
    )
    connection.execute(
        "CREATE TABLE passenger_links (case_id TEXT NOT NULL, trip_id TEXT NOT NULL, PRIMARY KEY(case_id, trip_id))"
    )
    connection.execute(
        "CREATE TABLE boarding_cohort (position INTEGER PRIMARY KEY, trip_id TEXT NOT NULL, reported INTEGER NOT NULL CHECK(reported IN (0,1)))"
    )
    fleet = json.loads((ROOT / "apps/web/lib/fleet-data.json").read_text())
    for position, table in enumerate(fleet["tables"]):
        rows = table.pop("rows")
        connection.execute(
            "INSERT INTO handout_tables VALUES (?, ?, ?)",
            (position, table["id"], json.dumps(table)),
        )
        connection.executemany(
            "INSERT INTO handout_rows VALUES (?, ?, ?)",
            [(table["id"], i, json.dumps(row)) for i, row in enumerate(rows)],
        )
    for table in manifest["tables"]:
        connection.execute(
            "INSERT INTO source_downloads VALUES (?, ?)",
            (table["id"], (SOURCE / (table["id"] + ".csv.gz")).read_bytes()),
        )
    passengers = json.loads(
        (ROOT / "apps/web/lib/operations-passengers.json").read_text()
    )
    connection.executemany(
        "INSERT INTO passenger_links VALUES (?, ?)",
        [
            (case["caseId"], trip["trip_id"])
            for case in passengers
            for trip in case["matches"]
        ],
    )
    boarding = json.loads((ROOT / "apps/web/lib/boarding-history.json").read_text())
    connection.executemany(
        "INSERT INTO boarding_cohort VALUES (?, ?, ?)",
        [
            (i, row["tripId"], int(row["reported"]))
            for i, row in enumerate(boarding.pop("rows"))
        ],
    )
    for name, value in [
        ("operations", manifest),
        ("documents", fleet["documents"]),
        ("boarding", boarding),
    ]:
        connection.execute(
            "INSERT INTO dashboard_metadata VALUES (?, ?)", (name, json.dumps(value))
        )
    connection.execute("PRAGMA user_version = 2")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "data/operations/lionlink-network.sqlite",
    )
    parser.add_argument(
        "--force", action="store_true", help="Replace an existing output database"
    )
    args = parser.parse_args()
    output = args.output.resolve()
    if output.exists() and not args.force:
        parser.error("Output exists; choose another --output or pass --force")
    output.parent.mkdir(parents=True, exist_ok=True)
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    handle = tempfile.NamedTemporaryFile(
        prefix="lionlink-", suffix=".sqlite", dir=output.parent, delete=False
    )
    temporary = Path(handle.name)
    handle.close()
    connection = None
    try:
        with sqlite3.connect(temporary) as connection:
            for table in schema["tables"]:
                connection.execute(table["sql"])
                with gzip.open(
                    SOURCE / (table["name"] + ".csv.gz"),
                    "rt",
                    newline="",
                    encoding="utf-8",
                ) as stream:
                    reader = csv.reader(stream)
                    columns = table["columns"]
                    if next(reader) != [column["name"] for column in columns]:
                        raise ValueError("Unexpected CSV columns: " + table["name"])

                    def rows():
                        for row in reader:
                            if len(row) != len(columns):
                                raise ValueError(
                                    "Unexpected CSV field count: " + table["name"]
                                )
                            yield [
                                None
                                if value == "" and column["type"] != "TEXT"
                                else int(value)
                                if column["type"] == "INTEGER"
                                else float(value)
                                if column["type"] == "REAL"
                                else value
                                for value, column in zip(row, columns)
                            ]

                    placeholders = ",".join("?" for _ in columns)
                    connection.executemany(
                        'INSERT INTO "'
                        + table["name"]
                        + '" VALUES ('
                        + placeholders
                        + ")",
                        rows(),
                    )
            for statement in schema["indexes"]:
                connection.execute(statement)
            add_dashboard_data(connection)
            if connection.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                raise ValueError("Database integrity check failed")
        connection.close()
        temporary.replace(output)
    except BaseException:
        if connection is not None:
            connection.close()
        temporary.unlink(missing_ok=True)
        raise
    print("Created " + str(output))


if __name__ == "__main__":
    main()
