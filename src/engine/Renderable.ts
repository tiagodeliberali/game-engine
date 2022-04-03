import { SimpleShader } from "./SimpleShader";
import { getConstColorShader } from "./ShaderLib";
import { getGL } from "./GL";
import { VertexBuffer } from "./VertexBuffer";

export class Renderable {
  private gl: WebGL2RenderingContext;
  private shader: SimpleShader;
  private vertexBuffer: VertexBuffer;
  color: number[];

  constructor() {
    this.gl = getGL();
    this.color = [0, 0, 0, 0];
    this.shader = getConstColorShader(this.gl);

    this.vertexBuffer = new VertexBuffer(this.gl);
    this.vertexBuffer.loadSquare();
  }

  public draw() {
    this.shader.activate(this.vertexBuffer, this.color);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
