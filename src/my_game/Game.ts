import { limparTela, Bloco, Camera, Color, Vec2d } from "../engine";

export class Jogo {
  blocos: Bloco[] = [];
  camera: Camera | undefined;

  constructor() {
    limparTela(
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );

    this.blocos = this.blocos.concat(this.buildCorners());
    //this.blocos = this.blocos.concat(this.buildEnderman());
  }

  public init() {
    this.blocos.forEach((bloco) => bloco.draw(this.camera!));
  }

  private buildCorners() {
    this.camera = new Camera(
      new Vec2d(25, 55),
      new Vec2d(60, 30),
      {
        bottomLeftCorner: new Vec2d(20, 40),
        size: new Vec2d(600, 300),
      },
      Color.LightGray()
    );

    const mBlueSq = new Bloco();
    mBlueSq.color.set({ red: 0, green: 0, blue: 255 });
    mBlueSq.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(5, 5),
      rotationInDegree: 25,
    });

    const mRedSq = new Bloco();
    mRedSq.color.set({ red: 255, green: 0, blue: 0 });
    mRedSq.trsMatrix.setTransform({
      position: new Vec2d(20, 60),
      scale: new Vec2d(2, 2),
      rotationInDegree: 0,
    });

    const mTLSq = new Bloco();
    mTLSq.color.set({ red: 0, green: 0, blue: 255 });
    mTLSq.trsMatrix.setPosition(new Vec2d(10, 65));

    const mTRSq = new Bloco();
    mTRSq.color.set({ red: 100, green: 100, blue: 255 });
    mTRSq.trsMatrix.setPosition(new Vec2d(30, 65));

    const mBRSq = new Bloco();
    mBRSq.color.set({ red: 100, green: 155, blue: 100 });
    mBRSq.trsMatrix.setPosition(new Vec2d(30, 55));

    const mBLSq = new Bloco();
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

    const cabeca = new Bloco();
    cabeca.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const olho1 = new Bloco();
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

    const olho2 = new Bloco();
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

    const boca = new Bloco();
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

    const bocaLado1 = new Bloco();
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

    const bocaLado2 = new Bloco();
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
