import { mat4, vec3 } from "gl-matrix";
import { Color } from "./Color";
import { getGL, clearCanvas } from "../GL";
import { Vec2d } from "../DataStructures";

export type ViewPortDef = {
  bottomLeftCorner: Vec2d;
  size: Vec2d;
};

export class Camera {
  private gl: WebGL2RenderingContext;
  private center: Vec2d;
  private size: Vec2d;
  private viewport: ViewPortDef;
  private background: Color;
  private cameraMatrix: mat4;

  constructor(
    center: Vec2d,
    size: Vec2d,
    viewport: ViewPortDef,
    background: Color
  ) {
    this.gl = getGL();
    this.center = center;
    this.size = size;
    this.viewport = viewport;
    this.background = background;
    this.cameraMatrix = mat4.create();

    this.drawViewport();
    this.configureCamera();
  }

  public getCameraMatrix() {
    return this.cameraMatrix;
  }

  public setCenter(point: Vec2d) {
    this.center = point;
    this.configureCamera();
  }

  public setSize(point: Vec2d) {
    this.size = point;
    this.configureCamera();
  }

  public drawViewport() {
    this.gl.viewport(
      this.viewport.bottomLeftCorner.x,
      this.viewport.bottomLeftCorner.y,
      this.viewport.size.x,
      this.viewport.size.y
    );
    this.gl.scissor(
      this.viewport.bottomLeftCorner.x,
      this.viewport.bottomLeftCorner.y,
      this.viewport.size.x,
      this.viewport.size.y
    );

    this.gl.enable(this.gl.SCISSOR_TEST);
    clearCanvas(this.background);
    this.gl.disable(this.gl.SCISSOR_TEST);
  }

  private configureCamera() {
    mat4.scale(
      this.cameraMatrix,
      mat4.create(),
      vec3.fromValues(2.0 / this.size.x, 2.0 / this.size.y, 1.0)
    );

    mat4.translate(
      this.cameraMatrix,
      this.cameraMatrix,
      vec3.fromValues(-this.center.x, -this.center.y, 0)
    );
  }
}
