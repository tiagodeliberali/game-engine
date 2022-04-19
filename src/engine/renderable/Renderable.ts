import { SimpleShader, VertexBufferLib, Camera, ShaderLib } from "../graphics";
import { AbstractRenderable } from "./AbstractRenderable";

export class Renderable extends AbstractRenderable<SimpleShader> {
  constructor() {
    const vertexBuffer = VertexBufferLib.UnitSquareCenteredOnZero();
    super(vertexBuffer);
  }

  static build() {
    return new Renderable();
  }

  load() {
    //
  }

  init() {
    this.shader = ShaderLib.getConstColorShader(this.gl);
  }

  update() {
    //
  }

  draw(camera: Camera) {
    this.shader!.activate(
      this.vertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
