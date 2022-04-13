import {
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Audio,
  FontRenderable,
  SpriteRenderable,
  GameObject,
} from "../engine";
import { buildCharacter } from "./assets/Character";
import { SecondScene } from "./SecondScene";

const stageCuePath = "/sounds/change_level.wav";

export class InitialScene extends BasicScene {
  timestamp: number | undefined;
  stageCue: Audio | undefined;
  blueSquare: Renderable | undefined;
  character: GameObject;

  constructor() {
    super(
      new Camera(new Vec2d(20, 60), new Vec2d(30, 15)),
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );

    this.buildCorners();

    this.character = buildCharacter({
      position: new Vec2d(20, 60),
      scale: new Vec2d(2, 2),
      rotationInDegree: 0,
    });
    this.gameObjects.add(this.character);
  }

  public load() {
    super.load();

    this.loadResource(stageCuePath);
  }

  public init() {
    super.init();

    this.timestamp = performance.now();
    this.stageCue = this.getResource<Audio>(stageCuePath);
  }

  public update() {
    super.update();

    this.blueSquareBehavior();
    this.characterBehavior();
  }

  private characterBehavior() {
    if (
      this.character
        .getFirst<SpriteRenderable>()!
        .getTransform()
        .getHorizontalPosition() > 35
    ) {
      this.stageCue?.playOnce();
      this.goToScene(new SecondScene());
    }
  }

  private blueSquareBehavior() {
    const transform = this.blueSquare!.getTransform();

    transform.addToRotationInDegree(10);
    const scale = Math.min(
      5 + (performance.now() - this.timestamp!) / 3000,
      15
    );

    transform.setScale(new Vec2d(scale, scale));
  }

  private buildCorners() {
    this.blueSquare = new Renderable();
    this.blueSquare.color.set({ red: 100, green: 0, blue: 255 });
    this.blueSquare.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(5, 5),
      rotationInDegree: 25,
    });
    this.pushComponent(this.blueSquare);

    const leftUpCorner = new Renderable();
    leftUpCorner.color.set({ red: 0, green: 0, blue: 255 });
    leftUpCorner.trsMatrix.setPosition(new Vec2d(10, 65));
    this.pushComponent(leftUpCorner);

    const rightUpCorner = new Renderable();
    rightUpCorner.color.set({ red: 100, green: 100, blue: 255 });
    rightUpCorner.trsMatrix.setPosition(new Vec2d(30, 65));
    this.pushComponent(rightUpCorner);

    const rightDownCorner = new Renderable();
    rightDownCorner.color.set({ red: 100, green: 155, blue: 100 });
    rightDownCorner.trsMatrix.setPosition(new Vec2d(30, 55));
    this.pushComponent(rightDownCorner);

    const leftDownCorner = new Renderable();
    leftDownCorner.color.set({ red: 255, green: 100, blue: 100 });
    leftDownCorner.trsMatrix.setPosition(new Vec2d(10, 55));
    this.pushComponent(leftDownCorner);

    const text = FontRenderable.getDefaultFont("Ola Alice!");
    text.color.set({ red: 0, green: 200, blue: 0 });
    text.trsMatrix.setTransform({
      position: new Vec2d(10, 62),
      scale: new Vec2d(0.5, 1),
      rotationInDegree: 0,
    });
    this.pushComponent(text);
  }
}
