import { createContext, useContext } from 'react';
export const RenderContext = createContext(null);
export function useSceneRender() { return useContext(RenderContext); }
