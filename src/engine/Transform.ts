import { mat4, vec3 } from "gl-matrix";
import { Vec2d } from "./DataStructures";

type TransformDef = {
  position: Vec2d;
  rotationInDegree: number;
  scale: Vec2d;
};

export class Transform {
  private position: Vec2d = new Vec2d(0, 0);
  private rotation: number;
  private scale: Vec2d = new Vec2d(1, 1);

  constructor() {
    this.rotation = 0;
  }

  public setTransform(transformDef: TransformDef) {
    this.setPosition(transformDef.position);
    this.setRotationInDegree(transformDef.rotationInDegree);
    this.setScale(transformDef.scale);
  }

  public setPosition(point: Vec2d) {
    this.position = point;
  }

  public setScale(scale: Vec2d) {
    this.scale = scale;
  }

  public setRotationInRad(rotationInRadians: number) {
    this.rotation = rotationInRadians;
    while (this.rotation > 2 * Math.PI) {
      this.rotation -= 2 * Math.PI;
    }
  }

  public setRotationInDegree(rotationInDegree: number) {
    this.setRotationInRad((rotationInDegree * Math.PI) / 180.0);
  }

  public getTrsMatrix() {
    const trsMatrix = mat4.create();

    mat4.translate(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.position.x, this.position.y, 0.0)
    );

    mat4.rotateZ(trsMatrix, trsMatrix, this.rotation);

    mat4.scale(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.scale.x, this.scale.y, 1.0)
    );

    return trsMatrix;
  }
}
