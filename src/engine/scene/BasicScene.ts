import { Camera, Color, Viewport, clearCanvas } from "..";
import { AbstractScene } from ".";
import { IComponent } from "../behaviors";

export class BasicScene extends AbstractScene {
  protected camera: Camera;
  protected viewport: Viewport;
  protected color: Color;

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
  }

  pushComponent(component: IComponent) {
    this.gameObjects.add(component);
  }

  load() {
    super.load();
    this.gameObjects.load();
  }

  init() {
    super.init();
    this.gameObjects.init();
  }

  update() {
    super.update();
    this.gameObjects.update();
  }

  draw() {
    super.draw();
    clearCanvas(this.color);
    this.viewport.draw();
    this.gameObjects.draw(this.camera);
  }

  unload() {
    super.unload();
    this.gameObjects.unload();
  }
}
