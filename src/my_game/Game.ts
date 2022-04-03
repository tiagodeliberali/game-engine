import { limparTela, Bloco } from "../engine";
import { Color } from "../engine/Color";

export class Jogo {
  blocos: Bloco[];

  constructor() {
    limparTela(
      Color.FromColorDef({
        red: 74,
        green: 237,
        blue: 188,
      })
    );

    const cabeca = new Bloco();
    cabeca.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const olho1 = new Bloco();
    olho1.trsMatrix.setTransform({
      position: [-0.25, 0.25],
      rotationInDegree: 0,
      scale: [0.3, 0.1],
    });
    olho1.color.set({
      red: 153,
      green: 88,
      blue: 237,
    });

    const olho2 = new Bloco();
    olho2.trsMatrix.setTransform({
      position: [0.25, 0.25],
      rotationInDegree: 0,
      scale: [0.3, 0.1],
    });
    olho2.color.set({
      red: 153,
      green: 88,
      blue: 237,
    });

    const boca = new Bloco();
    boca.trsMatrix.setTransform({
      position: [0, -0.2],
      rotationInDegree: 0,
      scale: [1.0, 0.3],
    });
    boca.color.set({
      red: 74,
      green: 237,
      blue: 188,
    });

    const bocaLado1 = new Bloco();
    bocaLado1.trsMatrix.setTransform({
      position: [-0.2, -0.2],
      rotationInDegree: 0,
      scale: [0.1, 0.3],
    });
    bocaLado1.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    const bocaLado2 = new Bloco();
    bocaLado2.trsMatrix.setTransform({
      position: [0.2, -0.2],
      rotationInDegree: 0,
      scale: [0.1, 0.3],
    });
    bocaLado2.color.set({
      red: 0,
      green: 0,
      blue: 0,
    });

    this.blocos = [cabeca, olho1, olho2, boca, bocaLado1, bocaLado2];
  }

  public init() {
    this.blocos.forEach((bloco) => bloco.draw());
  }
}
