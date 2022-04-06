import {
  Renderable,
  Camera,
  Color,
  Vec2d,
  BasicScene,
  Keys,
  isKeyPressed,
} from "../engine";

import { SecondScene } from "./SecondScene";

export class InitialScene extends BasicScene {
  timestamp: number | undefined;

  constructor() {
    super(
      new Camera(
        new Vec2d(20, 60),
        new Vec2d(30, 15),
        {
          bottomLeftCorner: new Vec2d(20, 40),
          size: new Vec2d(600, 300),
        },
        Color.LightGray()
      ),
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );
  }

  public init() {
    this.timestamp = performance.now();

    this.renderables = this.renderables.concat(this.buildCorners());
  }

  public update() {
    if (this.renderables && this.renderables.length > 0) {
      const transform = this.renderables[0].trsMatrix;
      transform.addToRotationInDegree(10);
      const scale = Math.min(
        5 + (performance.now() - this.timestamp!) / 1500,
        15
      );

      transform.setScale(new Vec2d(scale, scale));
    }

    if (this.renderables && this.renderables.length > 1) {
      const speed = 0.2;
      const transform = this.renderables[1].trsMatrix;

      if (isKeyPressed(Keys.Left)) {
        transform.addToHorizontalPosition(-speed);
      }
      if (isKeyPressed(Keys.Right)) {
        transform.addToHorizontalPosition(speed);
      }
      if (isKeyPressed(Keys.Up)) {
        transform.addToVerticalPosition(speed);
      }
      if (isKeyPressed(Keys.Down)) {
        transform.addToVerticalPosition(-speed);
      }

      if (transform.getHorizontalPosition() > 35) {
        this.loadScene(new SecondScene());
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

    const mRedSq = new Renderable();
    mRedSq.color.set({ red: 255, green: 0, blue: 0 });
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
