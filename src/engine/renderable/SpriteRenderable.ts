import {
  ShaderLib,
  Camera,
  TextureShader,
  VertexBuffer,
  Color,
} from "../graphics";
import { Texture } from "../resources";
import { getGL } from "../GL";
import { Box } from "../DataStructures";
import { AbstractRenderable } from "./AbstractRenderable";

export class SpriteRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture;

  constructor(texture: Texture, spritePosition: Box) {
    const gl = getGL();
    const shader = ShaderLib.getSpriteShader(gl);
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, shader, vertexBuffer);

    this.color = Color.Transparent();
    this.texture = texture;

    if (!spritePosition.isNormalized()) {
      spritePosition.normalize(texture.width, texture.height);
    }

    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );
    this.textureVertexBuffer.setTextureCoordinate(
      spritePosition.getElementUVCoordinateArray()
    );
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
