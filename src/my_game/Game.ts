import { Engine } from "../engine";

export class Game {
  engine: Engine;

  constructor(canvasId: string) {
    this.engine = new Engine(canvasId);
  }

  public init() {
    this.engine.clearCanvas();
    this.engine.drawSquare([0.5, 0.5, 0.5, 1]);
    this.engine.drawSquare([0.5, 0.1, 0.5, 1]);
  }
}
