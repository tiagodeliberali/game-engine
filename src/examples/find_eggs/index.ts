import {
  AnimationType,
  BasicScene,
  BoundingBox,
  Camera,
  clampAtBoundary,
  Color,
  GameObject,
  isKeyClicked,
  Keys,
  Movement,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
  Viewport,
  walk2d,
} from "../../engine";
import { Oscillate, Shake, Shake2d } from "../../engine/behaviors";

export function findEggs() {
  const mainCamera = new Camera(
    Vec2d.from(0, 0),
    Vec2d.from(16, 8),
    Viewport.Default(Color.Black())
  );

  const mapCamera = new Camera(
    Vec2d.from(0, 0),
    Vec2d.from(51, 25),
    Viewport.build(Vec2d.from(5, 5), Vec2d.from(150, 75), Color.Black(), 1)
  );
  const scene = new BasicScene([mainCamera, mapCamera]);

  const characterGameObject = character(mainCamera);
  const tiles = createScenario(characterGameObject);

  const egg = new GameObject();
  let oscillateObject: Shake2d;
  egg
    .add(
      TextureRenderable.build("./find_eggs/textures/red_egg.png").setTransform({
        scale: Vec2d.from(0.6, 0.6),
      })
    )
    .withBehavior(() => {
      if (oscillateObject === undefined) {
        oscillateObject = new Shake2d(
          Vec2d.from(0.05, 0.05),
          Vec2d.from(5, 5),
          1200
        );
      } else {
        egg.addToPosition(oscillateObject.getNext());
      }
    });
  egg.setTransform({
    position: Vec2d.from(10, 5),
  });

  scene.add(tiles);
  scene.add(characterGameObject);
  scene.add(egg);

  return scene;
}

const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();
  tiles
    .add(
      TextureRenderable.build("./find_eggs/textures/map.png").setTransform({
        scale: Vec2d.from(51, 25),
      })
    )
    .withBoundingBox("scenario", Vec2d.from(0.8, 0.8))
    .withBehavior(() => {
      const tileBoundingBox = tiles.getLastComponent<BoundingBox>(
        BoundingBox.name
      );
      const characterBoundingBox =
        characterGameObject.getLastComponent<BoundingBox>(BoundingBox.name);

      if (tileBoundingBox === undefined || characterBoundingBox === undefined) {
        return;
      }

      clampAtBoundary(tileBoundingBox, characterBoundingBox);
    });
  return tiles;
};

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
    .withBoundingBox("character")
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
