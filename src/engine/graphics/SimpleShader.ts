import { mat4 } from "gl-matrix";
import { Color, VertexBuffer } from ".";
import { AbstractShader } from "./AbstractShader";

export class SimpleShader extends AbstractShader {
  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }

  activate(
    vertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    super.abstractActivate(vertexBuffer, pixelColor, trsMatrix, cameraMatrix);
  }
}
