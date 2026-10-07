const { test } = require('node:test');
const assert = require('node:assert/strict');
const { queueCoverage } = require('./queue-coverage.cjs');

test('repeated bus calls count once; any positive remaining queue qualifies', () => {
  assert.deepEqual(queueCoverage([
    {route:'R1',order:1,queue:0}, {route:'R1',order:1,queue:2},
    {route:'R1',order:1,queue:40}, {route:'R1',order:2,queue:0}
  ]), {observedStops:2,queuedStops:1,percentage:0.5});
});
test('directions and repeated route positions stay distinct', () => {
  assert.deepEqual(queueCoverage([
    {route:'R1',order:1,queue:1}, {route:'R2',order:1,queue:0},
    {route:'R1',order:7,queue:3}
  ]), {observedStops:3,queuedStops:2,percentage:2/3});
});
test('missing observations are unavailable rather than zero percent', () => {
  assert.deepEqual(queueCoverage([{route:'R1',order:1,queue:''},{route:'R1',order:2,queue:null}]),
    {observedStops:0,queuedStops:0,percentage:null});
});
test('observed zero queues produce zero percent', () => {
  assert.deepEqual(queueCoverage([{route:'R1',order:1,queue:0}]),
    {observedStops:1,queuedStops:0,percentage:0});
});
