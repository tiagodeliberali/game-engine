import {
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Audio,
  Texture,
  isKeyPressed,
  Keys,
  SpriteRenderable,
  AnimationType,
  GameObject,
} from "../engine";
import { Viewport } from "../engine";
import { Character } from "./assets/Character";

const backgroundMusicPath = "/sounds/background_music.mp3";
const phoenixPath = "/textures/phoenix_fly.png";

export class SecondScene extends BasicScene {
  backgroundMusic: Audio | undefined;

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

    this.gameObjects.push(
      new Character({
        position: new Vec2d(0, 0),
        scale: new Vec2d(0.2, 0.2),
        rotationInDegree: 0,
      })
    );
  }

  public load() {
    super.load();
    this.loadResource(backgroundMusicPath);
    this.loadResource(phoenixPath);
  }

  public init() {
    super.init();

    this.buildEnderman();

    this.backgroundMusic = this.getResource<Audio>(backgroundMusicPath);
    this.backgroundMusic.playLoop();
  }

  public update() {
    super.update();
    const phoenix = this.gameObjects
      .get<GameObject>(6)
      .getRenderable<SpriteRenderable>();

    if (isKeyPressed(Keys.Left)) {
      phoenix.setAnimator({
        initialPosition: 0,
        lastPosition: 5,
        speed: 5,
        type: AnimationType.BackwardToBegining,
      });
      phoenix.runInLoop();
    }
    if (isKeyPressed(Keys.Right)) {
      phoenix.setAnimator({
        initialPosition: 0,
        lastPosition: 5,
        speed: 5,
        type: AnimationType.ForwardToBegining,
      });
      phoenix.runInLoop();
    }
    if (isKeyPressed(Keys.Up)) {
      phoenix.runOnce();
    }
    if (isKeyPressed(Keys.Down)) {
      phoenix.stopLooping();
    }
  }

  private buildEnderman() {
    const character = this.gameObjects.set.pop();

    const cabeca = new Renderable();
    cabeca.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });
    this.gameObjects.push(GameObject.FromRenderable(cabeca));

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
    this.gameObjects.push(GameObject.FromRenderable(olho1));

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
    this.gameObjects.push(GameObject.FromRenderable(olho2));

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
    this.gameObjects.push(GameObject.FromRenderable(boca));

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
    this.gameObjects.push(GameObject.FromRenderable(bocaLado1));

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
    this.gameObjects.push(GameObject.FromRenderable(bocaLado2));

    const phoenix = new SpriteRenderable(
      this.getResource<Texture>(phoenixPath),
      2,
      3,
      0
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
    this.gameObjects.push(GameObject.FromRenderable(phoenix));

    this.gameObjects.push(character!);
  }
}
