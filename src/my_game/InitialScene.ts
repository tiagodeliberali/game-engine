import {
  Renderable,
  Vec2d,
  Audio,
  SimplifiedScene,
  Behavior,
  ResourceComponent,
  TextureRenderable,
  ITransformable,
  FontRenderable,
  rotate,
  BoundingBox,
  GameObject,
} from "../engine";
import { buildCharacter } from "./assets/Character";
import { pong } from ".";

const stageCuePath = "/sounds/change_level.wav";

const timestamp = performance.now();

const blueSquareBehavior = (transform: ITransformable) => {
  transform.addToRotationInDegree(10);

  const scale = Math.min(15 + (performance.now() - timestamp) / 300, 50);
  transform.setTransform({ scale: new Vec2d(scale, scale) });
};

const createBlueSquare = () => {
  const blueSquare = new Renderable();
  blueSquare.setColor({ red: 100, green: 0, blue: 255 });
  blueSquare.setTransform({
    position: new Vec2d(50, 25),
    scale: new Vec2d(15, 15),
    rotationInDegree: 25,
  });

  const gameObject = new GameObject();
  gameObject.add(blueSquare);
  gameObject.add(
    new Behavior(() => {
      blueSquareBehavior(blueSquare);
    })
  );

  return gameObject;
};

export function buildInitialScene() {
  const scene = new SimplifiedScene(100, 50);

  scene.add(createBlueSquare());

  const character = buildCharacter({
    position: new Vec2d(50, 25),
    scale: new Vec2d(6, 6),
    rotationInDegree: 0,
  });

  const stageCue = new ResourceComponent(stageCuePath);
  character.add(stageCue);
  character.add(
    new Behavior(() => {
      const caracterRenderable = character.getFirst<TextureRenderable>();
      if (
        caracterRenderable &&
        caracterRenderable.getTransform().getPosition().x > 100
      ) {
        stageCue.get<Audio>().playOnce();
        scene.goToScene(pong());
      }
    })
  );
  scene.add(character);

  const redSquare = new Renderable();
  redSquare.setColor({ red: 255, green: 0, blue: 0 });
  redSquare.setTransform({
    position: new Vec2d(10, 10),
    scale: new Vec2d(7, 7),
    rotationInDegree: 0,
  });
  scene.add(redSquare);
  scene.add(rotate(redSquare, character, 0.5));

  const text = FontRenderable.getDefaultFont("Ola Alice!");
  text.setColor({ red: 100, green: 200, blue: 100, alpha: 1 });
  text.setTransform({
    position: new Vec2d(20, 40),
    scale: new Vec2d(3, 3),
    rotationInDegree: 0,
  });
  scene.add(text);

  const redSquareBoundingBox = BoundingBox.from(redSquare, "");

  scene.add(redSquareBoundingBox);

  const characterBoundingBox = BoundingBox.withAction(character, "", {
    onCollideStarted: () => text.setText("Collided!!!"),
    onCollideEnded: () => text.setText("Collision ended..."),
  });
  characterBoundingBox.add(redSquareBoundingBox);
  scene.add(characterBoundingBox);

  return scene;
}
