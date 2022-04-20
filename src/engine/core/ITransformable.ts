import { Transform, TransformDef } from ".";
import { Vec2d } from "..";

export interface ITransformable {
  getTransform: () => Transform;
  setTransform: (transform: TransformDef) => void;
  getCurrentDirection: () => Vec2d;

  // update methods
  addToPosition: (vector: Vec2d) => void;
  addToRotationInDegree: (value: number) => void;
  factorToScale: (vector: Vec2d) => void;
}
