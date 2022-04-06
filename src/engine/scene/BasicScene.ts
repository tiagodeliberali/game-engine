import { clearCanvas } from "../GL";
import { Camera, Color, Renderable } from "../graphics";
import { AbstractScene } from "./AbstractScene";

export class BasicScene extends AbstractScene {
  private camera: Camera;
  private color: Color;
  protected renderables: Renderable[] = [];

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.color = canvasColor;
  }

  public draw() {
    clearCanvas(this.color);
    this.camera.drawViewport();
    this.renderables.forEach((bloco) => bloco.draw(this.camera!));
  }
}
