import { Vec2d, EngineError, Color } from ".";

const defaultGlName = "GLCanvas";
let gl: WebGL2RenderingContext | undefined;
let canvasSize: Vec2d | undefined;

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

  canvasSize = new Vec2d(canvas.width, canvas.height);

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

export function getCanvasSize(): Vec2d {
  if (canvasSize === undefined) {
    throw new EngineError("GL", "Canvas not initialized");
  }

  return canvasSize;
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
