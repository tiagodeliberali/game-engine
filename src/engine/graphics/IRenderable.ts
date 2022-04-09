import { Camera } from "./Camera";
import { Transform } from "./Transform";

export interface IRenderable {
  draw: (camera: Camera) => void;
  unload: () => void;
  getTransform: () => Transform;
}
