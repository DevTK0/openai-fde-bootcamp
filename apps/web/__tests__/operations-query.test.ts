// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createReadStream } from "node:fs"
import { PassThrough, Readable } from "node:stream"
import { gzipSync } from "node:zlib"

vi.mock("node:fs", async (original) => ({
  ...(await original<typeof import("node:fs")>()),
  createReadStream: vi.fn(),
}))

const source = vi.mocked(createReadStream)
const records = Array.from({ length: 60 }, (_, id) => ({
  id,
  name: id % 2 ? "Other" : "Match",
}))
const payload = records.map((row) => JSON.stringify(row)).join("\n") + "\n"
function serve(text = payload) {
  const stream = Readable.from([gzipSync(text)])
  source.mockReturnValueOnce(
    stream as unknown as ReturnType<typeof createReadStream>
  )
  return stream
}

beforeEach(() => {
  vi.resetModules()
  source.mockReset()
})

describe("Bounded operations queries", () => {
  it("stops after the requested page and skips parsing earlier rows", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    // Invalid JSON outside the requested page must never be parsed.
    const stream = serve(
      "not JSON\n".repeat(25) +
        records
          .slice(25, 50)
          .map((r) => JSON.stringify(r))
          .join("\n") +
        "\nnot JSON\n"
    )
    const result = await queryOperationsTable("trips", "", 1)
    expect(result.rows).toEqual(records.slice(25, 50))
    expect(result.total).toBe(6900)
    expect(stream.destroyed).toBe(true)
  })

  it("returns empty out-of-range pages without opening the source", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    const result = await queryOperationsTable("stop_calls", "", 99999)
    expect(result.rows).toEqual([])
    expect(result.total).toBe(252380)
    expect(source).not.toHaveBeenCalled()
  })

  it("shares concurrent searches and caches case-insensitive page results", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    serve()
    const [first, duplicate] = await Promise.all([
      queryOperationsTable("trips", "MATCH", 0),
      queryOperationsTable("trips", "match", 0),
    ])
    expect(first.total).toBe(30)
    expect(first.rows).toEqual(
      records.filter((r) => r.name === "Match").slice(0, 25)
    )
    expect(duplicate).toEqual(first)
    expect(await queryOperationsTable("trips", "match", 0)).toEqual(first)
    expect(source).toHaveBeenCalledTimes(1)
    serve()
    const last = await queryOperationsTable("trips", "match", 1)
    expect(last.rows).toEqual(
      records.filter((r) => r.name === "Match").slice(25)
    )
    expect(last.total).toBe(30)
  })

  it("evicts old pages rather than accumulating every search", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    for (let i = 0; i < 33; i++) {
      serve()
      await queryOperationsTable("trips", `search-${i}`, 0)
    }
    await queryOperationsTable("trips", "search-32", 0)
    expect(source).toHaveBeenCalledTimes(33)
    serve()
    await queryOperationsTable("trips", "search-0", 0)
    expect(source).toHaveBeenCalledTimes(34)
  })

  it("releases failed scans so the next attempt can retry", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    const broken = serve("invalid JSON\n")
    await expect(queryOperationsTable("trips", "Match", 0)).rejects.toThrow()
    expect(broken.destroyed).toBe(true)
    serve()
    expect((await queryOperationsTable("trips", "Match", 0)).total).toBe(30)
  })

  it("responds with Retry-After when all scan slots are occupied", async () => {
    const { queryOperationsTable } = await import("@/lib/operations-server")
    const { GET } = await import("@/app/api/operations/route")
    const streams = Array.from({ length: 4 }, () => new PassThrough())
    const requests = streams.map((stream, i) => {
      source.mockReturnValueOnce(
        stream as unknown as ReturnType<typeof createReadStream>
      )
      return queryOperationsTable("trips", `search-${i}`, 0)
    })
    const response = await GET(
      new Request(
        "http://localhost/api/operations?view=records&table=trips&q=extra"
      )
    )
    expect(response.status).toBe(503)
    expect(response.headers.get("Retry-After")).toBe("1")
    expect(source).toHaveBeenCalledTimes(4)
    streams.forEach((stream) => stream.end(gzipSync(payload)))
    await Promise.all(requests)
    serve()
    expect((await queryOperationsTable("trips", "Match", 0)).total).toBe(30)
  })
})
