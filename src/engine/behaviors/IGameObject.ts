import { Camera } from "../graphics";

export interface IGameObject {
  load: () => void;
  init: () => void;
  update: () => void;
  draw: (camera: Camera) => void;
  unload: () => void;
}
