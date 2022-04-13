import { clearCanvas } from "../GL";
import { Camera, Color, Viewport } from "../graphics";
import { AbstractScene } from ".";
import { GameObject } from "..";
import { IComponent } from "../behaviors";

export abstract class BasicScene extends AbstractScene {
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

  public load() {
    this.gameObjects.load();
  }

  public init() {
    this.gameObjects.init();
  }

  public update() {
    this.gameObjects.update();
  }

  public draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    this.gameObjects.draw(this.camera);
  }

  unload() {
    this.gameObjects.unload();
  }
}
