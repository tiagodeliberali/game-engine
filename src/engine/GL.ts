import { EngineError } from "./EngineError";
import { Color } from "./Color";

const defaultGlName = "GLCanvas";
let gl: WebGL2RenderingContext | undefined;

export function initGL(htmlCanvasID: string): WebGL2RenderingContext {
  const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;

  if (canvas === null) {
    throw new EngineError(
      "GL",
      `Could not find <canvas /> element with name ${htmlCanvasID} in the document.`
    );
  }

  gl =
    canvas.getContext("webgl2") ||
    (canvas.getContext("experimental-webgl2") as WebGL2RenderingContext);

  if (gl === null) {
    throw new EngineError("GL", "WebGL not supported by the browser");
  }

  return gl;
}

export function getGL(): WebGL2RenderingContext {
  if (gl === undefined) {
    gl = initGL(defaultGlName);
  }

  return gl;
}

export function clearCanvas(color: Color) {
  if (gl === undefined) {
    gl = initGL(defaultGlName);
  }

  gl.clearColor(
    color.getRedNormalized(),
    color.getGreenNormalized(),
    color.getBlueNormalized(),
    1.0
  );
  gl.clear(gl.COLOR_BUFFER_BIT);
}
