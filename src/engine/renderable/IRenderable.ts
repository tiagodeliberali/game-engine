import { Camera } from "../graphics/Camera";
import { Transform } from "../graphics/Transform";

export interface IRenderable {
  draw: (camera: Camera) => void;
  unload: () => void;
  getTransform: () => Transform;
}
