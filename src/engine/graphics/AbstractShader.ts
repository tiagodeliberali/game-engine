import { EngineError } from "../EngineError";
import { mat4 } from "gl-matrix";
import { Color, VertexBuffer } from ".";

export abstract class AbstractShader {
  gl: WebGL2RenderingContext;
  compiledShader: WebGLProgram;
  vertexPositionLocation: number;
  pixelColorLocation: WebGLUniformLocation;
  modelMatrixLocation: WebGLUniformLocation;
  cameraXformMatrix: WebGLUniformLocation;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.gl = gl;

    this.compiledShader = this.gl.createProgram()!;
    this.compileProgram(vertexShaderSource, fragmentShaderSource);

    this.vertexPositionLocation = this.getAttribLocation("aVertexPosition");

    this.pixelColorLocation = this.getUniformLocation("uPixelColor");
    this.modelMatrixLocation = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");
  }

  protected abstractActivate(
    vertexPositionBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    this.gl.useProgram(this.compiledShader);

    vertexPositionBuffer.activate(this.vertexPositionLocation);

    this.gl.uniform4fv(
      this.pixelColorLocation,
      pixelColor.getNormalizedArray()
    );
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, trsMatrix);
    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);
  }

  protected getUniformLocation(parameter: string) {
    const parameterLocation = this.gl.getUniformLocation(
      this.compiledShader,
      parameter
    );

    if (parameterLocation === null) {
      throw new EngineError(
        AbstractShader.name,
        `Could not find location for shader ${parameter} parameter`
      );
    }

    return parameterLocation;
  }

  protected getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.compiledShader, name);
  }

  private compileProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const vertexShader = this.createShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    )!;

    const fragmentShader = this.createShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    )!;

    this.gl.attachShader(this.compiledShader, vertexShader);
    this.gl.attachShader(this.compiledShader, fragmentShader);
    this.gl.linkProgram(this.compiledShader);

    if (
      !this.gl.getProgramParameter(this.compiledShader, this.gl.LINK_STATUS)
    ) {
      throw new EngineError(AbstractShader.name, "Failed to link shader");
    }
  }

  private createShader(shaderSource: string, shaderType: number): WebGLShader {
    const shader: WebGLShader | null = this.gl.createShader(shaderType);

    if (shader === null) {
      throw new EngineError(AbstractShader.name, "Failed to compile shader");
    }

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new EngineError(
        AbstractShader.name,
        "A shader compiling error occurred: " + this.gl.getShaderInfoLog(shader)
      );
    }

    return shader;
  }
}
