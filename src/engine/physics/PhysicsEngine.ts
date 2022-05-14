import { CollisionInfo, RigidShape } from ".";
import { Vec2d } from "..";

const mPosCorrectionRate = 0.8; // % separation to project objects
let mRelaxationCount = 15; // number of relaxation iterations

export class PhysicsEngine {
  static collideShape(s1: RigidShape, s2: RigidShape): void {
    if (s1 !== s2) {
      if (s1.boundTest(s2) && (s1.mInvMass !== 0 || s2.mInvMass !== 0)) {
        const collisionInfo = s1.collisionTest(s2);
        if (collisionInfo.collided) {
          // make sure mCInfo is always from s1 towards s2
          const mS1toS2 = s2.getCenter().sub(s1.getCenter());
          if (mS1toS2.dot(collisionInfo.normal) < 0) {
            collisionInfo.changeDir();
          }
          this.positionalCorrection(s1, s2, collisionInfo);
        }
      }
    }
  }

  static positionalCorrection(
    s1: RigidShape,
    s2: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    const num =
      (collisionInfo.depth / (s1.mInvMass + s2.mInvMass)) * mPosCorrectionRate;
    const correctionAmount = collisionInfo.normal.scale(num);

    s1.addToOwnerPosition(correctionAmount.scale(-s1.mInvMass));
    s2.addToOwnerPosition(correctionAmount.scale(s2.mInvMass));
  }

  static getSystemAcceleration(): Vec2d {
    return Vec2d.from(0, 0);
  }

  static getRelaxationCount() {
    return mRelaxationCount;
  }

  static incRelaxationCount(dc: number) {
    mRelaxationCount += dc;
  }
}
