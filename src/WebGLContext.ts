let mGL: WebGL2RenderingContext;

export function getGL() {
  return mGL;
}

export function setGL(gl: WebGL2RenderingContext) {
  mGL = gl;
}
