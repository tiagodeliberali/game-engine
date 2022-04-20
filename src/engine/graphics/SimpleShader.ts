import { mat4 } from "gl-matrix";
import { Color, VertexBuffer } from ".";
import { AbstractShader } from "./AbstractShader";

export class SimpleShader extends AbstractShader {
  vertexPositionBuffer: VertexBuffer;
  pixelColorLocation: WebGLUniformLocation;
  modelMatrixLocation: WebGLUniformLocation;
  cameraXformMatrix: WebGLUniformLocation;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(vertexShaderSource, fragmentShaderSource);

    this.vertexPositionBuffer = new VertexBuffer(
      this.getAttribLocation("aVertexPosition"),
      3
    );

    this.pixelColorLocation = this.getUniformLocation("uPixelColor");
    this.modelMatrixLocation = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");
  }

  initBuffer(vertices: number[]) {
    this.vertexPositionBuffer.initVertexArray();
    this.vertexPositionBuffer.initBuffer(vertices, this.gl.STATIC_DRAW);
    this.vertexPositionBuffer.clearVertexArray();
  }

  draw(pixelColor: Color, trsMatrix: mat4, cameraMatrix: mat4) {
    this.gl.useProgram(this.program);

    this.gl.uniform4fv(
      this.pixelColorLocation,
      pixelColor.getNormalizedArray()
    );
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, trsMatrix);
    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);

    this.vertexPositionBuffer.activate();
    this.vertexPositionBuffer.drawSquare();
  }
}
