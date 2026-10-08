"""Paired Responses API adapter. Evaluation labels never enter requests."""

import json
import time
import urllib.request
import urllib.error
from provider import api_key


def answer(packet, questions, directory):
    properties = {
        q["name"]: {"type": "string", "enum": [c["value"] for c in q["choices"]]}
        for q in questions
    }
    if len(questions) == 1 and questions[0]["name"] == "selection":
        properties = {"choice": properties["selection"]}
        instructions = (
            questions[0]["instructions"]
            + " Available choices: "
            + json.dumps(questions[0]["choices"], separators=(",", ":"))
        )
    else:
        instructions = (
            "Answer each supplied question against the shared input. Questions and available choices: "
            + json.dumps(questions, separators=(",", ":"))
        )
    body = dict(
        model="gpt-6-astra",
        reasoning={"effort": "medium"},
        store=False,
        instructions=instructions,
        input=json.dumps(packet, separators=(",", ":")),
        text={
            "format": {
                "type": "json_schema",
                "name": "selection" if "choice" in properties else "answers",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": properties,
                    "required": list(properties),
                    "additionalProperties": False,
                },
            }
        },
    )
    directory.mkdir(parents=True, exist_ok=True)
    key = api_key()
    for attempt in range(4):
        (directory / f"{attempt}-request.json").write_text(json.dumps(body, indent=2))
        request = urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(body).encode(),
            headers={
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=240) as response:
                result = json.load(response)
        except urllib.error.HTTPError as error:
            if error.code in [429, 502, 503, 504] and attempt < 3:
                time.sleep(2**attempt)
                continue
            raise ValueError(f"Astra returned HTTP {error.code}") from None
        (directory / f"{attempt}-response.json").write_text(
            json.dumps(result, indent=2)
        )
        output = "".join(
            part.get("text", "")
            for item in result.get("output", [])
            for part in item.get("content", [])
            if part.get("type") == "output_text"
        )
        values = json.loads(output)
        return [
            {
                "name": q["name"],
                "type": "choice",
                "choice": values["choice" if "choice" in properties else q["name"]],
            }
            for q in questions
        ]
    raise ValueError("Astra did not return a complete response.")


def choose(packet, instructions, choices, directory):
    return answer(
        packet,
        [
            dict(
                name="selection",
                type="choice",
                instructions=instructions,
                choices=choices,
            )
        ],
        directory,
    )[0]["choice"]
