import {
  ShaderLib,
  Camera,
  TextureShader,
  VertexBuffer,
  VertexBufferLib,
  Color,
} from "../graphics";
import { getResourceManager, Texture } from "../resources";
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
    const vertexBuffer = VertexBufferLib.UnitSquareCenteredOnZero();

    super(vertexBuffer);
    this.color = Color.Transparent();

    // sprite sheet
    this.textureVertexBuffer =
      VertexBufferLib.DynamicUnitSquareLeftBottonOnZero();
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
    this.shader = ShaderLib.getSpriteShader(this.gl);
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
  }
}
