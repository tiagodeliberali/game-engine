import { Camera, Color, Viewport } from "..";
import { AbstractScene } from ".";
import { GameObject, Vec2d } from "..";

export class SimplifiedScene extends AbstractScene {
  constructor(width: number, height: number) {
    super([
      new Camera(
        new Vec2d(width / 2, height / 2),
        new Vec2d(width, height),
        Viewport.Default(Color.Black())
      ),
    ]);
    this.gameObjects = new GameObject();
  }

  draw() {
    super.draw();
  }
}
