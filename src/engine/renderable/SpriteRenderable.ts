import { ShaderLib, Camera, TextureShader, Color } from "../graphics";
import { getResourceManager, Texture } from "../resources";
import { Box } from "../DataStructures";
import { RenderableAnimator } from ".";
import { AbstractRenderable } from "./AbstractRenderable";
import { EngineError } from "../EngineError";
import { AnimationSettings } from "./animator";

export class SpriteRenderable extends AbstractRenderable<TextureShader> {
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
    super();
    this.color = Color.Transparent();

    // sprite sheet
    this.texturePath = texturePath;
    this.rows = rows;
    this.columns = columns;
    this.position = position;
  }

  static build(
    texturePath: string,
    rows: number,
    columns: number,
    position: number
  ) {
    return new SpriteRenderable(texturePath, rows, columns, position);
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.shader = ShaderLib.getTextureShader();
    this.shader.initBuffers(
      [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0],
      [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    );

    this.texture = getResourceManager().get<Texture>(this.texturePath);
    this.setSprite(this.position);
  }

  update() {
    this.animator && this.animator.animate();
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
      spritePosition = spritePosition.normalize(
        this.texture!.width,
        this.texture!.height
      );
    }

    this.shader!.setTextureCoordinate(
      spritePosition.getElementUVCoordinateArray()
    );
  }

  draw(camera: Camera) {
    this.texture!.activate();
    this.shader!.draw(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
  }
}
