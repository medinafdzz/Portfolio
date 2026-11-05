import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRenderBudget, isSoftwareRenderer } from '../src/space/render-budget.js';

test('software rasterizers get the conservative budget without penalising a hardware GPU', () => {
  const renderer = name => ({getContext:()=>({getExtension:()=>null,RENDERER:1,getParameter:()=>name})});
  assert.equal(isSoftwareRenderer(renderer('ANGLE (Google SwiftShader)')), true);
  assert.equal(isSoftwareRenderer(renderer('llvmpipe')), true);
  assert.equal(isSoftwareRenderer(renderer('NVIDIA GeForce')), false);
});

test('render requests coalesce, respect the frame cap and leave no idle loop', () => {
  let time = 0, renders = 0, scheduled = null;
  const budget = createRenderBudget(() => renders++, { now: () => time, schedule: (fn, delay) => { scheduled = { fn, delay }; return 1; }, cancel: () => { scheduled = null; } });
  for (let i = 0; i < 100; i++) budget.request();
  scheduled.fn(); scheduled = null;
  assert.equal(renders, 1);
  time = 10; budget.request();
  assert.ok(scheduled.delay >= 30);
  time = 42; scheduled.fn(); scheduled = null;
  assert.equal(renders, 2);
  assert.equal(scheduled, null);
  budget.dispose();
});

test('hidden and disposed scenes cancel queued work and cannot keep rendering', () => {
  let renders = 0, canceled = 0;
  const budget = createRenderBudget(() => renders++, { schedule: () => 7, cancel: () => canceled++ });
  budget.request(); budget.setEnabled(false); budget.request();
  assert.equal(canceled, 1); assert.equal(renders, 0);
  budget.setEnabled(true); budget.request(); budget.dispose(); budget.request();
  assert.equal(canceled, 2); assert.equal(renders, 0);
});
