'use strict';

// One route-position cohort is one stop, independent of the number of bus calls.
function queueCoverage(observations) {
  const stops = new Map();
  for (const call of observations) {
    if (call.queue === null || call.queue === '' || !Number.isFinite(Number(call.queue)) || Number(call.queue) < 0) continue;
    const key = call.route + '|' + call.order;
    stops.set(key, (stops.get(key) || false) || Number(call.queue) > 0);
  }
  const observedStops = stops.size;
  const queuedStops = [...stops.values()].filter(Boolean).length;
  return { observedStops, queuedStops, percentage: observedStops ? queuedStops / observedStops : null };
}

module.exports = { queueCoverage };
