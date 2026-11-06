import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { createRenderBudget, isSoftwareRenderer } from './render-budget';
import { RenderContext } from './render-context';

export default function RenderBudget({ children, active }) {
  const invalidate = useThree(state => state.invalidate);
  const gl = useThree(state => state.gl);
  const controls=useThree(state=>state.controls);
  const interacting=useRef(false),slowFrames=useRef(0);
  useEffect(()=>{
    if(!controls)return;
    const start=()=>{interacting.current=true;},end=()=>{interacting.current=false;};
    controls.addEventListener('start',start);controls.addEventListener('end',end);
    return()=>{controls.removeEventListener('start',start);controls.removeEventListener('end',end);};
  },[controls]);
  useFrame(({viewport,setDpr},delta)=>{
    if(!active&&!interacting.current) {slowFrames.current=0;return;}
    slowFrames.current=delta>.045?slowFrames.current+1:0;
    if(slowFrames.current>=6) {
      const floor=isSoftwareRenderer(gl)?.25:.5;
      if(viewport.dpr>floor) setDpr(Math.max(floor,viewport.dpr*.8));
      slowFrames.current=0;
    }
  });
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
