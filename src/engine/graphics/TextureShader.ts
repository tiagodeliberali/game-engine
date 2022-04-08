import { mat4 } from "gl-matrix";
import { Color } from "./Color";
import { SimpleShader } from "./SimpleShader";
import { VertexBuffer } from "./VertexBuffer";

export class TextureShader extends SimpleShader {
  textureCoordinateRef: number;
  samplerRef: WebGLUniformLocation;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.textureCoordinateRef = this.gl.getAttribLocation(
      this.compiledShader,
      "aTextureCoordinate"
    );

    this.samplerRef = this.getUniformLocation("uSampler");
  }

  activate(
    vertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    super.activate(vertexBuffer, pixelColor, trsMatrix, cameraMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer.textureCoordBuffer);
    this.gl.vertexAttribPointer(
      this.textureCoordinateRef,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.textureCoordinateRef);
    this.gl.uniform1i(this.samplerRef, 0);
  }
}
