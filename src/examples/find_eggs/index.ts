import {
  AnimationType,
  BasicScene,
  Camera,
  Color,
  GameObject,
  SpriteRenderable,
  Vec2d,
} from "../../engine";

export function findEggs() {
  const scene = new BasicScene(
    new Camera(Vec2d.from(0, 0), Vec2d.from(100, 50)),
    Color.Black()
  );

  const tiles = new GameObject();

  tiles.add(
    SpriteRenderable.build("./find_eggs/textures/cave_tiles.png", 34, 31, 109)
      .setTransform({ position: Vec2d.from(0, 0), scale: Vec2d.from(10, 10) })
      .setAnimator({
        initialPosition: 0,
        lastPosition: 31 * 34,
        speed: 10,
        type: AnimationType.ForwardToBegining,
      })
      .setSpriteByRowColumn(7, 5)
  );

  scene.add(tiles);

  return scene;
}
