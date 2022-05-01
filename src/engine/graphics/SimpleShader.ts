import { AbstractShader } from "./AbstractShader";

export class SimpleShader extends AbstractShader {
  pointSizeLocation: WebGLUniformLocation;
  pointSize: number;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(vertexShaderSource, fragmentShaderSource);

    this.pointSizeLocation = this.getUniformLocation("uPointSize");
    this.pointSize = 1;
  }

  drawExtension(): void {
    this.gl.uniform1f(this.pointSizeLocation, this.pointSize);
  }

  initBuffer(vertices: number[]) {
    this.vertexPositionBuffer.initVertexArray();
    this.vertexPositionBuffer.initBuffer(vertices, this.gl.STATIC_DRAW);
    this.vertexPositionBuffer.clearVertexArray();
  }
}
