import { getGL } from "./WebGLContext";

const mVerticesOfSquare = [
  0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
];

let mGLVertexBuffer: WebGLBuffer | null;

export function getGLVertexBuffer() {
  return mGLVertexBuffer;
}

export function initGLVertexBuffer() {
  const gl = getGL();

  // Step A: Create a buffer on the gl context for our vertex positions
  mGLVertexBuffer = gl.createBuffer();

  // Step B: Activate vertexBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

  // Step C: Loads mVerticesOfSquare into the vertexBuffer
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(mVerticesOfSquare),
    gl.STATIC_DRAW
  );
}
