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

    this.footCue = this.getResource(footCuePath) as Audio;
    this.stageCue = this.getResource(stageCuePath) as Audio;
    this.characterTexture = this.getResource(pokemonTexturePath) as Texture;

    this.renderables = this.buildCorners();
  }

  public update() {
    this.blueSquareBehavior();
    this.characterBehavior();
  }

  private characterBehavior() {
    const speed = 0.2;
    const transform = this.renderables[1].trsMatrix;

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
    const transform = this.renderables[0].trsMatrix;
    transform.addToRotationInDegree(10);
    const scale = Math.min(
      5 + (performance.now() - this.timestamp!) / 3000,
      15
    );

    transform.setScale(new Vec2d(scale, scale));
  }

  private buildCorners() {
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
    ];
  }
}
