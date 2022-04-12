import { clearCanvas } from "../GL";
import { Camera, Color, Viewport } from "../graphics";
import { AbstractScene } from ".";
import { GameObjectSet } from "../behaviors";

export class BasicScene extends AbstractScene {
  protected camera: Camera;
  protected viewport: Viewport;
  protected color: Color;
  protected gameObjects: GameObjectSet;

  constructor(camera: Camera, canvasColor: Color) {
    super();
    this.camera = camera;
    this.viewport = Viewport.Default(canvasColor);
    this.color = canvasColor;
    this.gameObjects = new GameObjectSet();
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
