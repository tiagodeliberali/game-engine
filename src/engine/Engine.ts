import { VertexBuffer } from "./VertexBuffer";
import { SimpleShader } from "./SimpleShader";
import { initGL } from "./GL";

export class Engine {
  readonly gl: WebGL2RenderingContext;
  shader: SimpleShader | undefined;

  constructor(htmlCanvasID: string) {
    this.gl = initGL(htmlCanvasID);
  }

  private getShader(): SimpleShader {
    if (this.shader === undefined) {
      this.shader = new SimpleShader(this.gl);
    }
    return this.shader;
  }

  public drawSquare(color: number[]) {
    const vertexBuffer = new VertexBuffer(this.gl);
    vertexBuffer.loadSquare();

    this.getShader().activate(vertexBuffer, color);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  public clearCanvas() {
    this.gl.clearColor(0.0, 0.5, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
