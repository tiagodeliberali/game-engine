import { Camera, Color, Viewport, clearCanvas } from "..";
import { AbstractScene } from ".";

export class BasicScene extends AbstractScene {
  protected viewport: Viewport;
  protected color: Color;

  constructor(camera: Camera, canvasColor: Color) {
    super(camera);
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
  }

  draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    super.draw();
  }
}
