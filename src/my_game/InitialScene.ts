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
} from "../engine";
import { buildCharacter } from "./assets/Character";
import { SecondScene } from "./SecondScene";

const stageCuePath = "/sounds/change_level.wav";

const timestamp = performance.now();

const blueSquareBehavior = (transform: ITransformable) => {
  transform.addToRotationInDegree(10);

  const scale = Math.min(15 + (performance.now() - timestamp!) / 300, 50);
  transform.setTransform({ scale: new Vec2d(scale, scale) });
};

export function buildInitialScene() {
  const scene = new SimplifiedScene(100, 50);

  const blueSquare = new Renderable();
  blueSquare.color.set({ red: 100, green: 0, blue: 255 });
  blueSquare.setTransform({
    position: new Vec2d(50, 25),
    scale: new Vec2d(15, 15),
    rotationInDegree: 25,
  });
  scene.add(blueSquare);
  scene.add(
    new Behavior(() => {
      blueSquareBehavior(blueSquare);
    })
  );

  const stageCue = new ResourceComponent(stageCuePath);
  scene.add(stageCue);

  const character = buildCharacter({
    position: new Vec2d(50, 25),
    scale: new Vec2d(6, 6),
    rotationInDegree: 0,
  });
  scene.add(character);
  scene.add(
    new Behavior(() => {
      if (
        character.getFirst<TextureRenderable>()!.getTransform().getPosition()
          .x > 100
      ) {
        stageCue.get<Audio>().playOnce();
        scene.goToScene(new SecondScene());
      }
    })
  );

  const redSquare = new Renderable();
  redSquare.color.set({ red: 255, green: 0, blue: 0 });
  redSquare.setTransform({
    position: new Vec2d(10, 10),
    scale: new Vec2d(7, 7),
    rotationInDegree: 0,
  });
  scene.add(redSquare);
  scene.add(rotate(redSquare, character, 0.5));

  const text = FontRenderable.getDefaultFont("Ola Alice!");
  text.color.set({ red: 100, green: 200, blue: 100, alpha: 1 });
  text.setTransform({
    position: new Vec2d(20, 40),
    scale: new Vec2d(3, 3),
    rotationInDegree: 0,
  });
  scene.add(text);

  const redSquareBoundingBox = new BoundingBox(redSquare, 5, 5, {});

  scene.add(redSquareBoundingBox);

  const characterBoundingBox = new BoundingBox(character, 1, 1, {
    onCollideStarted: () => text.setText("Collided!!!"),
    onCollideEnded: () => text.setText("Collision ended..."),
  });
  characterBoundingBox.add(redSquareBoundingBox);
  scene.add(characterBoundingBox);

  return scene;

  // private buildCorners() {
  //   const leftUpCorner = new Renderable();
  //   leftUpCorner.color.set({ red: 0, green: 0, blue: 255 });
  //   leftUpCorner.trsMatrix.setPosition(new Vec2d(10, 65));
  //   this.pushComponent(leftUpCorner);

  //   const rightUpCorner = new Renderable();
  //   rightUpCorner.color.set({ red: 100, green: 100, blue: 255 });
  //   rightUpCorner.trsMatrix.setPosition(new Vec2d(30, 65));
  //   this.pushComponent(rightUpCorner);

  //   const rightDownCorner = new Renderable();
  //   rightDownCorner.color.set({ red: 100, green: 155, blue: 100 });
  //   rightDownCorner.trsMatrix.setPosition(new Vec2d(30, 55));
  //   this.pushComponent(rightDownCorner);

  //   const leftDownCorner = new Renderable();
  //   leftDownCorner.color.set({ red: 255, green: 100, blue: 100 });
  //   leftDownCorner.trsMatrix.setPosition(new Vec2d(10, 55));
  //   this.pushComponent(leftDownCorner);

  // }
}
