import { getGL } from "..";

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
    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);
  }

  clearVertexArray() {
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  initBuffer(vertices: number[], usage: number) {
    this.buffer = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer!);
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

  setTextureCoordinate(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer!);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  activate() {
    this.gl.bindVertexArray(this.vao!);
  }

  drawSquare() {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
