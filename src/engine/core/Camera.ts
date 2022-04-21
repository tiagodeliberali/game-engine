import { mat4, vec3 } from "gl-matrix";
import { BoundingBox, ColisionStatus } from "../behaviors";
import { Vec2d } from "../DataStructures";
import { ITransformable } from "./ITransformable";
import { Transform, TransformDef } from "./Transform";

export class Camera implements ITransformable {
  private center: Vec2d;
  private size: Vec2d;
  private cameraMatrix: mat4;
  private boudingBox: BoundingBox;

  constructor(center: Vec2d, size: Vec2d) {
    this.center = center;
    this.size = size;
    this.cameraMatrix = mat4.create();

    this.boudingBox = BoundingBox.from(this, "camera");

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
  }

  addToRotationInDegree() {
    // do nothing
  }

  factorToScale(vector: Vec2d) {
    this.size = Vec2d.from(this.size.x * vector.x, this.size.y * vector.y);
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

  clampAtBoundary(target: BoundingBox, zone: Vec2d) {
    const status = this.boudingBox.boundCollideStatus(target);
    this.boudingBox.setScale(zone);

    if (status !== ColisionStatus.inside) {
      const targetPosition = target.getPosition();

      let x = targetPosition.x;
      let y = targetPosition.y;

      if ((status & ColisionStatus.collideTop) !== 0) {
        y =
          this.center.y + (zone.y * this.size.y) / 2 - target.getScale().y / 2;
      }
      if ((status & ColisionStatus.collideBottom) !== 0) {
        y =
          this.center.y - (zone.y * this.size.y) / 2 + target.getScale().y / 2;
      }
      if ((status & ColisionStatus.collideRight) !== 0) {
        x =
          this.center.x + (zone.x * this.size.x) / 2 - target.getScale().x / 2;
      }
      if ((status & ColisionStatus.collideLeft) !== 0) {
        x =
          this.center.x - (zone.x * this.size.x) / 2 + target.getScale().x / 2;
      }

      target.owner.setTransform({ position: Vec2d.from(x, y) });
    }
    return status;
  }

  panWith(target: BoundingBox, zone: Vec2d) {
    const status = this.boudingBox.boundCollideStatus(target);
    this.boudingBox.setScale(zone);

    if (status !== ColisionStatus.inside) {
      const targetPosition = target.getPosition();

      let x = this.center.x;
      let y = this.center.y;

      if ((status & ColisionStatus.collideTop) !== 0) {
        y =
          targetPosition.y +
          target.getScale().y / 2 -
          (zone.y * this.size.y) / 2;
      }
      if ((status & ColisionStatus.collideBottom) !== 0) {
        y =
          targetPosition.y -
          target.getScale().y / 2 +
          (zone.y * this.size.y) / 2;
      }
      if ((status & ColisionStatus.collideRight) !== 0) {
        x =
          targetPosition.x +
          target.getScale().x / 2 -
          (zone.x * this.size.x) / 2;
      }
      if ((status & ColisionStatus.collideLeft) !== 0) {
        x =
          targetPosition.x -
          target.getScale().x / 2 +
          (zone.x * this.size.x) / 2;
      }

      this.setTransform({ position: Vec2d.from(x, y) });
    }
  }

  panBy(vector: Vec2d) {
    this.addToPosition(vector);
  }

  panTo(point: Vec2d) {
    this.setTransform({ position: point });
  }

  zoomBy(zoom: number) {
    if (zoom > 0) {
      this.factorToScale(Vec2d.from(zoom, zoom));
    }
  }

  zoomTowards(target: BoundingBox, zoom: number) {
    // still for reference since I am not sure it is working properly
    // let delta = [];
    // vec2.sub(delta, pos, this.mWCCenter);
    // vec2.scale(delta, delta, zoom - 1);
    // vec2.sub(this.mWCCenter, this.mWCCenter, delta);
    // this.zoomBy(zoom);
    const position = target.owner.getTransform().getPosition();
    const delta = position.sub(this.center).scale(zoom - 1);
    this.setTransform({ position: this.center.sub(delta) });
    this.zoomBy(zoom);
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
