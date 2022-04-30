import { AbstractShader } from "./AbstractShader";

export class SimpleShader extends AbstractShader {
  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(vertexShaderSource, fragmentShaderSource);
  }

  initBuffer(vertices: number[]) {
    this.vertexPositionBuffer.initVertexArray();
    this.vertexPositionBuffer.initBuffer(vertices, this.gl.STATIC_DRAW);
    this.vertexPositionBuffer.clearVertexArray();
  }
}
