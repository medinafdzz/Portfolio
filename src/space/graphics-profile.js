export function shouldUseLightweight({renderer='',memory,cores}) {
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) || (memory>0&&memory<=2) || (cores>0&&cores<=2);
}

export function detectGraphics() {
  try {
    const context=document.createElement('canvas').getContext('webgl2');
    if(!context) return {supported:false,constrained:true};
    const extension=context.getExtension('WEBGL_debug_renderer_info');
    const renderer=context.getParameter(extension?extension.UNMASKED_RENDERER_WEBGL:context.RENDERER);
    const constrained=shouldUseLightweight({renderer,memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency});
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return {supported:true,constrained};
  } catch {return {supported:false,constrained:true};}
}
