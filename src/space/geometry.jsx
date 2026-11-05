import { colors } from './config';
const ignoreRaycast=()=>{};

export function Cylinder({ radius = .2, height = .3, color = colors.shell, top, glow = 0, ...props }) {
  return <mesh castShadow receiveShadow {...props}><cylinderGeometry args={[top ?? radius, radius, height, 24]}/><meshStandardMaterial color={color} metalness={.45} roughness={.36} emissive={color} emissiveIntensity={glow}/></mesh>;
}
export function Screen({ size = [1, .6], texture, ...props }) {
  return <mesh raycast={ignoreRaycast} {...props}><planeGeometry args={size}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
