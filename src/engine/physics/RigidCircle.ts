import {
  GameObject,
  isDebugMode,
  LineRenderable,
  LineRenderableFormats,
  Vec2d,
} from "..";
import { CollisionInfo, RigidShape } from ".";

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

    return CollisionInfo.notColided();
  }

  collideCircCirc(other: RigidCircle) {
    const rSum = this.radius + other.radius;
    let vFrom1to2 = other.getCenter().sub(this.getCenter());
    const dist = vFrom1to2.length();

    if (dist > Math.sqrt(rSum * rSum)) {
      // not overlapping
      this.collisionInfo = CollisionInfo.notColided();
      return this.collisionInfo;
    }

    if (dist !== 0) {
      // Step 2: Colliding circle centers are at different positions
      vFrom1to2 = vFrom1to2.normalize();
      const vToC2 = vFrom1to2.scale(-other.radius).add(other.getCenter());
      this.collisionInfo = CollisionInfo.colided(rSum - dist, vFrom1to2, vToC2);
    } else {
      const n = Vec2d.from(0, -1);
      // Step 3: Colliding circle centers are at exactly the same position
      if (this.radius > other.radius) {
        const pC1 = this.getCenter();
        const ptOnC1 = Vec2d.from(pC1.x, pC1.y + this.radius);
        this.collisionInfo = CollisionInfo.colided(rSum, n, ptOnC1);
      } else {
        const pC2 = other.getCenter();
        const ptOnC2 = Vec2d.from(pC2.x, pC2.y + other.radius);
        this.collisionInfo = CollisionInfo.colided(rSum, n, ptOnC2);
      }
    }

    return this.collisionInfo;
  }
}
