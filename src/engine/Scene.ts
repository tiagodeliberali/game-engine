import { clearCanvas } from "./GL";
import { Camera } from "./graphics/Camera";
import { Color } from "./graphics/Color";
import { Renderable } from "./graphics/Renderable";

export interface SceneDef {
  init: () => void;
  draw: () => void;
  update: () => void;
}

export class BasicScene implements SceneDef {
  protected camera: Camera | undefined;
  protected renderables: Renderable[] = [];
  private color: Color;

  constructor(canvasColor: Color) {
    this.color = canvasColor;
  }

  init() {
    //
  }

  public draw() {
    clearCanvas(this.color);

    if (this.camera === undefined) {
      return;
    }

    this.camera.drawViewport();
    this.renderables.forEach((bloco) => bloco.draw(this.camera!));
  }

  update() {
    //
  }
}
