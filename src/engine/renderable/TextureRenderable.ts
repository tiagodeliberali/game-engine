import {
  ShaderLib,
  TextureShader,
  VertexBuffer,
  Camera,
  Color,
} from "../graphics";
import { Texture } from "../resources";
import { getGL } from "../GL";
import { AbstractRenderable } from "./AbstractRenderable";

export class TextureRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture;

  constructor(texture: Texture) {
    const gl = getGL();
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);
    const shader = ShaderLib.getTextureShader(gl);

    super(gl, shader, vertexBuffer);

    this.color = Color.Transparent();
    this.textureVertexBuffer = VertexBuffer.UnitSquareLeftBottonOnZero(this.gl);
    this.texture = texture;
  }

  public draw(camera: Camera) {
    this.texture.activate();
    this.shader.activate(
      this.vertexBuffer,
      this.textureVertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
