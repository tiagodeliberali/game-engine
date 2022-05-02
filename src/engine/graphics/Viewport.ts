import { Vec2d } from "../DataStructures";
import { getGL, clearCanvas, getCanvasSize } from ".";
import { Color } from "..";

export class Viewport {
  private gl: WebGL2RenderingContext;
  private background: Color;
  private border: number;
  bottomLeftCorner: Vec2d;
  size: Vec2d;

  constructor(
    bottomLeftCorner: Vec2d,
    size: Vec2d,
    background: Color,
    border?: number
  ) {
    this.gl = getGL();
    this.bottomLeftCorner = bottomLeftCorner;
    this.size = size;
    this.background = background;
    this.border = border || 0;
  }

  static Default(color: Color) {
    const canvasSize = getCanvasSize();
    return new Viewport(new Vec2d(0, 0), canvasSize, color);
  }

  static build(
    bottomLeftCorner: Vec2d,
    size: Vec2d,
    color: Color,
    border?: number
  ) {
    return new Viewport(bottomLeftCorner, size, color, border);
  }

  clone(): Viewport {
    return new Viewport(
      this.bottomLeftCorner,
      this.size,
      this.background,
      this.border
    );
  }

  draw() {
    this.gl.viewport(
      this.bottomLeftCorner.x + this.border,
      this.bottomLeftCorner.y + this.border,
      this.size.x - 2 * this.border,
      this.size.y - 2 * this.border
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
