import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { createRenderBudget, isSoftwareRenderer } from './render-budget';
import { RenderContext } from './render-context';

export default function RenderBudget({ children, active, onResolutionChange }) {
  const invalidate = useThree(state => state.invalidate);
  const gl = useThree(state => state.gl);
  const controls=useThree(state=>state.controls);
  const scene=useThree(state=>state.scene),get=useThree(state=>state.get);
  const interacting=useRef(false),slowFrames=useRef(0),moving=useRef(active);
  useEffect(()=>{moving.current=active;},[active]);
  useEffect(()=>{
    if(!controls)return;
    const start=()=>{interacting.current=true;},end=()=>{interacting.current=false;};
    controls.addEventListener('start',start);controls.addEventListener('end',end);
    return()=>{controls.removeEventListener('start',start);controls.removeEventListener('end',end);};
  },[controls]);
  // Three.js owns these mutable render callbacks, outside React state.
  /* eslint-disable react-hooks/immutability */
  useEffect(()=>{
    const before=scene.onBeforeRender,after=scene.onAfterRender;
    let started=0;
    // In demand mode, time between frames includes idle input; measure the draw itself.
    scene.onBeforeRender=function(...args){started=performance.now();before.apply(this,args);};
    scene.onAfterRender=function(...args){
      after.apply(this,args);
      if(!moving.current&&!interacting.current) {slowFrames.current=0;return;}
      slowFrames.current=performance.now()-started>35?slowFrames.current+1:0;
      if(slowFrames.current>=6) {
        const floor=isSoftwareRenderer(gl)?.25:.5,dpr=get().viewport.dpr;
        if(dpr>floor) onResolutionChange(Math.max(floor,dpr*.8));
        slowFrames.current=0;
      }
    };
    return()=>{scene.onBeforeRender=before;scene.onAfterRender=after;};
  },[scene,gl,get,onResolutionChange]);
  /* eslint-enable react-hooks/immutability */
  const budget = useMemo(() => createRenderBudget(shadows => {
    // Three.js owns the mutable shadow cache, outside React state.
    // eslint-disable-next-line react-hooks/immutability
    if (shadows) gl.shadowMap.needsUpdate = true;
    invalidate();
  }, { fps: isSoftwareRenderer(gl) ? 30 : 60 }), [invalidate, gl]);
  useEffect(() => {
    const visibility = () => {
      budget.setEnabled(!document.hidden);
      if (!document.hidden) budget.request(true);
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); budget.setEnabled(false); };
  }, [budget]);
  return <RenderContext.Provider value={budget.request}>{children}</RenderContext.Provider>;
}
