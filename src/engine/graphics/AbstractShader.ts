import { getGL } from "..";
import { EngineError } from "../EngineError";

export abstract class AbstractShader {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = getGL();

    this.program = this.compileProgram(
      vertexShaderSource,
      fragmentShaderSource
    );
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
