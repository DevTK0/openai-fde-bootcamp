import { readdir, readFile } from "node:fs/promises";

// The guide explains fleet evidence independently of the temporary dashboard.
const content = new URL("../src/content/docs/", import.meta.url);
const navigation =
  /\b(?:sidebar|tabs?|filters?|dashboard)\b|\b(?:select|open|click|choose)\s+(?:the\s+)?(?:\*\*)?(?:Operations|Fleet overview|Full operating cohort|Reliability|Crowding|Data explorer|Handouts|Workshop|Cost options|Passenger reports)\b|what to check in the app/i;
const failures = [];
for (const file of await readdir(content, { recursive: true })) {
  if (!/\.mdx?$/.test(file)) continue;
  const lines = (await readFile(new URL(file, content), "utf8")).split("\n");
  lines.forEach((line, index) => {
    if (navigation.test(line))
      failures.push(`${file}:${index + 1}: ${line.trim()}`);
  });
}
if (failures.length) {
  throw new Error(
    `Temporary dashboard navigation does not belong in the guide:\n${failures.join("\n")}`,
  );
}
console.log("Editorial check passed: no temporary dashboard navigation.");
