import { IComponent } from "..";
import { Transform, TransformDef } from "../graphics";

export interface IRenderable extends IComponent {
  getTransform: () => Transform;
  setTransform: (transform: TransformDef) => void;
}
