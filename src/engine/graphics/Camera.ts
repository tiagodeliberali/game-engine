import { mat4, vec3 } from "gl-matrix";
import { getGL } from "../GL";
import { Vec2d } from "../DataStructures";

export class Camera {
  private gl: WebGL2RenderingContext;
  private center: Vec2d;
  private size: Vec2d;
  private cameraMatrix: mat4;

  constructor(center: Vec2d, size: Vec2d) {
    this.gl = getGL();
    this.center = center;
    this.size = size;
    this.cameraMatrix = mat4.create();

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
