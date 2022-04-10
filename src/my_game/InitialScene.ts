import {
  TextureRenderable,
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Keys,
  isKeyPressed,
  Audio,
  Texture,
  IRenderable,
  FontRenderable,
} from "../engine";
import { SecondScene } from "./SecondScene";

const footCuePath = "/sounds/footstep.wav";
const stageCuePath = "/sounds/change_level.wav";
const pokemonTexturePath = "/textures/character.png";

export class InitialScene extends BasicScene {
  timestamp: number | undefined;
  footCue: Audio | undefined;
  stageCue: Audio | undefined;
  characterTexture: Texture | undefined;

  constructor() {
    super(
      new Camera(new Vec2d(20, 60), new Vec2d(30, 15)),
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );
  }

  public load() {
    this.loadResource(footCuePath);
    this.loadResource(stageCuePath);
    this.loadResource(pokemonTexturePath);
  }

  public init() {
    this.timestamp = performance.now();

    this.footCue = this.getResource<Audio>(footCuePath);
    this.stageCue = this.getResource<Audio>(stageCuePath);
    this.characterTexture = this.getResource<Texture>(pokemonTexturePath);

    this.renderables = this.buildCorners();
  }

  public update() {
    this.blueSquareBehavior();
    this.characterBehavior();
  }

  private characterBehavior() {
    const speed = 0.2;
    const transform = this.renderables[1].getTransform();

    let isWalking = false;
    if (isKeyPressed(Keys.Left)) {
      transform.addToHorizontalPosition(-speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Right)) {
      transform.addToHorizontalPosition(speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Up)) {
      transform.addToVerticalPosition(speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Down)) {
      transform.addToVerticalPosition(-speed);
      isWalking = true;
    }

    if (isWalking) {
      this.footCue!.playLoop(1);
    } else {
      this.footCue!.stop();
    }

    if (transform.getHorizontalPosition() > 35) {
      this.stageCue?.playOnce(1);
      this.goToScene(new SecondScene());
    }
  }

  private blueSquareBehavior() {
    const transform = this.renderables[0].getTransform();
    transform.addToRotationInDegree(10);
    const scale = Math.min(
      5 + (performance.now() - this.timestamp!) / 3000,
      15
    );

    transform.setScale(new Vec2d(scale, scale));
  }

  private buildCorners(): IRenderable[] {
    const text = FontRenderable.getDefaultFont("Ola Alice!");
    text.color.set({ red: 0, green: 200, blue: 0 });
    text.trsMatrix.setTransform({
      position: new Vec2d(10, 62),
      scale: new Vec2d(0.5, 1),
      rotationInDegree: 0,
    });

    const blueSquare = new Renderable();
    blueSquare.color.set({ red: 100, green: 0, blue: 255 });
    blueSquare.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(5, 5),
      rotationInDegree: 25,
    });

    const character = new TextureRenderable(this.characterTexture!);
    character.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(2, 2),
      rotationInDegree: 0,
    });

    const leftUpCorner = new Renderable();
    leftUpCorner.color.set({ red: 0, green: 0, blue: 255 });
    leftUpCorner.trsMatrix.setPosition(new Vec2d(10, 65));

    const rightUpCorner = new Renderable();
    rightUpCorner.color.set({ red: 100, green: 100, blue: 255 });
    rightUpCorner.trsMatrix.setPosition(new Vec2d(30, 65));

    const rightDownCorner = new Renderable();
    rightDownCorner.color.set({ red: 100, green: 155, blue: 100 });
    rightDownCorner.trsMatrix.setPosition(new Vec2d(30, 55));

    const leftDownCorner = new Renderable();
    leftDownCorner.color.set({ red: 255, green: 100, blue: 100 });
    leftDownCorner.trsMatrix.setPosition(new Vec2d(10, 55));

    return [
      blueSquare,
      character,
      leftUpCorner,
      rightUpCorner,
      rightDownCorner,
      leftDownCorner,
      text,
    ];
  }
}
