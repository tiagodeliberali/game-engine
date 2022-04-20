import {
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Audio,
  isKeyPressed,
  Keys,
  SpriteRenderable,
  AnimationType,
  isKeyClicked,
  Viewport,
} from "../engine";
import { buildCharacter } from "./assets/Character";

const backgroundMusicPath = "/sounds/background_music.mp3";
const phoenixPath = "/textures/phoenix_fly.png";

export class SecondScene extends BasicScene {
  backgroundMusic: Audio | undefined;
  phoenix: SpriteRenderable | undefined;

  constructor() {
    super(
      new Camera(new Vec2d(0, 0), new Vec2d(2, 1)),
      Color.FromColorDef({
        red: 20,
        green: 100,
        blue: 200,
      })
    );

    this.viewport = new Viewport(
      new Vec2d(40, 40),
      new Vec2d(800, 400),
      Color.LightGray()
    );

    this.buildEnderman();

    this.gameObjects.add(
      buildCharacter({
        position: new Vec2d(0, 0),
        scale: new Vec2d(0.2, 0.2),
        rotationInDegree: 0,
      })
    );
  }

  load() {
    super.load();
    this.loadResource(backgroundMusicPath);
  }

  init() {
    super.init();

    this.backgroundMusic = this.getResource<Audio>(backgroundMusicPath);
    this.backgroundMusic.playLoop();
  }

  update() {
    super.update();

    if (this.phoenix === undefined) {
      return;
    }

    if (isKeyClicked(Keys.Left)) {
      this.phoenix.setAnimator({
        initialPosition: 0,
        lastPosition: 5,
        speed: 5,
        type: AnimationType.BackwardToBegining,
      });
      this.phoenix.runInLoop();
    }
    if (isKeyClicked(Keys.Right)) {
      this.phoenix.setAnimator({
        initialPosition: 0,
        lastPosition: 5,
        speed: 5,
        type: AnimationType.ForwardToBegining,
      });
      this.phoenix.runInLoop();
    }
    if (isKeyPressed(Keys.Up)) {
      this.phoenix.runOnce();
    }
    if (isKeyPressed(Keys.Down)) {
      this.phoenix.stopLooping();
    }
  }

  private buildEnderman() {
    const cabeca = new Renderable();
    cabeca.setColor({
      red: 0,
      green: 0,
      blue: 0,
    });
    this.pushComponent(cabeca);

    const olho1 = new Renderable();
    olho1.setTransform({
      position: new Vec2d(-0.25, 0.25),
      rotationInDegree: 0,
      scale: new Vec2d(0.3, 0.1),
    });
    olho1.setColor({
      red: 153,
      green: 88,
      blue: 237,
    });
    this.pushComponent(olho1);

    const olho2 = new Renderable();
    olho2.setTransform({
      position: new Vec2d(0.25, 0.25),
      rotationInDegree: 0,
      scale: new Vec2d(0.3, 0.1),
    });
    olho2.setColor({
      red: 153,
      green: 88,
      blue: 237,
    });
    this.pushComponent(olho2);

    const boca = new Renderable();
    boca.setTransform({
      position: new Vec2d(0, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(1.0, 0.3),
    });
    boca.setColor({
      red: 74,
      green: 237,
      blue: 188,
    });
    this.pushComponent(boca);

    const bocaLado1 = new Renderable();
    bocaLado1.setTransform({
      position: new Vec2d(-0.2, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(0.1, 0.3),
    });
    bocaLado1.setColor({
      red: 0,
      green: 0,
      blue: 0,
    });
    this.pushComponent(bocaLado1);

    const bocaLado2 = new Renderable();
    bocaLado2.setTransform({
      position: new Vec2d(0.2, -0.2),
      rotationInDegree: 0,
      scale: new Vec2d(0.1, 0.3),
    });
    bocaLado2.setColor({
      red: 0,
      green: 0,
      blue: 0,
    });
    this.pushComponent(bocaLado2);

    this.phoenix = new SpriteRenderable(phoenixPath, 2, 3, 0);
    this.phoenix.setColor({
      red: 200,
      green: 200,
      blue: 200,
    });
    this.phoenix.setTransform({
      position: new Vec2d(0, 0),
      scale: new Vec2d(0.3, 0.3),
      rotationInDegree: 0,
    });
    this.pushComponent(this.phoenix);
  }
}
