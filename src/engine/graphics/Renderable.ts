import { SimpleShader } from "./SimpleShader";
import { getConstColorShader } from "./ShaderLib";
import { getGL } from "../GL";
import { VertexBuffer } from "./VertexBuffer";
import { Color } from "./Color";
import { Transform } from "./Transform";
import { Camera } from "./Camera";

export class Renderable {
  protected gl: WebGL2RenderingContext;
  protected shader: SimpleShader;
  protected vertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;

  constructor() {
    this.gl = getGL();
    this.color = Color.Black();
    this.shader = getConstColorShader(this.gl);
    this.vertexBuffer = VertexBuffer.GetCachedSquare(this.gl);
    this.trsMatrix = new Transform();
  }

  public draw(camera: Camera) {
    this.shader.activate(
      this.vertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  unload() {
    //
  }
}
