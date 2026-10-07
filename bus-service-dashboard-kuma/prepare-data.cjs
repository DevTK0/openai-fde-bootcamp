const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { queueCoverage } = require('./queue-coverage.cjs');
// Optional argument points to a workspace containing the original LionLink inputs.
const base = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
function csv(file) {
  const text = fs.readFileSync(path.join(base,'lionlink-operations-source/data',file),'utf8').replace(/^\uFEFF/,'');
  const rows=[]; let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){row.push(cell);cell='';}else if(ch==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=ch;}
  if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}const header=rows.shift();return rows.map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]||''])));
}
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(base,'fleet-repository-data.js'),'utf8')+';globalThis.records=repositoryData;',ctx);
const repo=ctx.records, trips=csv('trips.csv'), vehicles=csv('vehicles.csv'), routes=csv('routes.csv'), calls=csv('stop_calls.csv');
const dates=[...new Set(trips.map(t=>t.service_date))];
const lookup=new Map(trips.map(t=>[t.trip_id,t]));
const fleet=Object.groupBy(vehicles,v=>v.assigned_service_no);
const readiness=csv('vehicle_readiness.csv'), movements=csv('terminal_movements.csv'), duties=csv('crew_duties.csv');
const ms=Date.parse;
// Only recorded vehicle tasks establish location; every supplied later task remains reserved.
const vehicleTasks=Object.groupBy([
  ...trips.map(t=>({date:t.service_date,vehicle:t.actual_vehicle_id,crew:t.actual_crew_id,start:ms(t.actual_departure_at)-120000,end:ms(t.actual_arrival_at)+45000,from:t.origin_stop_id,to:t.destination_stop_id,kind:'trip'})),
  ...movements.map(m=>({date:m.service_date,vehicle:m.vehicle_id,crew:m.crew_id,start:ms(m.actual_start_at),end:ms(m.actual_end_at),from:m.from_stop_id,to:m.to_stop_id,kind:'movement'}))
], t=>t.date+'|'+t.vehicle);
const crewTasks=Object.groupBy(Object.values(vehicleTasks).flat(),t=>t.date+'|'+t.crew);
function availableBuses(date,service) {
  const now=ms(date+'T12:00:00+08:00'), horizon=now+30*60000, candidates=[],usedCrew=new Set();
  for(const v of fleet[service]){
    const release=readiness.filter(r=>r.service_date===date&&r.vehicle_id===v.vehicle_id&&ms(r.issued_at)<=now).sort((a,b)=>ms(b.issued_at)-ms(a.issued_at))[0];
    if(!release||release.release_state!=='released'||ms(release.available_from)>now||ms(release.available_until)<horizon)continue;
    if(repo.repairs.some(r=>r.vehicle===v.vehicle_id&&ms(r.opened)<=now&&(!r.released||ms(r.released)>now)))continue;
    const tasks=vehicleTasks[date+'|'+v.vehicle_id]||[];
    if(tasks.some(t=>t.start<horizon&&t.end>now))continue;
    const last=tasks.filter(t=>t.end<=now).sort((a,b)=>b.end-a.end)[0];
    if(last&&last.end+(last.kind==='trip'?420000:120000)>now)continue;
    const location=last?.to||release.location_stop_id;
    if(!routes.some(r=>r.service_no===service&&r.origin_stop_id===location))continue;
    const crew=duties.filter(d=>d.service_date===date&&d.qualified_service_no===service&&ms(d.record_issued_at)<=now&&ms(d.available_from)<=now&&ms(d.available_until)>=horizon&&!usedCrew.has(d.crew_id)).find(d=>{
      if(ms(d.protected_break_start)<horizon&&ms(d.protected_break_end)>now)return false;
      const tasks=crewTasks[date+'|'+d.crew_id]||[];
      if(tasks.some(t=>t.start<horizon&&t.end>now))return false;
      const last=tasks.filter(t=>t.end<=now).sort((a,b)=>b.end-a.end)[0];
      const first=tasks.filter(t=>t.start<=now).sort((a,b)=>a.start-b.start)[0];
      if(first&&horizon-first.start>+d.maximum_continuous_duty_minutes*60000)return false;
      if(last&&last.end+Number(d.takeover_seconds)*1000>now)return false;
      return (last?.to||d.start_stop_id)===location;
    });
    if(!crew)continue;
    usedCrew.add(crew.crew_id);
    const next=tasks.filter(t=>t.start>=horizon).sort((a,b)=>a.start-b.start)[0];
    const crewNext=(crewTasks[date+'|'+crew.crew_id]||[]).filter(t=>t.start>=horizon).sort((a,b)=>a.start-b.start)[0];
    const breakStart=ms(crew.protected_break_start);
    const freeUntil=Math.min(ms(release.available_until),ms(crew.available_until),next?.start||Infinity,crewNext?.start||Infinity,breakStart>=horizon?breakStart:Infinity);
    candidates.push({vehicle:v.vehicle_id,crew:crew.crew_id,stop:location,freeUntil:new Date(freeUntil+8*3600000).toISOString().slice(0,19)+'+08:00',capacity:+v.capacity_people});
  }
  return candidates;
}
const result={dates,services:{},workshop:repo.repairs.filter(r=>r.releaseStatus==='held'),source:'LionLink synthetic operating records · 5–16 Oct 2026',definitions:{fleet:'Observed in-service minutes within 06:00–12:00 / assigned buses × 360 minutes.',load:'Sum onboard departing / sum capacity across non-final calls observed by noon.',queue:'Largest remaining queue after a boarding call in the selected morning; repeated observations are not summed.'}};
for(const date of dates){result.services[date]={};for(const [service,v] of Object.entries(fleet)){result.services[date][service]={service,name:routes.find(r=>r.service_no===service).service_name,assigned:v.length,minutes:0,trips:0,delays:[],onboard:0,capacity:0,boardings:0,queue:0,queueEvent:null,held:[],hours:Array.from({length:6},(_,i)=>({hour:6+i,minutes:0,onboard:0,capacity:0,queue:0})),events:[]};}}
for(const t of trips){const s=result.services[t.service_date][t.service_no],start=Date.parse(t.service_date+'T06:00:00+08:00'),end=start+360*60000,depart=Date.parse(t.actual_departure_at),arrival=Date.parse(t.actual_arrival_at);if(depart<=end){s.trips++;const delay=Math.max(0,(depart-Date.parse(t.scheduled_departure_at))/60000);s.delays.push({minutes:+delay.toFixed(2),trip:t.trip_id,planned:t.scheduled_departure_at,actual:t.actual_departure_at,vehicle:t.actual_vehicle_id,stop:t.origin_stop_id});}s.minutes+=Math.max(0,Math.min(end,arrival)-Math.max(start,depart))/60000;for(const h of s.hours){const a=start+(h.hour-6)*3600000;h.minutes+=Math.max(0,Math.min(a+3600000,arrival)-Math.max(a,depart))/60000;}}
for(const c of calls){const t=lookup.get(c.trip_id),s=result.services[c.service_date][t.service_no];if(c.actual_departure_at>c.service_date+'T12:00:00+08:00'||+c.stop_order===+routes.find(r=>r.route_id===c.route_id).stop_count)continue;const q=+c.queue_after_people;s.boardings+=+c.boarded_people;s.onboard+=+c.onboard_departing;s.capacity+=+c.capacity_people;const hour=+c.actual_departure_at.slice(11,13),h=s.hours[hour-6];if(h){h.onboard+=+c.onboard_departing;h.capacity+=+c.capacity_people;h.queue=Math.max(h.queue,q);}const e={queue:q,trip:c.trip_id,route:c.route_id,stop:c.stop_id,order:+c.stop_order,time:c.actual_departure_at,boarded:+c.boarded_people,onboard:+c.onboard_departing,capacity:+c.capacity_people};if(q>s.queue){s.queue=q;s.queueEvent=e;}if(q>0)s.events.push(e);}
for(const date of dates){for(const s of Object.values(result.services[date])){const end=date+'T12:00:00+08:00';s.held=repo.repairs.filter(r=>fleet[s.service].some(v=>v.vehicle_id===r.vehicle)&&r.opened<=end&&(!r.released||r.released>end));s.utilization=s.minutes/(s.assigned*360);s.load=s.capacity?s.onboard/s.capacity:null;s.delays.sort((a,b)=>b.minutes-a.minutes);s.events.sort((a,b)=>b.queue-a.queue);s.events=s.events.slice(0,8);for(const h of s.hours){h.utilization=h.minutes/(s.assigned*60);h.load=h.capacity?h.onboard/h.capacity:null;}delete s.minutes;}}
result.stops=repo.stops;
const queueObservations = Object.groupBy(calls.filter(c =>
  c.actual_departure_at >= c.service_date+'T06:00:00+08:00' &&
  c.actual_departure_at <= c.service_date+'T12:00:00+08:00' &&
  +c.stop_order < +routes.find(r => r.route_id === c.route_id).stop_count
), c => c.service_date+'|'+lookup.get(c.trip_id).service_no);
for (const date of dates) for (const s of Object.values(result.services[date])) {
  s.queueCoverage = queueCoverage((queueObservations[date+'|'+s.service] || []).map(c => ({route:c.route_id, order:c.stop_order, queue:c.queue_after_people})));
  s.queueCoverage.totalRouteStops = routes.filter(r => r.service_no === s.service).reduce((total,r) => total + Number(r.stop_count) - 1, 0);
}
result.definitions.queueCoverage='Distinct observed boarding-stop positions with at least one queue_after_people > 0 / all distinct observed boarding-stop positions × 100, within 06:00–12:00 SGT on the selected date. Each direction and repeated route position is counted separately; repeated bus calls at a position count once. Final alighting-only terminals and unobserved positions are excluded. Any positive remaining queue counts, independently of the high-queue priority threshold.';
for(const date of dates)for(const s of Object.values(result.services[date]))s.available=availableBuses(date,s.service);
result.definitions.available='Released buses idle at 12:00 SGT, at a service origin with turnaround completed, no recorded bus or crew task in the next 30 minutes, and a distinct qualified crew member at the same location within their availability and break limits. This is a deployment review window, not approval for an entire additional journey; verify route duration and later duties before dispatch.';
fs.writeFileSync(path.join(__dirname,'dist/data.js'),'window.PLANNER_DATA='+JSON.stringify(result)+';');
console.log(JSON.stringify({dates:dates.length,services:Object.keys(fleet).length,trips:trips.length,calls:calls.length,bytes:fs.statSync(path.join(__dirname,'dist/data.js')).size}));
