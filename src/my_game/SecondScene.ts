import { Renderable, Camera, Color, Vec2d, BasicScene } from "../engine";

export class SecondScene extends BasicScene {
  constructor() {
    super(
      new Camera(
        new Vec2d(0, 0),
        new Vec2d(1, 1),
        {
          bottomLeftCorner: new Vec2d(20, 40),
          size: new Vec2d(600, 300),
        },
        Color.LightGray()
      ),
      Color.FromColorDef({
        red: 20,
        green: 100,
        blue: 200,
      })
    );
  }

  public init() {
    this.renderables = this.buildEnderman();
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

    return [cabeca, olho1, olho2, boca, bocaLado1, bocaLado2];
  }
}
