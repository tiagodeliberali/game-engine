import { GameObject } from "./GameObject";
import { IComponent } from "./IComponent";
import { Behavior } from "./Behavior";
import { walk2d, rotate, moveTowardsCurrentDirection } from "./Walking";
import { BoundingBox, ColisionStatus } from "./BoundingBox";

export {
  GameObject,
  Behavior,
  walk2d,
  rotate,
  moveTowardsCurrentDirection,
  BoundingBox,
  ColisionStatus,
};
export type { IComponent };
