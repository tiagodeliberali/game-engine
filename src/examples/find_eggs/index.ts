import {
  AnimationType,
  BasicScene,
  Camera,
  Color,
  GameObject,
  isKeyClicked,
  Keys,
  Movement,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
  walk2d,
} from "../../engine";

export function findEggs() {
  const camera = new Camera(Vec2d.from(0, 0), Vec2d.from(16, 8));
  const scene = new BasicScene(camera, Color.Black());

  const tiles = new GameObject();
  tiles.add(
    TextureRenderable.build("./find_eggs/textures/map.png").setTransform({
      scale: Vec2d.from(51, 25),
    })
  );

  scene.add(tiles);
  scene.add(character(camera));

  return scene;
}

const character = (camera: Camera) => {
  const gameObject = new GameObject();

  let lastMovement = Movement.idle;

  gameObject
    .add(
      SpriteRenderable.build("./find_eggs/textures/character.png", 8, 4, 0)
        .setTransform({ position: Vec2d.from(0, 0) })
        .setAnimator({
          initialPosition: 0,
          lastPosition: 3,
          speed: 10,
          type: AnimationType.ForwardToBegining,
        })
        .runInLoop()
    )
    .withBehavior(() => {
      // Camera follow user
      if (
        gameObject
          .getTransform()
          .getPosition()
          .sub(camera.getTransform().getPosition())
          .multiply(Vec2d.from(0.5, 1))
          .length() > 4
      ) {
        camera.panTo(gameObject.getTransform().getPosition());
      }
    })
    .withBehavior(() => {
      if (isKeyClicked(Keys.Q)) {
        camera.zoomTowards(gameObject, 0.5);
      }

      if (isKeyClicked(Keys.E)) {
        camera.zoomTowards(gameObject, 2);
      }
    })
    .withBehavior<SpriteRenderable>((character) => {
      // walk 2d + sprite animation
      walk2d(gameObject, 0.08, (movement) => {
        if (movement === lastMovement) {
          return;
        }

        lastMovement = movement;

        if (movement & Movement.left) {
          character
            .setAnimator({
              initialPosition: 20,
              lastPosition: 23,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.right) {
          character
            .setAnimator({
              initialPosition: 24,
              lastPosition: 27,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.up) {
          character
            .setAnimator({
              initialPosition: 28,
              lastPosition: 31,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.down) {
          character
            .setAnimator({
              initialPosition: 16,
              lastPosition: 19,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else {
          character
            .setAnimator({
              initialPosition: 0,
              lastPosition: 3,
              speed: 10,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        }
      });
    });

  return gameObject;
};