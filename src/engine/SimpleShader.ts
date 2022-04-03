import { EngineError } from "./EngineError";
import { VertexBuffer } from "./VertexBuffer";
import SimpleVertexSshader from "../shader/simple_vs.glsl";
import SimpleFragmentShader from "../shader/simple_fs.glsl";
import { mat4 } from "gl-matrix";
import { Color } from "./Color";

export class SimpleShader {
  gl: WebGL2RenderingContext;
  compiledShader: WebGLProgram | undefined;
  vertexPositionRef: number | undefined;
  pixelColorRef: WebGLUniformLocation | undefined;
  modelMatrixRef: WebGLUniformLocation | undefined;
  cameraXformMatrix: WebGLUniformLocation | undefined;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.build();
  }

  private build() {
    this.commonBuild(SimpleVertexSshader, SimpleFragmentShader);

    this.vertexPositionRef = this.gl.getAttribLocation(
      this.compiledShader!,
      "aVertexPosition"
    );

    this.pixelColorRef = this.getUniformLocation("uPixelColor");
    this.modelMatrixRef = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");
  }

  public activate(
    vertexBuffer: VertexBuffer,
    pixelColor: Color,
    trsMatrix: mat4,
    cameraMatrix: mat4
  ) {
    this.commonActivate(vertexBuffer);

    // # vertexPositionRef configuration
    if (this.vertexPositionRef === undefined) {
      throw new EngineError(
        SimpleShader.name,
        "Failed to initialize position reference"
      );
    }

    this.gl.vertexAttribPointer(
      this.vertexPositionRef,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.vertexPositionRef);

    // # pixelColorRef configuration
    if (this.pixelColorRef === undefined) {
      throw new EngineError(
        SimpleShader.name,
        "Failed to initialize pixel color reference"
      );
    }

    this.gl.uniform4fv(this.pixelColorRef, pixelColor.getNormalizedArray());

    // # pixelColorRef configuration
    if (this.modelMatrixRef === undefined) {
      throw new EngineError(
        SimpleShader.name,
        "Failed to initialize model matrix reference"
      );
    }

    this.gl.uniformMatrix4fv(this.modelMatrixRef, false, trsMatrix);

    // # pixelColorRef configuration
    if (this.cameraXformMatrix === undefined) {
      throw new EngineError(
        SimpleShader.name,
        "Failed to initialize camera matrix reference"
      );
    }

    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);
  }

  private commonBuild(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const vertexShader = this.loadAndCompileShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    )!;

    const fragmentShader = this.loadAndCompileShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    )!;

    this.compiledShader = this.gl.createProgram()!;
    this.gl.attachShader(this.compiledShader, vertexShader);
    this.gl.attachShader(this.compiledShader, fragmentShader);
    this.gl.linkProgram(this.compiledShader);

    if (
      !this.gl.getProgramParameter(this.compiledShader!, this.gl.LINK_STATUS)
    ) {
      throw new EngineError(SimpleShader.name, "Failed to link shader");
    }
  }

  private commonActivate(vertexBuffer: VertexBuffer) {
    if (this.compiledShader === undefined) {
      throw new EngineError(SimpleShader.name, "Failed to initialize compiled");
    }

    this.gl.useProgram(this.compiledShader);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer.vertexBuffer);
  }

  private getUniformLocation(parameter: string) {
    const parameterRef = this.gl.getUniformLocation(
      this.compiledShader!,
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

  private loadAndCompileShader(
    shaderSource: string,
    shaderType: number
  ): WebGLShader {
    const compiledShader: WebGLShader | null = this.gl.createShader(shaderType);

    this.gl.shaderSource(compiledShader!, shaderSource);
    this.gl.compileShader(compiledShader!);

    if (!this.gl.getShaderParameter(compiledShader!, this.gl.COMPILE_STATUS)) {
      throw new EngineError(
        SimpleShader.name,
        "A shader compiling error occurred: " +
          this.gl.getShaderInfoLog(compiledShader!)
      );
    }

    if (!compiledShader) {
      throw new EngineError(SimpleShader.name, "Failed to compile shader");
    }

    return compiledShader;
  }
}
