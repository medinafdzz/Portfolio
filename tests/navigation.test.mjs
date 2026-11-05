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
