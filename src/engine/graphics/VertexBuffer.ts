import { getGL } from "..";
import { EngineError } from "../EngineError";

export class VertexBuffer {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | undefined;
  private attributeLocation: number;
  private size: number;
  private buffer: WebGLBuffer | undefined;

  constructor(attributeLocation: number, size: number) {
    this.gl = getGL();
    this.attributeLocation = attributeLocation;
    this.size = size;
  }

  initVertexArray() {
    this.vao = this.notNull(
      this.gl.createVertexArray(),
      "Call to createVertexArray returned undefined"
    );
    this.gl.bindVertexArray(this.vao);
  }

  clearVertexArray() {
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  initBuffer(vertices: number[], usage: number) {
    this.buffer = this.notNull(
      this.gl.createBuffer(),
      "Call to createBuffer returned undefined"
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), usage);

    this.gl.enableVertexAttribArray(this.attributeLocation);

    this.gl.vertexAttribPointer(
      this.attributeLocation,
      this.size,
      this.gl.FLOAT,
      false,
      0,
      0
    );
  }

  private notNull<T>(value: T | undefined | null, error: string): T {
    if (value === null || value === undefined) {
      throw new EngineError(VertexBuffer.name, error);
    }
    return value;
  }

  setTextureCoordinate(vertices: number[]) {
    if (this.buffer === undefined) {
      throw new EngineError(
        VertexBuffer.name,
        "Call to setTextureCoordinate with undefined buffer"
      );
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  activate() {
    if (this.vao === undefined) {
      throw new EngineError(
        VertexBuffer.name,
        "Call to activate with undefined vao"
      );
    }

    this.gl.bindVertexArray(this.vao);
  }

  drawSquare() {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
