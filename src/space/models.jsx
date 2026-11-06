import { useEffect, useMemo } from 'react';
import {useLoader,useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import {isSoftwareRenderer} from './render-budget';

let decoder;
const configure=loader=>{
  decoder??=new DRACOLoader().setDecoderPath('/draco/').setWorkerLimit(1);
  loader.setDRACOLoader(decoder);
};
const releaseDecoder=()=>{decoder?.dispose();decoder=undefined;};
const ignoreRaycast=()=>{};

export default function ModelPart({ part, ...props }) {
  const gl=useThree(state=>state.gl);
  const modelUrl=useMemo(()=>isSoftwareRenderer(gl)?'/models/spacefolio-lite.glb':'/models/spacefolio.glb',[gl]);
  const {nodes}=useLoader(GLTFLoader,modelUrl,configure);
  useEffect(releaseDecoder,[]);
  const object=useMemo(()=>{
    const clone=nodes[part].clone(true);
    clone.traverse(node=>{
      if(!node.isMesh)return;
      // The floor receives the cached contact shadow; self-shadowing tiny
      // bevels at a 512px software shadow map introduces visible acne.
      node.receiveShadow=false;
      node.raycast=ignoreRaycast;
      if(node.material.map)node.material.map.anisotropy=1;
    });
    return clone;
  },[nodes,part]);
  // Clones share the cached GLB geometry/materials, including the four pages.
  return <group {...props} dispose={null}><primitive object={object}/></group>;
}
