import { Camera, Color, Viewport, clearCanvas } from "..";
import { AbstractScene } from ".";
import { GameObject, Vec2d } from "..";
import { IComponent } from "../behaviors";

export class SimplifiedScene extends AbstractScene {
  camera: Camera;
  private viewport: Viewport;
  private gameObjects: GameObject;
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
