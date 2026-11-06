import { colors } from './config';
const ignoreRaycast=()=>{};

export function Cylinder({ radius = .2, height = .3, color = colors.shell, top, glow = 0, ...props }) {
  return <mesh {...props}><cylinderGeometry args={[top ?? radius, radius, height, 16]}/><meshBasicMaterial color={color} toneMapped={glow===0}/></mesh>;
}
export function Screen({ size = [1, .6], texture, ...props }) {
  return <mesh raycast={ignoreRaycast} {...props}><planeGeometry args={size}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
