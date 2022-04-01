let mGL: any = null;

export function getGL() {
  return mGL;
}

export function initWebGL(htmlCanvasID: string) {
  let canvas = document.getElementById(htmlCanvasID) as any;
  mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

  if (mGL === null) {
    document.write("<br><b>WebGL 2 is not supported!</b>");
    return;
  }

  mGL.clearColor(0.0, 0.8, 0.0, 1.0);
}

export function clearCanvas() {
  mGL.clear(mGL.COLOR_BUFFER_BIT);
}
