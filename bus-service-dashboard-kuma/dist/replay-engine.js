(function(root){
  function latestQueue(events,time){let low=0,high=events.length-1,index=-1;while(low<=high){const mid=(low+high)>>1;if(events[mid][0]<=time){index=mid;low=mid+1;}else high=mid-1;}return index<0?null:{time:events[index][0],people:events[index][1],trip:events[index][2]};}
  function busPosition(trip,stops,time){const calls=trip.calls;if(!calls.length||time<calls[0][0]||time>calls[calls.length-1][1])return null;for(let i=0;i<calls.length;i++){const c=calls[i],stop=stops[c[2]-1];if(time>=c[0]&&time<=c[1])return {stop,lat:stop.lat,lon:stop.lon,dwelling:true,order:c[2],next:null};const next=calls[i+1];if(next&&time>c[1]&&time<next[0]){const end=stops[next[2]-1],progress=(time-c[1])/(next[0]-c[1]);return {lat:stop.lat+(end.lat-stop.lat)*progress,lon:stop.lon+(end.lon-stop.lon)*progress,dwelling:false,order:c[2],next:next[2]};}}return null;}
  root.ReplayEngine={latestQueue,busPosition};
})(typeof window==='undefined'?globalThis:window);
