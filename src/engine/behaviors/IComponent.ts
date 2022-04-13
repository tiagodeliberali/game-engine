import { Camera } from "..";

export interface IComponent {
  load: () => void;
  init: () => void;
  update: () => void;
  draw: (camera: Camera) => void;
  unload: () => void;
}
