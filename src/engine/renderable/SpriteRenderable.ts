import { ShaderLib, TextureShader, Texture } from "../graphics";
import { Color, Vec2d } from "..";
import { getResourceManager } from "../resources";
import { RenderableAnimator } from ".";
import { AbstractRenderable } from "./AbstractRenderable";
import { EngineError } from "../EngineError";
import { AnimationSettings } from "./animator";
import { DrawingResources } from "../core";

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

    return this;
  }

  runInLoop() {
    if (!this.animator) {
      throw new EngineError(SpriteRenderable.name, "Animator not initialized");
    }

    this.animator.runInLoop();

    return this;
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
    // run before init
    if (this.shader === undefined) {
      this.position = position;
    } else {
      this.shader.setSpritePosition(this.rows, this.columns, position);
    }
    return this;
  }

  setSpriteByRowColumn(row: number, column: number) {
    // run before init
    if (this.shader === undefined) {
      this.position = row * this.columns + column;
    } else {
      this.shader.setSpriteByRowColumn(this.rows, this.columns, row, column);
    }
    return this;
  }

  getCellSize(): Vec2d {
    if (this.shader === undefined) {
      throw new EngineError(
        SpriteRenderable.name,
        "getCellSize requested before defining the shader."
      );
    }

    return this.shader.getCellSize(this.rows, this.columns);
  }

  draw(resources: DrawingResources) {
    if (
      this.forceDraw ||
      resources.camera.isVisibleOnWC(this.getTransform().getPosition())
    )
      this.getActivatedShader(resources).drawSquare();
  }

  fastDraw(position: Vec2d) {
    this.shader?.updatePosition(
      this.trsMatrix.addToPosition(position).getTrsMatrix()
    );
    this.shader?.drawSquare();
  }
}
