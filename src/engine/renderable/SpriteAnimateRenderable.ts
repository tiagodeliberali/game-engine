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
import { RenderableAnimator, AnimationType } from ".";
import { AbstractRenderable } from "./AbstractRenderable";

export class SpriteAnimateRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture;
  rows: number;
  columns: number;
  animator: RenderableAnimator;

  constructor(texture: Texture, rows: number, columns: number) {
    const gl = getGL();
    const shader = ShaderLib.getSpriteShader(gl);
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, shader, vertexBuffer);

    this.color = Color.Transparent();

    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );

    // sprite sheet
    this.texture = texture;
    this.rows = rows;
    this.columns = columns;

    // animation state
    const setSprite = (position: number) => {
      this.setSpritePosition(
        this.texture.getSpritePositionLinear(this.rows, this.columns, position)
      );
    };
    this.animator = new RenderableAnimator(
      AnimationType.backwardToBeginingAnimator({
        initialPosition: 0,
        lastPosition: this.rows * this.columns - 1,
        speed: 5,
      }),
      setSprite
    );
  }

  public runInLoop() {
    this.animator.runInLoop();
  }

  public runOnce() {
    this.animator.runOnce();
  }

  public stopLooping() {
    this.animator.stopLooping();
  }

  private setSpritePosition(spritePosition: Box) {
    if (!spritePosition.isNormalized()) {
      spritePosition.normalize(this.texture.width, this.texture.height);
    }

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
    this.animator.animate();
  }
}
