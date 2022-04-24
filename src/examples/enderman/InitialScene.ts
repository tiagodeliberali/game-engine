import {
  Renderable,
  Vec2d,
  SimplifiedScene,
  ResourceComponent,
  ITransformable,
  FontRenderable,
  rotate,
  GameObject,
  Audio,
} from "../../engine";
import { buildCharacter } from "./assets/Character";
import { SecondScene } from "./SecondScene";

const stageCuePath = "/sounds/change_level.wav";

export function buildInitialScene() {
  const scene = new SimplifiedScene(100, 50);

  scene.add(createBlueSquare());

  const text = FontRenderable.getDefaultFont("Ola Alice!")
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: new Vec2d(20, 40),
      scale: new Vec2d(3, 3),
      rotationInDegree: 0,
    });

  scene.add(text);

  const stageCue = new ResourceComponent(stageCuePath);
  scene.add(stageCue);

  const { characterGameObject, characterHelper } = buildCharacter({
    position: new Vec2d(50, 25),
    scale: new Vec2d(6, 6),
    rotationInDegree: 0,
  });

  scene.add(characterGameObject);

  characterHelper
    .withBehavior<ITransformable>((character) => {
      if (character && character.getTransform().getPosition().x > 100) {
        stageCue.get<Audio>().playOnce();
        scene.goToScene(new SecondScene());
      }
    })
    .withBoundingBox<ITransformable>("", Vec2d.from(1, 1), () => {
      return {
        onCollideStarted: () => text.setText("Collided!!!"),
        onCollideEnded: () => text.setText("Collision ended..."),
      };
    });

  scene.add(createRedSquare(characterHelper.getComponent<ITransformable>()));

  return scene;
}

const timestamp = performance.now();

const blueSquareBehavior = (transform: ITransformable) => {
  transform.addToRotationInDegree(10);

  const scale = Math.min(15 + (performance.now() - timestamp) / 300, 50);
  transform.setTransform({ scale: new Vec2d(scale, scale) });
};

const createBlueSquare = () => {
  const gameObject = new GameObject();
  gameObject
    .add(
      Renderable.build()
        .setColor({ red: 100, green: 0, blue: 255 })
        .setTransform({
          position: new Vec2d(50, 25),
          scale: new Vec2d(15, 15),
          rotationInDegree: 25,
        })
    )
    .withBehavior<Renderable>((blueSquare) => blueSquareBehavior(blueSquare));
  return gameObject;
};

const createRedSquare = (character: ITransformable) => {
  const gameObject = new GameObject();

  gameObject
    .add(
      Renderable.build()
        .setColor({ red: 255, green: 0, blue: 0 })
        .setTransform({
          position: new Vec2d(10, 10),
          scale: new Vec2d(7, 7),
          rotationInDegree: 0,
        })
    )
    .withBehavior<Renderable>((redSquare) => rotate(redSquare, character, 0.5))
    .withBoundingBox("");

  return gameObject;
};
