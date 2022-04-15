import { mat4, vec3 } from "gl-matrix";
import { Vec2d } from "../DataStructures";

export type TransformDef = {
  position?: Vec2d;
  rotationInDegree?: number;
  scale?: Vec2d;
};

const simplifyRotationInRads = (rotation: number) => {
  while (rotation > 2 * Math.PI) {
    rotation -= 2 * Math.PI;
  }

  return rotation;
};

const convertDegreeToRads = (rotation: number) =>
  simplifyRotationInRads((rotation * Math.PI) / 180.0);

export class Transform {
  private readonly position: Vec2d;
  private readonly rotation: number;
  private readonly scale: Vec2d;

  constructor(position: Vec2d, rotation: number, scale: Vec2d) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  static BuldDefault() {
    return new Transform(new Vec2d(0, 0), 0, new Vec2d(1, 1));
  }

  static Build(transformDef: TransformDef) {
    return new Transform(
      transformDef.position || new Vec2d(0, 0),
      convertDegreeToRads(transformDef.rotationInDegree || 0),
      transformDef.scale || new Vec2d(1, 1)
    );
  }

  getPosition(): Vec2d {
    return this.position;
  }

  getHorizontalPosition() {
    return this.position.x;
  }

  addToPosition(vector: Vec2d) {
    return new Transform(this.position.add(vector), this.rotation, this.scale);
  }

  getRotationInDegree(): number {
    return (this.rotation * 180.0) / Math.PI;
  }

  addToRotationInDegree(rotationInDegree: number) {
    const newRotation = this.rotation + convertDegreeToRads(rotationInDegree);

    return new Transform(
      this.position,
      simplifyRotationInRads(newRotation),
      this.scale
    );
  }

  getScale(): Vec2d {
    return this.scale;
  }

  getHorizontalScale(): number {
    return this.scale.x;
  }

  getTrsMatrix() {
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
