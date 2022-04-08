import { EngineError } from "../EngineError";

export class VertexBuffer {
  gl: WebGL2RenderingContext;
  vertexBuffer: WebGLBuffer;
  textureCoordBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    const buffer = gl.createBuffer();
    if (buffer === null) {
      throw new EngineError(VertexBuffer.name, "Failed to load vertex buffer");
    }

    const textureBuffer = gl.createBuffer();
    if (textureBuffer === null) {
      throw new EngineError(
        VertexBuffer.name,
        "Failed to load texture vertex buffer"
      );
    }

    this.gl = gl;
    this.vertexBuffer = buffer;
    this.textureCoordBuffer = textureBuffer;
  }

  public init(vertices: number[], textureCoordinates: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      this.gl.STATIC_DRAW
    );
  }

  public initSquare() {
    const verticesOfSquare = [
      0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
    ];

    const textureCoordinates = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];

    this.init(verticesOfSquare, textureCoordinates);
  }

  // this should be calledn when removing vertex buffer completely from webgl
  private unload() {
    if (this.vertexBuffer !== null) {
      this.gl.deleteBuffer(this.vertexBuffer);
    }
    if (this.textureCoordBuffer !== null) {
      this.gl.deleteBuffer(this.textureCoordBuffer);
    }
  }
}
