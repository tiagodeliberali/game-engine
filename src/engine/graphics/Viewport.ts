import { Vec2d } from "../DataStructures";
import { getGL, clearCanvas, getCanvasSize } from ".";
import { Color } from "..";

export class Viewport {
  private gl: WebGL2RenderingContext;
  bottomLeftCorner: Vec2d;
  size: Vec2d;
  private background: Color;

  constructor(bottomLeftCorner: Vec2d, size: Vec2d, background: Color) {
    this.gl = getGL();
    this.bottomLeftCorner = bottomLeftCorner;
    this.size = size;
    this.background = background;
  }

  static Default(color: Color) {
    const canvasSize = getCanvasSize();
    return new Viewport(new Vec2d(0, 0), canvasSize, color);
  }

  draw() {
    this.gl.viewport(
      this.bottomLeftCorner.x,
      this.bottomLeftCorner.y,
      this.size.x,
      this.size.y
    );

    this.gl.scissor(
      this.bottomLeftCorner.x,
      this.bottomLeftCorner.y,
      this.size.x,
      this.size.y
    );

    this.gl.enable(this.gl.SCISSOR_TEST);
    clearCanvas(this.background);
    this.gl.disable(this.gl.SCISSOR_TEST);
  }
}
