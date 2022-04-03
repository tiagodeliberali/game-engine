import { initGL, clearCanvas, Renderable } from "../engine";

export class Game {
  square1: Renderable;
  square2: Renderable;

  constructor(canvasId: string) {
    initGL(canvasId);
    clearCanvas([0, 0.5, 0]);

    this.square1 = new Renderable();

    this.square2 = new Renderable();
    this.square2.color = [1, 0.5, 0, 1];
  }

  public init() {
    this.square1.draw();
    this.square2.draw();
  }
}
