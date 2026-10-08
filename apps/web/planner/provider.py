"""Server-only Decisions transport with auditable, bounded transport retries."""

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path


def api_key():
    key = os.environ.get("OPENAI_API_KEY")
    if not key and os.environ.get("OPENAI_ENV_FILE"):
        for line in Path(os.environ["OPENAI_ENV_FILE"]).read_text().splitlines():
            if line.strip().startswith("OPENAI_API_KEY="):
                key = line.split("=", 1)[1].strip().strip("\"'")
    if not key:
        raise ValueError(
            "Set OPENAI_API_KEY or OPENAI_ENV_FILE on the server before comparing plans."
        )
    return key


def decide(packet, questions, directory):
    directory.mkdir(parents=True, exist_ok=True)
    body = {
        "model": "gpt-6-luna",
        "input": json.dumps(packet, separators=(",", ":")),
        "questions": questions,
    }
    key = api_key()
    for attempt in range(4):
        stem = f"{attempt + 1:03}"
        (directory / f"{stem}-request.json").write_text(json.dumps(body, indent=2))
        request = urllib.request.Request(
            "https://api.openai.com/v1/decisions",
            data=json.dumps(body).encode(),
            headers={
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json",
            },
        )
        started = time.monotonic()
        try:
            with urllib.request.urlopen(request, timeout=240) as response:
                result = json.load(response)
        except urllib.error.HTTPError as error:
            (directory / f"{stem}-error.json").write_text(
                json.dumps({"http_status": error.code})
            )
            if error.code in [429, 502, 503, 504] and attempt < 3:
                time.sleep(2**attempt)
                continue
            raise ValueError(
                f"Decisions returned HTTP {error.code}. No model fallback was used."
            ) from None
        (directory / f"{stem}-response.json").write_text(json.dumps(result, indent=2))
        (directory / f"{stem}-timing.json").write_text(
            json.dumps({"seconds": time.monotonic() - started})
        )
        answers = result.get("answers", [])
        if len(answers) != len(questions):
            raise ValueError("Decisions returned an incomplete response.")
        for answer, question in zip(answers, questions):
            if (
                answer.get("type") != "choice"
                or answer.get("name") != question["name"]
                or answer.get("choice") not in [c["value"] for c in question["choices"]]
            ):
                raise ValueError(
                    "Decisions could not complete this assessment. The run is incomplete."
                )
        return answers
    raise ValueError("Decisions request could not complete.")
