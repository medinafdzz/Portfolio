import {test} from 'node:test';
import assert from 'node:assert/strict';
import {robotPose} from '../src/space/robot-pose.js';

test('robot follows a reversible continuous path with planted endpoints',()=>{
  const standing=robotPose(0),seated=robotPose(1);
  assert.deepEqual([standing.x,standing.y,standing.z,standing.yaw],[-1.4,0,2.15,-.08]);
  assert.deepEqual([seated.x,seated.y,seated.z,seated.yaw],[0,-.22,.25,Math.PI]);
  assert.equal(seated.thighL,-1.32);assert.equal(seated.kneeL,1.35);
  assert.equal(standing.thighL,0); assert.equal(standing.kneeL,0);
  let previous=standing;
  for(let i=1;i<=1000;i++) {
    const next=robotPose(i/1000);
    for(const key of Object.keys(next)) { assert.ok(Number.isFinite(next[key])); assert.ok(Math.abs(next[key]-previous[key])<.08,`Jump in ${key} at ${i}`); }
    previous=next;
  }
  assert.ok(robotPose(.4).x<-.8,'Walk must pass beside the chair');
  for(let i=181;i<640;i++) {
    const progress=i/1000,pose=robotPose(progress,true),next=robotPose(progress-.001,true);
    const dx=next.x-pose.x,dz=next.z-pose.z;
    assert.ok(dx*Math.sin(pose.yaw)+dz*Math.cos(pose.yaw)>0,'Rising robot must walk facing travel');
    assert.ok(Math.abs(pose.yaw-next.yaw)<.08,'No yaw discontinuity on the return path');
  }
});
