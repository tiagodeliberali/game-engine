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
  backgroundMusic: Audio | undefined;
  footCue: Audio | undefined;
  stageCue: Audio | undefined;
  pokemonTexture: Texture | undefined;

  constructor() {
    const color = Color.FromColorDef({
      red: 74,
      green: 237,
      blue: 188,
    });

    super(new Camera(new Vec2d(20, 60), new Vec2d(30, 15)), color);
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
    this.pokemonTexture = this.getResource(pokemonTexturePath) as Texture;

    this.renderables = this.renderables.concat(this.buildCorners());
  }

  public update() {
    if (this.renderables && this.renderables.length > 0) {
      const transform = this.renderables[0].trsMatrix;
      transform.addToRotationInDegree(10);
      const scale = Math.min(
        5 + (performance.now() - this.timestamp!) / 3000,
        15
      );

      transform.setScale(new Vec2d(scale, scale));
    }

    if (this.renderables && this.renderables.length > 1) {
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
        this.goToScene(new SecondScene());
      }
    }
  }

  private buildCorners() {
    const mBlueSq = new Renderable();
    mBlueSq.color.set({ red: 100, green: 0, blue: 255 });
    mBlueSq.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(5, 5),
      rotationInDegree: 25,
    });

    const mRedSq = new TextureRenderable(this.pokemonTexture!);
    mRedSq.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(2, 2),
      rotationInDegree: 0,
    });

    const mTLSq = new Renderable();
    mTLSq.color.set({ red: 0, green: 0, blue: 255 });
    mTLSq.trsMatrix.setPosition(new Vec2d(10, 65));

    const mTRSq = new Renderable();
    mTRSq.color.set({ red: 100, green: 100, blue: 255 });
    mTRSq.trsMatrix.setPosition(new Vec2d(30, 65));

    const mBRSq = new Renderable();
    mBRSq.color.set({ red: 100, green: 155, blue: 100 });
    mBRSq.trsMatrix.setPosition(new Vec2d(30, 55));

    const mBLSq = new Renderable();
    mBLSq.color.set({ red: 255, green: 100, blue: 100 });
    mBLSq.trsMatrix.setPosition(new Vec2d(10, 55));

    return [mBlueSq, mRedSq, mTLSq, mTRSq, mBRSq, mBLSq];
  }
}
