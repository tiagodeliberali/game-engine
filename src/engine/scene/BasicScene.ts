import { Camera, Color, Viewport, clearCanvas } from "../graphics";
import { AbstractScene } from ".";
import { GameObject } from "..";
import { IComponent } from "../behaviors";

export class BasicScene extends AbstractScene {
  protected camera: Camera;
  protected viewport: Viewport;
  protected color: Color;
  protected gameObjects: GameObject;

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
    this.gameObjects = new GameObject();
  }

  pushComponent(component: IComponent) {
    this.gameObjects.add(GameObject.FromComponent(component));
  }

  load() {
    this.gameObjects.load();
  }

  init() {
    this.gameObjects.init();
  }

  update() {
    this.gameObjects.update();
  }

  draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    this.gameObjects.draw(this.camera);
  }

  unload() {
    this.gameObjects.unload();
  }
}
