import {
  clearCanvas,
  Renderable,
  Camera,
  Color,
  Vec2d,
  SceneDef,
  Keys,
  isKeyPressed,
} from "../engine";

export class InitialScene implements SceneDef {
  blocos: Renderable[] = [];
  camera: Camera | undefined;
  timestamp: number | undefined;

  public init() {
    this.timestamp = performance.now();
    this.blocos = this.blocos.concat(this.buildCorners());
    //this.blocos = this.blocos.concat(this.buildEnderman());
  }

  public update() {
    if (this.blocos && this.blocos.length > 0) {
      const transform = this.blocos[0].trsMatrix;
      transform.addToRotationInDegree(10);
      const scale = Math.min(
        5 + (performance.now() - this.timestamp!) / 1500,
        15
      );

      transform.setScale(new Vec2d(scale, scale));
    }

    if (this.blocos && this.blocos.length > 1) {
      const speed = 0.2;
      const transform = this.blocos[1].trsMatrix;

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
    }
  }

  public draw() {
    clearCanvas(
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );
    this.camera?.drawViewport();
    this.blocos.forEach((bloco) => bloco.draw(this.camera!));
  }

  private buildCorners() {
    this.camera = new Camera(
      new Vec2d(20, 60),
      new Vec2d(30, 15),
      {
        bottomLeftCorner: new Vec2d(20, 40),
        size: new Vec2d(600, 300),
      },
      Color.LightGray()
    );

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

  private buildEnderman() {
    this.camera = new Camera(
      new Vec2d(0, 0),
      new Vec2d(1, 1),
      {
        bottomLeftCorner: new Vec2d(20, 40),
        size: new Vec2d(600, 300),
      },
      Color.LightGray()
    );

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

    return [cabeca, olho1, olho2, boca, bocaLado1, bocaLado2];
  }
}
