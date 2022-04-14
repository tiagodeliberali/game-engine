import {
  Renderable,
  Vec2d,
  Audio,
  SimplifiedScene,
  Behavior,
  ResourceComponent,
  TextureRenderable,
} from "../engine";
import { Transform } from "../engine/graphics";
import { buildCharacter } from "./assets/Character";
import { SecondScene } from "./SecondScene";

const stageCuePath = "/sounds/change_level.wav";

const timestamp = performance.now();

const blueSquareBehavior = (transform: Transform) => {
  transform.addToRotationInDegree(10);
  const scale = Math.min(15 + (performance.now() - timestamp!) / 300, 50);

  transform.setScale(new Vec2d(scale, scale));
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
  scene.pushComponent(blueSquare);
  scene.pushComponent(
    new Behavior(() => {
      blueSquareBehavior(blueSquare.getTransform());
    })
  );

  const stageCue = new ResourceComponent(stageCuePath);
  scene.pushComponent(stageCue);

  const character = buildCharacter({
    position: new Vec2d(50, 25),
    scale: new Vec2d(6, 6),
    rotationInDegree: 0,
  });
  scene.pushComponent(character);
  scene.pushComponent(
    new Behavior(() => {
      if (
        character
          .getFirst<TextureRenderable>()!
          .getTransform()
          .getHorizontalPosition() > 100
      ) {
        stageCue.get<Audio>().playOnce();
        scene.goToScene(new SecondScene());
      }
    })
  );

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

  //   const text = FontRenderable.getDefaultFont("Ola Alice!");
  //   text.color.set({ red: 0, green: 200, blue: 0 });
  //   text.trsMatrix.setTransform({
  //     position: new Vec2d(10, 62),
  //     scale: new Vec2d(0.5, 1),
  //     rotationInDegree: 0,
  //   });
  //   this.pushComponent(text);
  // }
}
