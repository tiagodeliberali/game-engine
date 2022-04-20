import { getGL } from "..";
import { EngineError } from "../EngineError";

export abstract class AbstractShader {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = getGL();

    this.program = this.gl.createProgram()!;
    this.compileProgram(vertexShaderSource, fragmentShaderSource);
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
  ) {
    const vertexShader = this.createShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    )!;

    const fragmentShader = this.createShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    )!;

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
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
