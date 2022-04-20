import { mat4, vec3 } from "gl-matrix";
import { Vec2d } from "../DataStructures";
import { ITransformable } from "./ITransformable";

export class Camera {
  private center: Vec2d;
  private size: Vec2d;
  private cameraMatrix: mat4;

  constructor(center: Vec2d, size: Vec2d) {
    this.center = center;
    this.size = size;
    this.cameraMatrix = mat4.create();

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

  //   clampAtBoundary(target: ITransformable, zone) {
  //     let status = this.collideWCBound(aXform, zone);
  //     if (status !== eBoundCollideStatus.eInside) {
  //         let pos = aXform.getPosition();
  //         if ((status & eBoundCollideStatus.eCollideTop) !== 0) {
  //             pos[1] = (this.getWCCenter())[1] +
  //                      (zone * this.getWCHeight() / 2) –
  //                      (aXform.getHeight() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideBottom) !== 0) {
  //             pos[1] = (this.getWCCenter())[1] –
  //                      (zone * this.getWCHeight() / 2) +
  //                      (aXform.getHeight() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideRight) !== 0) {
  //             pos[0] = (this.getWCCenter())[0] +
  //                      (zone * this.getWCWidth() / 2) –
  //                      (aXform.getWidth() / 2);
  //         }
  //         if ((status & eBoundCollideStatus.eCollideLeft) !== 0) {
  //             pos[0] = (this.getWCCenter())[0] –
  //                      (zone * this.getWCWidth() / 2) +
  //                      (aXform.getWidth() / 2);
  //         }
  //     }
  //     return status;
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
