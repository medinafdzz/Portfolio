import { test } from 'node:test';
import assert from 'node:assert/strict';
import { navigationReducer, initialNavigation, sectionIds } from '../src/space/navigation.js';

test('intro starts once, then enables exploration', () => {
  const entering = navigationReducer(initialNavigation, { type: 'START' });
  assert.equal(entering.phase, 'ENTERING');
  assert.equal(navigationReducer(entering, { type: 'START' }), entering);
  assert.equal(navigationReducer(entering, { type: 'ENTERED' }).phase, 'EXPLORE');
});

test('all six sections are accessible directly, with guarded opening and closing', () => {
  assert.deepEqual(sectionIds, ['experience', 'projects', 'about', 'education', 'skills', 'contact']);
  for (const section of sectionIds) {
    const opening = navigationReducer(initialNavigation, { type: 'SELECT', section });
    assert.equal(opening.section, section);
    assert.equal(opening.phase, 'OPENING_SECTION');
    assert.equal(navigationReducer(opening, { type: 'SELECT', section: 'contact' }), opening);
    const open = navigationReducer(opening, { type: 'OPENED' });
    assert.equal(open.phase, 'SECTION_OPEN');
    const closing = navigationReducer(open, { type: 'CLOSE' });
    assert.equal(closing.phase, 'CLOSING_SECTION');
    assert.equal(navigationReducer(closing, { type: 'CLOSED' }).phase, 'EXPLORE');
  }
});

test('invalid and stale transition events never corrupt navigation', () => {
  assert.equal(navigationReducer(initialNavigation, { type: 'SELECT', section: 'missing' }), initialNavigation);
  assert.equal(navigationReducer(initialNavigation, { type: 'OPENED' }), initialNavigation);
  assert.equal(navigationReducer(initialNavigation, { type: 'CLOSE' }), initialNavigation);
  const entering = navigationReducer(initialNavigation, { type: 'START' });
  assert.equal(navigationReducer(entering, { type: 'SELECT', section: 'projects' }), entering);
});

test('host greeting is reversible, guards repeated actions and aborts cleanly', () => {
  let state={phase:'EXPLORE',section:null};
  for(let cycle=0;cycle<3;cycle++) {
    state=navigationReducer(state,{type:'HOST_TOGGLE'});
    assert.equal(state.phase,'HOST_RISING');
    assert.equal(navigationReducer(state,{type:'HOST_TOGGLE'}),state);
    assert.equal(navigationReducer(state,{type:'SELECT',section:'contact'}),state);
    state=navigationReducer(state,{type:'HOST_READY'});
    assert.equal(state.phase,'HOST_GREETING');
    state=navigationReducer(state,{type:'HOST_TOGGLE'});
    assert.equal(state.phase,'HOST_SITTING');
    state=navigationReducer(state,{type:'ENTERED'});
    assert.equal(state.phase,'EXPLORE');
  }
  state=navigationReducer(state,{type:'HOST_TOGGLE'});
  state=navigationReducer(state,{type:'HOST_ABORT'});
  assert.deepEqual(state,{phase:'EXPLORE',section:null});
  assert.equal(navigationReducer(state,{type:'HOST_READY'}),state);
});
