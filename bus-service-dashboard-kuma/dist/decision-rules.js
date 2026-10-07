(function(root){
  function evaluate(service,thresholds){
    const delays=service.delays.filter(d=>d.minutes>=thresholds.delay),reasons=[];
    if(delays.length)reasons.push('Departure delay');
    if(service.queue>=thresholds.queue)reasons.push('High remaining queue');
    if(service.held.length)reasons.push('Maintenance hold');
    return {s:service,delays,reasons,tier:reasons.length>=2?'critical':reasons.length?'high':'normal',label:reasons.length>=2?'Critical':reasons.length?'High':'Within thresholds'};
  }
  function critical(services,thresholds){return Object.values(services).filter(s=>evaluate(s,thresholds).tier==='critical');}
  root.PlannerRules={evaluate,critical};
})(typeof window==='undefined'?globalThis:window);
