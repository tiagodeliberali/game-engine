import { BasicScene, Camera, Color, Vec2d } from "../../engine";

export function findEggs() {
  const scene = new BasicScene(
    new Camera(Vec2d.from(0, 0), Vec2d.from(100, 50)),
    Color.Black()
  );

  return scene;
}
