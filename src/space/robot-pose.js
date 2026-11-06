const smooth=(start,end,t)=>{const x=Math.max(0,Math.min(1,(t-start)/(end-start)));return x*x*(3-2*x);};

export function robotPose(progress,rising=false) {
  const walk=smooth(.18,.64,progress), sit=smooth(.72,1,progress), turn=smooth(.02,.18,progress);
  const inverse=1-walk;
  const x=inverse*inverse*-1.4+2*inverse*walk*-1.65;
  const z=inverse*inverse*2.15+2*inverse*walk*-.4+walk*walk*-.05+.3*sit;
  const heading=Math.atan2(2*(inverse*-.25+walk*1.65),2*(inverse*-2.55+walk*.35));
  const angle=heading<0?heading+Math.PI*2:heading;
  const walkingYaw=rising ? Math.PI*2-.08+(angle-Math.PI+.08)*turn : -.08+(angle+.08)*turn;
  const yaw=walkingYaw*(1-smooth(.64,.76,progress))+Math.PI*smooth(.64,.76,progress);
  const stride=Math.sin(walk*Math.PI*6)*Math.sin(walk*Math.PI)*.3;
  return {x:x||0,y:-.22*sit+.025*Math.sin(walk*Math.PI*6)**2*Math.sin(walk*Math.PI),z,yaw,
    thighL:-1.32*sit+stride,thighR:-1.32*sit-stride,
    kneeL:1.35*sit+Math.max(0,-stride)*.7,kneeR:1.35*sit+Math.max(0,stride)*.7,
    armL:-.9*sit-stride*.5,armR:-.48*(1-smooth(0,.12,progress))-.9*sit+stride*.5,
    wave:.7*(1-smooth(0,.12,progress)),lean:.26*Math.sin(Math.PI*sit)+.04*sit};
}
