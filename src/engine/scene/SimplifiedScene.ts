import { Camera, Color, Viewport, clearCanvas } from "..";
import { AbstractScene } from ".";
import { GameObject, Vec2d } from "..";

export class SimplifiedScene extends AbstractScene {
  private viewport: Viewport;
  private color: Color;

  constructor(width: number, height: number) {
    super(
      new Camera(new Vec2d(width / 2, height / 2), new Vec2d(width, height))
    );
    this.color = Color.Black();
    this.viewport = Viewport.Default(this.color);
    this.gameObjects = new GameObject();
  }

  draw() {
    clearCanvas(this.color);
    this.viewport.draw();
    super.draw();
  }
}
