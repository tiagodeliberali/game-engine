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

export class SpriteAnimateRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture;
  rows: number;
  columns: number;
  isPlaying: boolean;
  isLooping: boolean;
  speed: number;
  currentPosition: number;
  currenfFrame: number;

  constructor(texture: Texture, rows: number, columns: number) {
    const gl = getGL();
    const shader = ShaderLib.getSpriteShader(gl);
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, shader, vertexBuffer);

    this.color = Color.Transparent();

    // sprite sheet
    this.texture = texture;
    this.rows = rows;
    this.columns = columns;

    // animation state
    this.isPlaying = false;
    this.isLooping = false;
    this.speed = 1;
    this.currentPosition = 0;
    this.currenfFrame = 0;

    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );

    this.setSpritePosition(
      this.texture.getSpritePositionLinear(
        this.rows,
        this.columns,
        this.currentPosition
      )
    );
  }

  public runInLoop(numberOfFrames: number) {
    this.isPlaying = true;
    this.isLooping = true;
    this.speed = numberOfFrames;
  }

  public runOnce(numberOfFrames: number) {
    this.isPlaying = true;
    this.isLooping = false;
    this.speed = numberOfFrames;
  }

  public stopLooping() {
    this.isLooping = false;
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
    this.animate();
  }

  animate() {
    if (!this.isPlaying) {
      return;
    }

    this.setCurrentPosition();
    this.setSpritePosition(
      this.texture.getSpritePositionLinear(
        this.rows,
        this.columns,
        this.currentPosition
      )
    );
  }

  setCurrentPosition() {
    if (!this.shouldUpdatePosition()) {
      return;
    }

    this.currentPosition++;

    if (this.currentPosition >= this.rows * this.columns) {
      this.isPlaying = this.isLooping;
      this.currentPosition = 0;
    }
  }

  shouldUpdatePosition(): boolean {
    this.currenfFrame++;
    if (this.currenfFrame % this.speed === 0) {
      this.currenfFrame = 0;
      return true;
    }
    return false;
  }
}
