import { clearCanvas } from "../GL";
import { Camera, Color, IRenderable, Viewport } from "../graphics";
import { AbstractScene } from "./AbstractScene";

export class BasicScene extends AbstractScene {
  protected camera: Camera;
  protected viewport: Viewport;
  protected color: Color;
  protected renderables: IRenderable[] = [];

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
  }

  public draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    this.renderables.forEach((renderable) => renderable.draw(this.camera!));
  }

  unload() {
    this.renderables.forEach((renderable) => {
      renderable.unload();
    });
  }
}
