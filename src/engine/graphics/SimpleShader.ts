import { VertexBuffer } from "./VertexBuffer";
import { mat4 } from "gl-matrix";
import { Color } from "./Color";
import { AbstractShader } from "./AbstractShader";

export class SimpleShader extends AbstractShader {
  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }

  public activate(
    vertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    this.activateAbstractFields(
      vertexBuffer,
      pixelColor,
      trsMatrix,
      cameraMatrix
    );
  }
}
