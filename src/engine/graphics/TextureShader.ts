import { mat4 } from "gl-matrix";
import { Color, VertexBuffer } from ".";
import { AbstractShader } from "./AbstractShader";

export class TextureShader extends AbstractShader {
  textureCoordinateRef: number;
  samplerRef: WebGLUniformLocation;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.textureCoordinateRef = this.getAttribLocation("aTextureCoordinate");
    this.samplerRef = this.getUniformLocation("uSampler");
  }

  activate(
    vertexBuffer: VertexBuffer,
    textureVertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    super.activateAbstractFields(
      vertexBuffer,
      pixelColor,
      trsMatrix,
      cameraMatrix
    );

    textureVertexBuffer.activate(this.textureCoordinateRef, 2);

    this.gl.uniform1i(this.samplerRef, 0);
  }
}
