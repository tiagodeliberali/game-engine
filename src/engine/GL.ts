import { EngineError } from "./EngineError";

let gl: WebGL2RenderingContext | undefined;

export function initGL(htmlCanvasID: string): WebGL2RenderingContext {
  const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
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
    throw new EngineError("getGL", "GL not initialized");
  }

  return gl;
}
