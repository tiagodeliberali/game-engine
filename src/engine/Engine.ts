import { VertexBuffer } from "./VertexBuffer";
import { SimpleShader } from "./SimpleShader";
import { EngineError } from "./EngineError";

export class Engine {
  gl: WebGL2RenderingContext;
  shader: SimpleShader | undefined;

  constructor(htmlCanvasID: string) {
    const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
    this.gl =
      canvas.getContext("webgl2") ||
      (canvas.getContext("experimental-webgl2") as WebGL2RenderingContext);

    if (this.gl === null) {
      throw new EngineError(Engine.name, "WebGL not supported by the browser");
    }
  }

  private getShader(): SimpleShader {
    if (this.shader === undefined) {
      this.shader = new SimpleShader(this.gl);
    }
    return this.shader;
  }

  public drawSquare() {
    const vertexBuffer = new VertexBuffer(this.gl);
    vertexBuffer.loadSquare();

    this.getShader().activate(vertexBuffer, [0.5, 0.5, 0.5, 1]);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  public clearCanvas() {
    this.gl.clearColor(0.0, 0.5, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
