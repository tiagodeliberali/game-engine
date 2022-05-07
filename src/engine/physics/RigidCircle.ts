import {
  GameObject,
  isDebugMode,
  LineRenderable,
  LineRenderableFormats,
  Vec2d,
} from "..";
import { CollisionInfo, RigidRectangle, RigidShape } from ".";

export class RigidCircle extends RigidShape {
  constructor(owner: GameObject, radius: number) {
    super(owner);
    this.radius = radius;
    this.setDebugBox();
  }

  setDebugBox() {
    if (isDebugMode()) {
      this.debugBox = LineRenderable.build(LineRenderableFormats.circle(36));
      this.debugBox.color = this.color;
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

  collisionTest(otherShape: RigidShape): CollisionInfo {
    if (otherShape.constructor.name === RigidCircle.name) {
      return this.collideCircCirc(otherShape as RigidCircle);
    }

    return (otherShape as RigidRectangle).collideRectCirc(this);
  }

  collideCircCirc(other: RigidCircle) {
    const radiusSum = this.radius + other.radius;
    let vectorThisToOther = other.getCenter().sub(this.getCenter());
    const dist = vectorThisToOther.length();

    if (dist > Math.sqrt(radiusSum * radiusSum)) {
      // not overlapping
      this.collisionInfo = CollisionInfo.notColided();
      return this.collisionInfo;
    }

    if (dist !== 0) {
      vectorThisToOther = vectorThisToOther.normalize();
      const startPosition = vectorThisToOther
        .scale(-other.radius)
        .add(other.getCenter());
      this.collisionInfo = CollisionInfo.colided(
        radiusSum - dist,
        vectorThisToOther,
        startPosition
      );
    } else {
      const normal = Vec2d.from(0, -1);
      let startPosition: Vec2d;

      if (this.radius > other.radius) {
        const position = this.getCenter();
        startPosition = Vec2d.from(position.x, position.y + this.radius);
      } else {
        const position = other.getCenter();
        startPosition = Vec2d.from(position.x, position.y + other.radius);
      }

      this.collisionInfo = CollisionInfo.colided(
        radiusSum,
        normal,
        startPosition
      );
    }

    return this.collisionInfo;
  }
}
