import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldUseLightweight} from '../src/space/graphics-profile.js';

test('software rendering and the smallest devices default to lightweight content',()=>{
  for(const renderer of ['ANGLE SwiftShader Device','llvmpipe','Microsoft Basic Render Driver']) assert.equal(shouldUseLightweight({renderer}),true);
  assert.equal(shouldUseLightweight({renderer:'Intel UHD',memory:2,cores:4}),true);
  assert.equal(shouldUseLightweight({renderer:'Intel UHD',memory:4,cores:2}),true);
  assert.equal(shouldUseLightweight({renderer:'Intel UHD',memory:4,cores:4}),false);
  assert.equal(shouldUseLightweight({renderer:'Apple GPU'}),false);
});
