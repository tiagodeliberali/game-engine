import { Transform, TransformDef } from ".";
import { Vec2d } from "..";

export interface ITransformable {
  addToPosition: (vector: Vec2d) => void;
  addToRotationInDegree: (value: number) => void;
  getTransform: () => Transform;
  setTransform: (transform: TransformDef) => void;
}
