import { mat4, vec3 } from "gl-matrix";
import { Lerp2d } from "../behaviors";
import { Vec2d } from "../DataStructures";
import { ITransformable } from "./ITransformable";
import { Transform, TransformDef } from "./Transform";

export class Camera implements ITransformable {
  private center: Vec2d;
  private size: Vec2d;
  private cameraMatrix: mat4;
  lerpPosition: Lerp2d | undefined;
  lerpScale: Lerp2d | undefined;

  constructor(center: Vec2d, size: Vec2d) {
    this.center = center;
    this.size = size;
    this.cameraMatrix = mat4.create();

    this.configureCamera();
  }

  getTransform(): Transform {
    return Transform.Build({
      position: this.center,
      scale: this.size,
    });
  }

  setTransform(transform: TransformDef) {
    if (transform.position !== undefined) {
      this.setCenter(transform.position);
    }

    if (transform.scale !== undefined) {
      this.setSize(transform.scale);
    }
  }

  getCurrentDirection() {
    return Vec2d.from(0, 0);
  }

  addToPosition(vector: Vec2d) {
    this.center = this.center.add(vector);
    this.configureCamera();
  }

  addToRotationInDegree() {
    // do nothing
  }

  factorToScale(vector: Vec2d) {
    this.size = this.size.multiply(vector);
    this.configureCamera();
  }

  getCameraMatrix() {
    return this.cameraMatrix;
  }

  setCenter(center: Vec2d) {
    this.center = center;
    this.configureCamera();
  }

  setSize(size: Vec2d) {
    this.size = size;
    this.configureCamera();
  }

  panBy(vector: Vec2d) {
    this.lerpPosition = new Lerp2d(this.center, 50, 0.1);
    this.lerpPosition.setFinal(this.center.add(vector));
  }

  panTo(point: Vec2d) {
    this.lerpPosition = new Lerp2d(this.center, 50, 0.1);
    this.lerpPosition.setFinal(point);
  }

  zoomBy(zoom: number) {
    if (zoom > 0) {
      this.lerpScale = new Lerp2d(this.size, 50, 0.1);
      this.lerpScale.setFinal(Vec2d.from(zoom, zoom).multiply(this.size));
    }
  }

  zoomTowards(target: ITransformable, zoom: number) {
    const position = target.getTransform().getPosition();
    const delta = position.sub(this.center).scale(zoom - 1);
    this.panTo(this.center.sub(delta));
    this.zoomBy(zoom);
  }

  update() {
    if (this.lerpPosition) {
      this.lerpPosition.update();
      this.setCenter(this.lerpPosition.get());

      if (this.lerpPosition.cyclesLeft === 0) {
        this.lerpPosition = undefined;
      }
    }

    if (this.lerpScale) {
      this.lerpScale.update();
      this.setSize(this.lerpScale.get());

      if (this.lerpScale.cyclesLeft === 0) {
        this.lerpScale = undefined;
      }
    }
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
