import {
  ShaderLib,
  Camera,
  TextureShader,
  VertexBuffer,
  Color,
} from "../graphics";
import { getResourceManager, Texture } from "../resources";
import { getGL } from "../GL";
import { Box } from "../DataStructures";
import { RenderableAnimator } from ".";
import { AbstractRenderable } from "./AbstractRenderable";
import { EngineError } from "../EngineError";
import { AnimationSettings } from "./animator";

export class SpriteRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture | undefined;
  texturePath: string;
  rows: number;
  columns: number;
  animator: RenderableAnimator | undefined;
  position: number;

  constructor(
    texturePath: string,
    rows: number,
    columns: number,
    position: number
  ) {
    const gl = getGL();
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, vertexBuffer);
    this.color = Color.Transparent();

    // sprite sheet
    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );
    this.texturePath = texturePath;
    this.rows = rows;
    this.columns = columns;
    this.position = position;
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.shader = ShaderLib.getSpriteShader(this.gl);
    this.texture = getResourceManager().get<Texture>(this.texturePath);
    this.setSprite(this.position);
  }

  update() {
    //
  }

  setAnimator(settings: AnimationSettings) {
    this.animator = new RenderableAnimator(settings, (position) =>
      this.setSprite(position)
    );
  }

  runInLoop() {
    if (!this.animator) {
      throw new EngineError(SpriteRenderable.name, "Animator not initialized");
    }

    this.animator.runInLoop();
  }

  runOnce() {
    if (!this.animator) {
      throw new EngineError(SpriteRenderable.name, "Animator not initialized");
    }

    this.animator.runOnce();
  }

  stopLooping() {
    if (!this.animator) {
      throw new EngineError(SpriteRenderable.name, "Animator not initialized");
    }

    this.animator.stopLooping();
  }

  setSprite(position: number) {
    this.setSpritePosition(
      this.texture!.getSpritePositionLinear(this.rows, this.columns, position)
    );
  }

  private setSpritePosition(spritePosition: Box) {
    if (!spritePosition.isNormalized()) {
      spritePosition.normalize(this.texture!.width, this.texture!.height);
    }

    this.textureVertexBuffer.setTextureCoordinate(
      spritePosition.getElementUVCoordinateArray()
    );
  }

  draw(camera: Camera) {
    this.texture!.activate();
    this.shader!.activate(
      this.vertexBuffer,
      this.textureVertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.animator && this.animator.animate();
  }
}
