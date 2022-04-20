import { ShaderLib, TextureShader, Texture } from "../graphics";
import { Camera, Color } from "..";
import { getResourceManager } from "../resources";
import { RenderableAnimator } from ".";
import { AbstractRenderable } from "./AbstractRenderable";
import { EngineError } from "../EngineError";
import { AnimationSettings } from "./animator";

export class SpriteRenderable extends AbstractRenderable<TextureShader> {
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
      getResourceManager().get<Texture>(this.texturePath),
      [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0],
      [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    );

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
    if (this.shader === undefined) {
      throw new EngineError(
        SpriteRenderable.name,
        "Cannot run setSprite with undefined shader"
      );
    }

    this.shader.setSpritePosition(this.rows, this.columns, position);
  }

  draw(camera: Camera) {
    if (this.shader === undefined) {
      throw new EngineError(
        SpriteRenderable.name,
        "Cannot run draw with undefined shader"
      );
    }

    this.shader.draw(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
  }
}
