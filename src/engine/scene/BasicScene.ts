import { clearCanvas } from "../GL";
import { Camera } from "../graphics/Camera";
import { Color } from "../graphics/Color";
import { Renderable } from "../graphics/Renderable";
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
