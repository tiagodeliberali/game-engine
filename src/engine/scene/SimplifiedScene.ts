import { Camera, Color, Viewport, clearCanvas } from "..";
import { AbstractScene } from ".";
import { GameObject, Vec2d } from "..";
import { IComponent } from "../behaviors";

export class SimplifiedScene extends AbstractScene {
  camera: Camera;
  private viewport: Viewport;
  private color: Color;

  constructor(width: number, height: number) {
    super();
    this.camera = new Camera(
      new Vec2d(width / 2, height / 2),
      new Vec2d(width, height)
    );
    this.color = Color.Black();
    this.viewport = Viewport.Default(this.color);
    this.gameObjects = new GameObject();
  }

  add(component: IComponent) {
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
