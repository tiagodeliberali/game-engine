import { mat4, vec3 } from "gl-matrix";
import {
  convertDegreeToRads,
  simplifyRotationInDegree,
  Vec2d,
} from "../DataStructures";

export type TransformDef = {
  position?: Vec2d;
  rotationInDegree?: number;
  scale?: Vec2d;
};

export class Transform {
  private readonly position: Vec2d;
  private readonly rotationInDegree: number;
  private readonly scale: Vec2d;

  constructor(position: Vec2d, rotationInDegree: number, scale: Vec2d) {
    this.position = position;
    this.rotationInDegree = rotationInDegree;
    this.scale = scale;
  }

  static BuldDefault() {
    return new Transform(new Vec2d(0, 0), 0, new Vec2d(1, 1));
  }

  static Build(transformDef: TransformDef) {
    return new Transform(
      transformDef.position || new Vec2d(0, 0),
      simplifyRotationInDegree(transformDef.rotationInDegree || 0),
      transformDef.scale || new Vec2d(1, 1)
    );
  }

  getPosition(): Vec2d {
    return this.position;
  }

  addToPosition(vector: Vec2d) {
    return new Transform(
      this.position.add(vector),
      this.rotationInDegree,
      this.scale
    );
  }

  getRotationInDegree(): number {
    return this.rotationInDegree;
  }

  getRotationInRads() {
    return convertDegreeToRads(this.rotationInDegree);
  }

  addToRotationInDegree(rotationInDegree: number) {
    const newRotation = this.rotationInDegree + rotationInDegree;

    return new Transform(
      this.position,
      simplifyRotationInDegree(newRotation),
      this.scale
    );
  }

  getScale(): Vec2d {
    return this.scale;
  }

  getHorizontalScale(): number {
    return this.scale.x;
  }

  factorToScale(vector: Vec2d): Transform {
    return new Transform(
      this.position,
      this.rotationInDegree,
      new Vec2d(this.scale.x * vector.x, this.scale.y * vector.y)
    );
  }

  getTrsMatrix() {
    const trsMatrix = mat4.create();

    mat4.translate(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.position.x, this.position.y, 0.0)
    );

    mat4.rotateZ(
      trsMatrix,
      trsMatrix,
      convertDegreeToRads(this.rotationInDegree)
    );

    mat4.scale(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.scale.x, this.scale.y, 1.0)
    );

    return trsMatrix;
  }
}
