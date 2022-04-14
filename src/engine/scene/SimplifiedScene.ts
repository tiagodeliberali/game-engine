import { clearCanvas } from "../GL";
import { Camera, Color, Viewport } from "../graphics";
import { AbstractScene } from ".";
import { GameObject, Vec2d } from "..";
import { IComponent } from "../behaviors";

export class SimplifiedScene extends AbstractScene {
  private camera: Camera;
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
