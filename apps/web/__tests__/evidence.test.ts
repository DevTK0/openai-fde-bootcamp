// @vitest-environment node
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import fixture from "../public/evidence/example-bundle.json"
import { bundleSchema, filterSchema } from "../lib/evidence/schema"
import { analyse } from "../lib/evidence/analysis"
import { retrieveContext } from "../lib/evidence/context"
import { saveBundle, loadBundle, listBundles } from "../lib/evidence/store"
import { seedBundle } from "../lib/evidence/seed"
import { readImport, maxImportBytes } from "../lib/evidence/http"
const filters=filterSchema.parse({})
const directories:string[]=[]
afterEach(async()=>{ await Promise.all(directories.splice(0).map(d=>rm(d,{recursive:true,force:true}))) })
describe("evidence revisions",()=>{
  it("loads grounded seed with one canonical ledger and original documents",()=>{
    expect(seedBundle.tables.filter(t=>t.kind==='maintenance')).toHaveLength(1)
    expect(seedBundle.sources.some(s=>s.reference.includes('data-dictionary'))).toBe(true)
    expect(analyse(seedBundle,'seed',filters).metrics.every(m=>m.value!==null)).toBe(true)
  })
  it("persists, deduplicates concurrent imports and isolates a changed revision",async()=>{
    const directory=await mkdtemp(join(tmpdir(),'evidence-'));directories.push(directory)
    const results=await Promise.all(Array.from({length:5},()=>saveBundle(fixture,directory)))
    expect(results.filter(r=>r.created)).toHaveLength(1)
    const first=results[0];if(!first) throw new Error('No import')
    const changed={...fixture,name:'Changed revision'}
    const newer=await saveBundle(changed,directory)
    expect(newer.revision.id).not.toBe(first.revision.id)
    expect((await loadBundle(first.revision.id,directory)).name).toBe('Fresh service review example')
    expect(await listBundles(directory)).toHaveLength(2)
    await expect(loadBundle('../escape',directory)).rejects.toThrow()
  })
  it("computes literal results with definitions, denominators and revision citations",()=>{
    const result=analyse(bundleSchema.parse(fixture),'revision-one',filters)
    expect(result.metrics.map(m=>m.value)).toEqual([500,500,10,80,75,200,20])
    expect(result.metrics.find(m=>m.id==='on_time')).toMatchObject({numerator:6,denominator:8})
    expect(result.metrics[0]?.citations[0]).toEqual({revision:'revision-one',sourceId:'demo',tableId:'maintenance',rowId:'row-1'})
  })
  it("does not turn unknown scope, partial months, missing numbers or plans into observations",()=>{
    const bundle=bundleSchema.parse(fixture)
    expect(analyse(bundle,'x',{...filters,vehicle:'MISSING'}).metrics.every(m=>m.value===null)).toBe(true)
    expect(analyse(bundle,'x',{...filters,from:'2026-09-02'}).metrics.find(m=>m.id==='repair_cost')?.value).toBeNull()
    const source=bundle.sources[0];if(source) source.kind='planned'
    expect(analyse(bundle,'x',filters).metrics.every(m=>m.value===null)).toBe(true)
    if(source) source.kind='observed'
    const row=bundle.tables[0]?.rows[0];if(row) row.values.repair_cost_sgd=null
    expect(analyse(bundle,'x',filters).metrics.find(m=>m.id==='repair_cost')?.value).toBeNull()
  })
  it("rejects overlapping canonical tables, duplicate grains, invalid dates and nonfinite values",()=>{
    const bundle=bundleSchema.parse(fixture), table=bundle.tables[0];if(!table)throw new Error('No table')
    expect(bundleSchema.safeParse({...bundle,tables:[...bundle.tables,{...table,id:'overlap'}]}).success).toBe(false)
    table.rows.push({...table.rows[0],id:'duplicate',values:{...table.rows[0]?.values}})
    expect(bundleSchema.safeParse(bundle).success).toBe(false)
    table.rows.pop()
    const row=table.rows[0];if(!row)throw new Error('No row')
    row.values.month='2026-13';expect(bundleSchema.safeParse(bundle).success).toBe(false)
    row.values.month='2026-09';row.values.repair_cost_sgd=Infinity;expect(bundleSchema.safeParse(bundle).success).toBe(false)
  })
  it("retrieves bounded cited evidence with exact entity matches and insufficient evidence",()=>{
    const bundle=bundleSchema.parse(fixture)
    const result=retrieveContext(bundle,'rev','repair DEMO-V001',filters)
    expect(result.status).toBe('evidence-found')
    expect(result.evidence.filter(e=>e.type==='row')).toHaveLength(1)
    expect(result.evidence[0]?.citation.revision).toBe('rev')
    expect(retrieveContext(bundle,'rev','repair DEMO-V00',filters).status).toBe('insufficient')
    expect(retrieveContext(bundle,'rev','unfindablexyz',filters).status).toBe('insufficient')
  })
  it("rejects cross-origin and oversized streamed requests before parsing",async()=>{
    const request=(body:string,origin='http://localhost')=>new Request('http://localhost/api/workspace',{method:'POST',headers:{origin,'content-type':'application/json'},body})
    await expect(readImport(request('{}','https://attacker.example'))).rejects.toMatchObject({status:403})
    await expect(readImport(request('x'.repeat(maxImportBytes+1)))).rejects.toMatchObject({status:413})
    await expect(readImport(request('{broken'))).rejects.toMatchObject({status:400})
  })
})
