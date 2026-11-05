import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { createRenderBudget, isSoftwareRenderer } from './render-budget';
import { RenderContext } from './render-context';

export default function RenderBudget({ children }) {
  const invalidate = useThree(state => state.invalidate);
  const gl = useThree(state => state.gl);
  const budget = useMemo(() => createRenderBudget(shadows => {
    // Three.js owns the mutable shadow cache, outside React state.
    // eslint-disable-next-line react-hooks/immutability
    if (shadows) gl.shadowMap.needsUpdate = true;
    invalidate();
  }, { fps: isSoftwareRenderer(gl) ? 8 : 24 }), [invalidate, gl]);
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
