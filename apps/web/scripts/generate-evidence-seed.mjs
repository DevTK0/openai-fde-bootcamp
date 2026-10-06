import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const root = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
const read = path => JSON.parse(readFileSync(resolve(root,path),'utf8'))
const fleet = read('apps/web/lib/fleet-data.json')
const operations = JSON.parse(gunzipSync(readFileSync(resolve(root,'apps/web/data/operations/summary.json.gz'))))
const manifest = read('apps/web/data/operations/manifest.json')
const sources = [], tables = []
for (const [i, table] of fleet.tables.entries()) {
  const sourceId = `fleet-${i}`
  sources.push({id: sourceId, title: table.title, kind:'synthetic', reference: `${table.file}#${table.sheet}`, caveats: ['Fictional exercise data. Selected records are not full-fleet totals.', ...table.notes], text: `Source sheet ${table.sheet}. ${table.title}.`})
  tables.push({ id: sourceId, title: table.title, sourceId, kind:table.id === 'monthly_vehicle_history'?'maintenance':'evidence', columns:table.columns, rows:table.rows.map((values,j)=>({id:`row-${table.sourceRows[j] ?? j+1}`,values})), caveats: table.id === 'monthly_vehicle_history'?['Eight selected buses, October 2024 through September 2026. Monthly costs already include selected observations. Repair jobs do not establish breakdowns, cancelled trips or passenger delay.']:['Supporting evidence only. Never added to canonical totals.'] })
}
for(const [i, doc] of [...fleet.documents, ...manifest.documents].entries()) sources.push({id:`dictionary-${i}`,title:doc.file,kind:'reported',reference:doc.file,caveats:['Interpretation of fictional exercise records.'],text:doc.text.slice(0,20000)})
sources.push({id:'operations',title:'Service-date operations summaries',kind:'synthetic',reference:'apps/web/data/operations/summary.json.gz',caveats:['Fictional exercise data. '+manifest.scope,'Boardings are boarding events, not unique passengers. Queue observations do not establish full buses. Departure band is zero through five minutes inclusive.'],text:JSON.stringify(manifest.coverage)})
const rows = operations.groups.map((g,i)=>({id:`service-date-${i+1}`,values:{date:g.date,service:g.service,trips:g.trips,completed:g.completed,boardings:g.boardings,calls:g.calls,queued_calls:g.queuedCalls,on_time_departures:g.departureDelays.filter(d=>d>=0&&d<=300).length,departure_samples:g.departureDelays.length}}))
tables.push({id:'operations',title:'Service-date operations',sourceId:'operations',kind:'operations',columns:Object.keys(rows[0].values),rows,caveats:['Aggregates of canonical trip and stop-call records. No vehicle-level allocation is available in this table.']})
for(const file of readdirSync(resolve(root,'apps/docs/src/content/docs')).filter(f=>f.endsWith('.mdx'))){
 const text=readFileSync(resolve(root,'apps/docs/src/content/docs',file),'utf8')
 sources.push({id:`guide-${file.replace('.mdx','')}`,title:file.replace('.mdx',''),kind:'reported',reference:`apps/docs/src/content/docs/${file}`,caveats:['Findings describe the supplied extract, not verified causes.'],text:text.slice(0,20000)})
}
const slides=read('apps/slides/content/deck-groups.json')
sources.push({id:'slide-problems',title:'Stakeholder problem groups',kind:'reported',reference:'apps/slides/content/deck-groups.json',caveats:['Problem statements guide investigation and do not prove causes.'],text:JSON.stringify(slides).slice(0,20000)})
const bundle={schemaVersion:1,name:'LionLink source evidence',description:'Fictional exercise records, original dictionaries and stakeholder findings. Maintenance covers eight selected buses over October 2024–September 2026; operations covers the dates listed in the source metadata.',sources,tables}
writeFileSync(resolve(root,'apps/web/lib/evidence/seed.json'),JSON.stringify(bundle))
console.log(JSON.stringify({sources:sources.length,tables:tables.length,rows:tables.reduce((n,t)=>n+t.rows.length,0)}))
