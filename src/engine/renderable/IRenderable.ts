import { Camera, Transform, TransformDef } from "../graphics";

export interface IRenderable {
  draw: (camera: Camera) => void;
  unload: () => void;
  getTransform: () => Transform;
  setTransform: (transform: TransformDef) => void;
}
