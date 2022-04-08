import { EngineError } from "./EngineError";
import { Color } from "./graphics";

const defaultGlName = "GLCanvas";
let gl: WebGL2RenderingContext | undefined;

export function initGL(htmlCanvasID?: string): WebGL2RenderingContext {
  const canvas = document.getElementById(
    htmlCanvasID || defaultGlName
  ) as HTMLCanvasElement;

  if (canvas === null) {
    throw new EngineError(
      "GL",
      `Could not find <canvas /> element with name ${htmlCanvasID} in the document.`
    );
  }

  gl =
    canvas.getContext("webgl2", { alpha: false }) ||
    (canvas.getContext("experimental-webgl2", {
      alpha: false,
    }) as WebGL2RenderingContext);

  if (gl === null) {
    throw new EngineError("GL", "WebGL not supported by the browser");
  }

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

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
