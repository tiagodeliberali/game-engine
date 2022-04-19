import { getGL } from "..";
import { EngineError } from "../EngineError";

export class VertexBuffer {
  gl: WebGL2RenderingContext;
  vertexBuffer: WebGLBuffer;

  constructor() {
    this.gl = getGL();

    const buffer = this.gl.createBuffer();
    if (buffer === null) {
      throw new EngineError(VertexBuffer.name, "Failed to load vertex buffer");
    }

    this.vertexBuffer = buffer;
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

  activate(attributeLocation: number, size: number) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(
      attributeLocation,
      size,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
