import { getGL } from "..";
import { EngineError } from "../EngineError";

export class VertexBuffer {
  private gl: WebGL2RenderingContext;
  private vertexBuffer: WebGLBuffer;
  private size: number;

  constructor(size: number) {
    this.gl = getGL();

    const buffer = this.gl.createBuffer();
    if (buffer === null) {
      throw new EngineError(VertexBuffer.name, "Failed to load vertex buffer");
    }

    this.vertexBuffer = buffer;
    this.size = size;
  }

  initStaticBuffer(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  initDynamicBuffer(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.DYNAMIC_DRAW
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  setTextureCoordinate(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  activate(attributeLocation: number) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(
      attributeLocation,
      this.size,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
