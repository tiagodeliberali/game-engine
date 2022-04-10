import { Camera, Transform } from "../graphics";

export interface IRenderable {
  draw: (camera: Camera) => void;
  unload: () => void;
  getTransform: () => Transform;
}
