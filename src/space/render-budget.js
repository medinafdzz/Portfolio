export function isSoftwareRenderer(gl) {
  const context = gl.getContext();
  const debug = context.getExtension('WEBGL_debug_renderer_info');
  const renderer = context.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : context.RENDERER);
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

export function createRenderBudget(render, {
  fps = 24, now = () => performance.now(), schedule = setTimeout, cancel = clearTimeout,
} = {}) {
  let timer = null, last = -Infinity, enabled = true, disposed = false, shadows = false;
  const request = (refreshShadows = false) => {
    if (!enabled || disposed) return;
    shadows ||= refreshShadows === true;
    if (timer !== null) return;
    timer = schedule(() => {
      timer = null;
      last = now();
      const refresh = shadows; shadows = false;
      render(refresh);
    }, Math.max(0, 1000 / fps - (now() - last)));
  };
  const stop = () => { if (timer !== null) cancel(timer); timer = null; shadows = false; };
  return {
    request,
    setEnabled(value) { enabled = value; if (!value) stop(); },
    dispose() { disposed = true; stop(); },
  };
}
