import { SimpleShader, VertexBuffer, Camera, ShaderLib } from "../graphics";
import { getGL } from "../GL";
import { AbstractRenderable } from "./AbstractRenderable";

export class Renderable extends AbstractRenderable<SimpleShader> {
  constructor() {
    const gl = getGL();
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);
    const shader = ShaderLib.getConstColorShader(gl);

    super(gl, shader, vertexBuffer);
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
}