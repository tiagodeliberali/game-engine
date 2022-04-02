import { getGL, setGL } from "./WebGLContext";
import { initGLVertexBuffer } from "./VertexBuffer";
import { SimpleShader } from "./engine/SimpleShader";

let shader: SimpleShader;

export function initWebGL(htmlCanvasID: string) {
  const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
  const gl =
    canvas.getContext("webgl2") ||
    (canvas.getContext("experimental-webgl2") as WebGL2RenderingContext);

  if (gl === null) {
    document.write("<br><b>WebGL 2 is not supported!</b>");
    return;
  }

  gl.clearColor(0.0, 0.5, 0.0, 1.0);

  setGL(gl);

  initGLVertexBuffer();
  shader = SimpleShader.BuildAndCompileFromDocument(
    "VertexShader",
    "FragmentShader"
  );
}

export function clearCanvas() {
  const gl = getGL();
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function drawSquare() {
  shader.activate();

  const gl = getGL();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
