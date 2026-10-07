#!/usr/bin/env python3
"""Build the operations SQLite export from the checked-in compressed CSVs."""

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
                        'INSERT INTO "' + table["name"] + '" VALUES (' + placeholders + ")",
                        rows(),
                    )
            for statement in schema["indexes"]:
                connection.execute(statement)
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
