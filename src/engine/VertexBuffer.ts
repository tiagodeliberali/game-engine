import { EngineError } from "./EngineError";

export class VertexBuffer {
  gl: WebGL2RenderingContext;
  vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    const buffer = gl.createBuffer();
    if (buffer === null) {
      throw new EngineError(VertexBuffer.name, "Failed to load vertex buffer");
    }

    this.gl = gl;
    this.vertexBuffer = buffer;
  }

  public load(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
  }

  public loadSquare() {
    const verticesOfSquare = [
      0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
    ];

    this.load(verticesOfSquare);
  }
}
