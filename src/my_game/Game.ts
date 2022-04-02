import { Engine } from "../engine/Engine";

export class Game {
  engine: Engine;

  constructor(canvasId: string) {
    this.engine = new Engine(canvasId);
  }

  public init() {
    this.engine.clearCanvas();
    this.engine.drawSquare();
  }
}
