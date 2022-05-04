import {
  GameObject,
  isDebugMode,
  LineRenderable,
  LineRenderableFormats,
  Vec2d,
} from "..";
import { RigidShape } from "./RigidShape";

export class RigidCircle extends RigidShape {
  radius: number;

  constructor(owner: GameObject, radius: number) {
    super(owner);
    this.radius = radius;
    this.setDebugBox();
  }

  setDebugBox() {
    if (isDebugMode()) {
      this.debugBox = LineRenderable.build(LineRenderableFormats.circle(36));
    }
  }

  update() {
    // due to the mathematical model, we don't need to store the actual vertices' positions
    // so we just draw the circle based on the owner
    isDebugMode() &&
      this.debugBox &&
      this.debugBox.setTransform({
        position: this.getCenter(),
        scale: Vec2d.from(this.radius, this.radius),
      });
  }

  boundTest(otherShape: RigidCircle) {
    const distance = otherShape.getCenter().sub(this.getCenter()).length();
    const radiusSum = this.radius + otherShape.radius;

    return distance <= radiusSum;
  }
}
