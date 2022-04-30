import { mat4 } from "gl-matrix";
import {
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  VertexBuffer,
} from ".";
import { Color, getGL } from "..";
import { EngineError } from "../EngineError";

export abstract class AbstractShader {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  vertexPositionBuffer: VertexBuffer;
  pixelColorLocation: WebGLUniformLocation;
  globalAmbientColorLocation: WebGLUniformLocation;
  globalAmbientIntensityLocation: WebGLUniformLocation;
  modelMatrixLocation: WebGLUniformLocation;
  cameraXformMatrix: WebGLUniformLocation;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = getGL();

    this.program = this.compileProgram(
      vertexShaderSource,
      fragmentShaderSource
    );

    this.vertexPositionBuffer = new VertexBuffer(
      this.getAttribLocation("aVertexPosition"),
      3
    );

    this.pixelColorLocation = this.getUniformLocation("uPixelColor");
    this.globalAmbientColorLocation = this.getUniformLocation(
      "uGlobalAmbientColor"
    );
    this.globalAmbientIntensityLocation = this.getUniformLocation(
      "uGlobalAmbientIntensity"
    );

    this.modelMatrixLocation = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");
  }

  drawExtension() {
    //virtual method
  }

  draw(pixelColor: Color, trsMatrix: mat4, cameraMatrix: mat4) {
    this.gl.useProgram(this.program);

    this.gl.uniform4fv(
      this.pixelColorLocation,
      pixelColor.getNormalizedArray()
    );
    this.gl.uniform4fv(
      this.globalAmbientColorLocation,
      getGlobalAmbientColor()
    );
    this.gl.uniform1f(
      this.globalAmbientIntensityLocation,
      getGlobalAmbientIntensity()
    );
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, trsMatrix);
    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);

    this.drawExtension();

    this.vertexPositionBuffer.activate();
    this.vertexPositionBuffer.drawSquare();
  }

  protected getUniformLocation(parameter: string) {
    const parameterLocation = this.gl.getUniformLocation(
      this.program,
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
    return this.gl.getAttribLocation(this.program, name);
  }

  private compileProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram {
    const program = this.gl.createProgram();

    if (program === null) {
      throw new EngineError(
        AbstractShader.name,
        "Call to createProgram returned null"
      );
    }

    const vertexShader = this.createShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    );

    const fragmentShader = this.createShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new EngineError(AbstractShader.name, "Failed to link shader");
    }

    return program;
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
