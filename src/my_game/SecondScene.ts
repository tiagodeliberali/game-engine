import {
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Audio,
  Texture,
  SpriteRenderable,
} from "../engine";
import { Viewport } from "../engine/graphics";

const backgroundMusicPath = "/sounds/background_music.mp3";
const phoenixPath = "/textures/phoenix_fly.png";

export class SecondScene extends BasicScene {
  backgroundMusic: Audio | undefined;
  phoenixTexture: Texture | undefined;

  constructor() {
    super(
      new Camera(new Vec2d(0, 0), new Vec2d(1, 1)),
      Color.FromColorDef({
        red: 20,
        green: 100,
        blue: 200,
      })
    );

    this.viewport = new Viewport(
      new Vec2d(280, 40),
      new Vec2d(400, 400),
      Color.LightGray()
    );
  }

  public load() {
    this.loadResource(backgroundMusicPath);
    this.loadResource(phoenixPath);
  }

  public init() {
    this.phoenixTexture = this.getResource(phoenixPath) as Texture;

    this.renderables = this.buildEnderman();

    this.backgroundMusic = this.getResource(backgroundMusicPath) as Audio;
    this.backgroundMusic.playLoop(1);
  }

  public update() {
    //
  }

  private buildEnderman() {
    const cabeca = new Renderable();
    cabeca.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const olho1 = new Renderable();
    olho1.trsMatrix.setTransform({
      position: new Vec2d(-0.25, 0.25),
      rotationInDegree: 0,
      scale: new Vec2d(0.3, 0.1),
    });
    olho1.color.set({
      red: 153,
      green: 88,
      blue: 237,
    });

    const olho2 = new Renderable();
    olho2.trsMatrix.setTransform({
      position: new Vec2d(0.25, 0.25),
      rotationInDegree: 0,
      scale: new Vec2d(0.3, 0.1),
    });
    olho2.color.set({
      red: 153,
      green: 88,
      blue: 237,
    });

    const boca = new Renderable();
    boca.trsMatrix.setTransform({
      position: new Vec2d(0, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(1.0, 0.3),
    });
    boca.color.set({
      red: 74,
      green: 237,
      blue: 188,
    });

    const bocaLado1 = new Renderable();
    bocaLado1.trsMatrix.setTransform({
      position: new Vec2d(-0.2, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(0.1, 0.3),
    });
    bocaLado1.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const bocaLado2 = new Renderable();
    bocaLado2.trsMatrix.setTransform({
      position: new Vec2d(0.2, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(0.1, 0.3),
    });
    bocaLado2.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const phoenix = new SpriteRenderable(
      this.phoenixTexture!,
      this.phoenixTexture!.getBox(2, 3, 0, 0)
    );
    phoenix.color.set({
      red: 200,
      green: 200,
      blue: 200,
    });
    phoenix.trsMatrix.setTransform({
      position: new Vec2d(0, 0),
      scale: new Vec2d(0.3, 0.3),
      rotationInDegree: 0,
    });

    return [cabeca, olho1, olho2, boca, bocaLado1, bocaLado2, phoenix];
  }
}
