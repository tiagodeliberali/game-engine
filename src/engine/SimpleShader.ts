import { EngineError } from "./EngineError";
import { VertexBuffer } from "./VertexBuffer";

export class SimpleShader {
  compiledShader: WebGLProgram | undefined;
  vertexPositionRef: number | undefined;
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  public activate(vertexBuffer: VertexBuffer) {
    if (!this.compiledShader) {
      throw new EngineError(SimpleShader.name, "Failed to initialize compiled");
    }

    if (this.vertexPositionRef === undefined) {
      throw new EngineError(
        SimpleShader.name,
        "Failed to initialize position reference"
      );
    }

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
  }

  public buildFromSources(vertexSource: string, fragmentSource: string) {
    const vertexShader = this.loadAndCompileShader(
      vertexSource,
      this.gl.VERTEX_SHADER
    )!;

    const fragmentShader = this.loadAndCompileShader(
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    )!;

    this.compiledShader = this.gl.createProgram()!;
    this.gl.attachShader(this.compiledShader, vertexShader);
    this.gl.attachShader(this.compiledShader, fragmentShader);
    this.gl.linkProgram(this.compiledShader);

    if (
      !this.gl.getProgramParameter(this.compiledShader, this.gl.LINK_STATUS)
    ) {
      throw new EngineError(SimpleShader.name, "Failed to link shader");
    }

    this.vertexPositionRef = this.gl.getAttribLocation(
      this.compiledShader,
      "aVertexPosition"
    );
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
