// @vitest-environment node
import { expect, it } from "vitest"
import { filterRecords, emptyRecordQuery } from "@/lib/record-query"
import { GET } from "@/app/api/operations/route"
import { recordsResultSchema } from "@/lib/record-query"
import { parse } from "csv-parse/sync"
import { z } from "zod"

it("combines search and field filters, preserving row identity and numeric sorting", () => {
  const rows = [
    { id: "01009", area: "Workshop", status: "Held", cost: 100 },
    { id: "01010", area: "Workshop", status: "Released", cost: 20 },
    { id: "01011", area: "Fleet", status: "Held", cost: null },
  ]
  expect(
    filterRecords(rows, {
      ...emptyRecordQuery,
      q: "workshop",
      column: "status",
      match: "equals",
      value: "HELD",
    })
  ).toEqual([rows[0]])
  expect(
    filterRecords(rows, { ...emptyRecordQuery, sort: "cost" }).map((r) => r.id)
  ).toEqual(["01010", "01009", "01011"])
  expect(
    filterRecords(rows, { ...emptyRecordQuery, column: "cost", match: "empty" })
  ).toEqual([rows[2]])
  expect(filterRecords(rows, { ...emptyRecordQuery, q: "%' OR 1=1" })).toEqual(
    []
  )
  expect(filterRecords(rows, { ...emptyRecordQuery, q: "01009" })[0]).toBe(
    rows[0]
  )
})

it("filters and sorts the complete operations dataset and exports all matches", async () => {
  const query = new URLSearchParams({
    table: "vehicles",
    column: "vehicle_type",
    match: "equals",
    value: "dd",
    sort: "vehicle_id",
    direction: "desc",
  })
  const read = async (page: number) => {
    const response = await GET(
      new Request(
        `http://localhost/api/operations?view=records&${query}&page=${page}`
      )
    )
    expect(response.status).toBe(200)
    return recordsResultSchema.parse(await response.json())
  }
  const first = await read(0),
    second = await read(1)
  expect(first.total).toBe(78)
  expect(first.rows).toHaveLength(25)
  expect(first.rows.every((r) => r.vehicle_type === "DD")).toBe(true)
  expect(new Set([...first.recordIds, ...second.recordIds]).size).toBe(50)
  const response = await GET(
    new Request(`http://localhost/api/operations?view=export&${query}`)
  )
  expect(response.status).toBe(200)
  const exported = z
    .array(z.record(z.string(), z.string()))
    .parse(parse(await response.text(), { columns: true }))
  expect(exported).toHaveLength(78)
  expect(exported.slice(0, 25).map((r) => r.vehicle_id)).toEqual(
    first.rows.map((r) => r.vehicle_id)
  )
  expect(exported.slice(25, 50).map((r) => r.vehicle_id)).toEqual(
    second.rows.map((r) => r.vehicle_id)
  )
  const exact = await GET(
    new Request(
      `http://localhost/api/operations?view=records&${query}&q=NW-V172`
    )
  )
  const narrowed = recordsResultSchema.parse(await exact.json())
  expect(narrowed.total).toBe(1)
  expect(
    narrowed.rows.every(
      (r) => r.vehicle_id === "NW-V172" && r.vehicle_type === "DD"
    )
  ).toBe(true)
})

it.each([
  "column=missing",
  "sort=vehicle_id%22%3BDROP",
  "match=invalid",
  "direction=invalid",
  "page=-1",
])("rejects invalid query %s", async (parameters) => {
  const response = await GET(
    new Request(
      `http://localhost/api/operations?view=records&table=vehicles&${parameters}`
    )
  )
  expect(response.status).toBe(400)
})
