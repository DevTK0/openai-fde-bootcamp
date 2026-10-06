// One-time migration. Write to a separate directory to preserve later browser edits.
// node scripts/regroup-decks.mjs /tmp/regrouped-slides
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { resolve, join } from "node:path"
import ts from "typescript"

const output = process.argv[2]
if (!output) throw new Error("Provide a separate output directory.")
const app = resolve(import.meta.dirname, "..")
if (resolve(output) === app || resolve(output) === join(app, "slides"))
  throw new Error(
    "Use a separate directory so browser edits cannot be overwritten."
  )
const base = "aa949c0"
const read = (path) =>
  execFileSync("git", ["show", `${base}:apps/slides/${path}`], {
    cwd: app,
    encoding: "utf8",
  })
const prior = JSON.parse(read("content/deck-groups.json"))
const sources = new Map(
  prior.map((group) => {
    const source = read(`slides/${group.id}/index.tsx`)
    const ast = ts.createSourceFile(
      group.id,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )
    const pages = new Map()
    let notes
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue
      for (const declaration of statement.declarationList.declarations) {
        const name = declaration.name.getText(ast)
        if (/^Page\d+$/.test(name))
          pages.set(Number(name.slice(4)), statement.getText(ast))
        if (name === "notes")
          notes = declaration.initializer.elements.map((note) => note.text)
      }
    }
    return [group.id, { ...group, pages, notes }]
  })
)
const range = (id, first, last) =>
  Array.from({ length: last - first + 1 }, (_, i) => [id, first + i])
const groups = [
  {
    id: "scheduling",
    title: "Scheduling",
    pages: [
      ...range("service-quality", 1, 4),
      ...range("workshop-capacity", 1, 4),
      ...range("special-service-plans", 1, 6),
      ...range("service-quality", 9, 12),
      ...range("workshop-capacity", 9, 10),
      ...range("special-service-plans", 8, 12),
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    pages: [
      ...range("maintenance-costs", 1, 7),
      ...range("workshop-capacity", 5, 7),
      ...range("service-quality", 5, 8),
      ...range("maintenance-costs", 8, 11),
      ...range("workshop-capacity", 11, 13),
      ...range("service-quality", 13, 14),
      ["maintenance-costs", 12],
    ],
  },
  {
    id: "ridership",
    title: "Ridership",
    pages: [
      ...range("passenger-demand", 1, 6),
      ...range("customer-growth", 1, 3),
      ...range("passenger-demand", 7, 9),
      ...range("customer-growth", 6, 7),
    ],
  },
]
const moved = new Map()
const provenance = []
for (const group of groups) {
  const notes = []
  const pages = group.pages.map(([id, page], index) => {
    const source = sources.get(id)
    const block = source.pages.get(page)
    if (!block) throw new Error(`Missing ${id} page ${page}`)
    moved.set(`${id}:${page}`, [group.id, index + 1])
    let note = source.notes[page - 1]
    if (group.id === "ridership" && index === 10)
      note +=
        "\n\nGrowth also requires longer history:\n" +
        sources.get("customer-growth").notes[4]
    notes.push(note)
    return block
      .replace(new RegExp(`const Page${page}\\b`), `const Page${index + 1}`)
      .split(source.title)
      .join(group.title)
  })
  const source = `import { useSlidePageNumber, type Page } from "@open-slide/core"\nimport "../../components/deck.css"\n\nexport const meta = ${JSON.stringify({ title: group.title })}\nexport const notes = ${JSON.stringify(notes, null, 2)}\n\nconst PageNumber = () => { const { current, total } = useSlidePageNumber(); return <>{current} / {total}</> }\n\n${pages.join("\n\n")}\n\nexport default [${pages.map((_, i) => `Page${i + 1}`).join(", ")}] satisfies Page[]\n`
  mkdirSync(join(output, "slides", group.id), { recursive: true })
  writeFileSync(join(output, "slides", group.id, "index.tsx"), source)
  provenance.push({
    id: group.id,
    title: group.title,
    pages: group.pages.map(
      ([id, page]) => prior.find((g) => g.id === id).pages[page - 1]
    ),
  })
}
// Only duplicate separators and the repeated ten-weekday caveat are removed.
for (const [id, page, target] of [
  ["workshop-capacity", 8, ["scheduling", 15]],
  ["special-service-plans", 7, ["scheduling", 15]],
  ["customer-growth", 4, ["ridership", 10]],
  ["customer-growth", 5, ["ridership", 11]],
])
  moved.set(`${id}:${page}`, target)
const links = {}
for (const group of prior) {
  for (const [[id, page], index] of group.pages.map((ref, index) => [
    ref,
    index,
  ]))
    (links[id] ??= {})[page] = moved.get(`${group.id}:${index + 1}`)
  for (const [id, aliases] of Object.entries(group.aliases ?? {}))
    for (const [page, target] of Object.entries(aliases))
      (links[id] ??= {})[page] = moved.get(`${group.id}:${target}`)
}
// The most recently published page order takes precedence for unchanged old IDs.
for (const group of prior)
  links[group.id] = Object.fromEntries(
    group.pages.map((_, i) => [i + 1, moved.get(`${group.id}:${i + 1}`)])
  )
mkdirSync(join(output, "content"), { recursive: true })
writeFileSync(
  join(output, "content/deck-groups.json"),
  JSON.stringify(provenance, null, 2) + "\n"
)
writeFileSync(
  join(output, "content/legacy-deck-pages.json"),
  "{\n" +
    Object.entries(links)
      .map(([id, pages]) => `  ${JSON.stringify(id)}: ${JSON.stringify(pages)}`)
      .join(",\n") +
    "\n}\n"
)
process.stdout.write(
  groups
    .map((group) => `${group.title}: ${group.pages.length} pages`)
    .join("\n") + "\n"
)
