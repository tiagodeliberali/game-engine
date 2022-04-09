import { SimpleShader } from "./SimpleShader";
import { getConstColorShader } from "./ShaderLib";
import { getGL } from "../GL";
import { VertexBuffer } from "./VertexBuffer";
import { Color } from "./Color";
import { Transform } from "./Transform";
import { Camera } from "./Camera";
import { IRenderable } from "./IRenderable";

export class Renderable implements IRenderable {
  gl: WebGL2RenderingContext;
  shader: SimpleShader;
  vertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;

  constructor() {
    this.gl = getGL();
    this.color = Color.Black();
    this.shader = getConstColorShader(this.gl);
    this.vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(this.gl);
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

  public getTransform() {
    return this.trsMatrix;
  }

  public unload() {
    //
  }
}
