import { mat4 } from "gl-matrix";
import { Color, VertexBuffer } from ".";
import { AbstractShader } from "./AbstractShader";

export class SpriteShader extends AbstractShader {
  textureCoordinateLocation: number;
  samplerLocation: WebGLUniformLocation;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.textureCoordinateLocation =
      this.getAttribLocation("aTextureCoordinate");
    this.samplerLocation = this.getUniformLocation("uSampler");
  }

  activate(
    vertexPositionBuffer: VertexBuffer,
    textureCoordinateBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    super.abstractActivate(
      vertexPositionBuffer,
      pixelColor,
      trsMatrix,
      cameraMatrix
    );

    textureCoordinateBuffer.activate(this.textureCoordinateLocation);

    this.gl.uniform1i(this.samplerLocation, 0);
  }
}
