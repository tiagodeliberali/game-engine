import { EngineError } from "../EngineError";
import { VertexBuffer } from "./VertexBuffer";
import { mat4 } from "gl-matrix";
import { Color } from "./Color";

export class SimpleShader {
  gl: WebGL2RenderingContext;
  compiledShader: WebGLProgram;
  vertexPositionRef: number;
  pixelColorRef: WebGLUniformLocation;
  modelMatrixRef: WebGLUniformLocation;
  cameraXformMatrix: WebGLUniformLocation;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.gl = gl;

    this.compiledShader = this.gl.createProgram()!;
    this.init(vertexShaderSource, fragmentShaderSource);

    this.vertexPositionRef = this.gl.getAttribLocation(
      this.compiledShader!,
      "aVertexPosition"
    );

    this.pixelColorRef = this.getUniformLocation("uPixelColor");
    this.modelMatrixRef = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");
  }

  private init(vertexShaderSource: string, fragmentShaderSource: string) {
    const vertexShader = this.initAndCompileShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    )!;

    const fragmentShader = this.initAndCompileShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    )!;

    this.gl.attachShader(this.compiledShader, vertexShader);
    this.gl.attachShader(this.compiledShader, fragmentShader);
    this.gl.linkProgram(this.compiledShader);

    if (
      !this.gl.getProgramParameter(this.compiledShader, this.gl.LINK_STATUS)
    ) {
      throw new EngineError(SimpleShader.name, "Failed to link shader");
    }
  }

  public activate(
    vertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    this.gl.useProgram(this.compiledShader);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer.vertexBuffer);

    this.gl.vertexAttribPointer(
      this.vertexPositionRef,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.vertexPositionRef);

    this.gl.uniform4fv(this.pixelColorRef, pixelColor.getNormalizedArray());
    this.gl.uniformMatrix4fv(this.modelMatrixRef, false, trsMatrix);
    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);
  }

  private getUniformLocation(parameter: string) {
    const parameterRef = this.gl.getUniformLocation(
      this.compiledShader,
      parameter
    );

    if (parameterRef === null) {
      throw new EngineError(
        SimpleShader.name,
        `Could not find reference for shader ${parameter} parameter`
      );
    }

    return parameterRef;
  }

  private initAndCompileShader(
    shaderSource: string,
    shaderType: number
  ): WebGLShader {
    const compiledShader: WebGLShader | null = this.gl.createShader(shaderType);

    if (compiledShader === null) {
      throw new EngineError(SimpleShader.name, "Failed to compile shader");
    }

    this.gl.shaderSource(compiledShader, shaderSource);
    this.gl.compileShader(compiledShader);

    if (!this.gl.getShaderParameter(compiledShader, this.gl.COMPILE_STATUS)) {
      throw new EngineError(
        SimpleShader.name,
        "A shader compiling error occurred: " +
          this.gl.getShaderInfoLog(compiledShader)
      );
    }

    return compiledShader;
  }
}
