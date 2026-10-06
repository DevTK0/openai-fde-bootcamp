import snapshot from "./fleet-data.json"

export type Cell = string | number | null
export type Row = Record<string, Cell>
export type Dataset = {
  id: string
  file: string
  sheet: string
  title: string
  columns: string[]
  rows: Row[]
  sourceRows: number[]
  notes: string[]
}
export const data = snapshot as unknown as {
  tables: Dataset[]
  documents: { file: string; text: string }[]
}
export const monthly = data.tables.find(
  (t) => t.id === "monthly_vehicle_history"
)!.rows
export const vehicles = [
  ...new Set(monthly.map((r) => String(r.vehicle_id))),
].sort()
export function dataset(sheet: string, title?: string): Dataset {
  const table = data.tables.find(
    (t) => t.sheet === sheet && (!title || t.title === title)
  )
  if (!table) throw new Error(`Missing source table: ${sheet} / ${title}`)
  return table
}
export const num = (row: Row, key: string) =>
  typeof row[key] === "number" ? (row[key] as number) : 0
export const sum = (rows: Row[], key: string) =>
  rows.reduce((total, row) => total + num(row, key), 0)
export const fmt = (value: number, digits = 0) =>
  value.toLocaleString("en-SG", { maximumFractionDigits: digits })
export const money = (value: number) => `S$${fmt(value)}`
export function filterHistory(vehicle: string, period: string) {
  return monthly.filter(
    (r) =>
      (vehicle === "all" || r.vehicle_id === vehicle) &&
      (period === "all" ||
        (period === "latest"
          ? String(r.month) >= "2025-10"
          : String(r.month) < "2025-10"))
  )
}
export function groupSum(rows: Row[], group: string, keys: string[]): Row[] {
  const groups = new Map<string, Row>()
  for (const row of rows) {
    const name = String(row[group] ?? "Not supplied")
    const current = groups.get(name) ?? {
      name,
      ...Object.fromEntries(keys.map((key) => [key, 0])),
    }
    for (const key of keys) current[key] = num(current, key) + num(row, key)
    groups.set(name, current)
  }
  return [...groups.values()]
}
export function csvExport(columns: string[], rows: Row[]) {
  const escape = (value: Cell | undefined) => {
    let text = value == null ? "" : String(value)
    if (typeof value === "string" && /^[=+@\-\t\r]/.test(text))
      text = `'${text}`
    return `"${text.replaceAll('"', '""')}"`
  }
  return [
    columns.map(escape).join(","),
    ...rows.map((r) => columns.map((c) => escape(r[c])).join(",")),
  ].join("\r\n")
}
