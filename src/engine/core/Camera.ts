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

  clampAtBoundary(target: BoundingBox, zone: number) {
    const status = this.boudingBox.boundCollideStatus(target);
    this.boudingBox.setZone(zone);

    if (status !== ColisionStatus.inside) {
      const targetPosition = target.owner.getTransform().getPosition();

      let x = targetPosition.x;
      let y = targetPosition.y;

      if ((status & ColisionStatus.collideTop) !== 0) {
        y = this.center.y + (zone * this.size.y) / 2 - target.height / 2;
      }
      if ((status & ColisionStatus.collideBottom) !== 0) {
        y = this.center.y - (zone * this.size.y) / 2 + target.height / 2;
      }
      if ((status & ColisionStatus.collideRight) !== 0) {
        x = this.center.x + (zone * this.size.x) / 2 - target.width / 2;
      }
      if ((status & ColisionStatus.collideLeft) !== 0) {
        x = this.center.x - (zone * this.size.x) / 2 + target.width / 2;
      }

      target.owner.setTransform({ position: Vec2d.from(x, y) });
    }
    return status;
  }

  //   panWith = function (aXform, zone) {
  //     let status = this.collideWCBound(aXform, zone);
  //     if (status !== eBoundCollideStatus.eInside) {
  //         let pos = aXform.getPosition();
  //         let newC = this.getWCCenter();
  //         if ((status & eBoundCollideStatus.eCollideTop) !== 0) {
  //             newC[1] = pos[1]+(aXform.getHeight() / 2) –
  //                       (zone * this.getWCHeight() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideBottom) !== 0) {
  //             newC[1] = pos[1] - (aXform.getHeight() / 2) +
  //                       (zone * this.getWCHeight() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideRight) !== 0) {
  //             newC[0] = pos[0] + (aXform.getWidth() / 2) –
  //                       (zone * this.getWCWidth() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideLeft) !== 0) {
  //             newC[0] = pos[0] - (aXform.getWidth() / 2) +
  //                       (zone * this.getWCWidth() / 2);
  //         }
  //     }
  // }

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
