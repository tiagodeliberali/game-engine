import { clearCanvas } from "../GL";
import { Camera, Color, Viewport } from "../graphics";
import { IRenderable } from "../renderable";
import { AbstractScene } from ".";
import { GameObject } from "../GameObject";

export class BasicScene extends AbstractScene {
  protected camera: Camera;
  protected viewport: Viewport;
  protected color: Color;
  protected renderables: IRenderable[] = [];
  protected gameObjects: GameObject[] = [];

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
  }

  public load() {
    this.gameObjects.forEach((gameObject) => gameObject.load());
  }

  public init() {
    this.gameObjects.forEach((gameObject) => gameObject.init());
  }

  public update() {
    this.gameObjects.forEach((gameObject) => gameObject.update());
  }

  public draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    this.renderables.forEach((renderable) => renderable.draw(this.camera!));
    this.gameObjects.forEach((gameObject) => gameObject.draw(this.camera));
  }

  unload() {
    this.renderables.forEach((renderable) => {
      renderable.unload();
    });

    this.gameObjects.forEach((gameObject) => {
      gameObject.unload();
    });
  }
}
