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
          this.resolveCollision(s1, s2, collisionInfo);
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

  static resolveCollision(
    b: RigidShape,
    a: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    const n = collisionInfo.normal;

    // Step A: Compute relative velocity
    const va = a.mVelocity;
    const vb = b.mVelocity;
    const relativeVelocity = va.sub(vb);

    // Step B: Determine relative velocity in normal direction
    const rVelocityInNormal = relativeVelocity.dot(n);

    // if objects moving apart ignore
    if (rVelocityInNormal > 0) {
      return;
    }

    // Step C: Compute collision tangent direction
    const tangent = n
      .scale(rVelocityInNormal)
      .sub(relativeVelocity)
      .normalize();

    // Relative velocity in tangent direction
    const rVelocityInTangent = relativeVelocity.dot(tangent);

    // Step D: Determine the effective coefficients
    const newRestituion = (a.mRestitution + b.mRestitution) * 0.5;
    const newFriction = 1 - (a.mFriction + b.mFriction) * 0.5;

    // Step E: Impulse in the normal and tangent directions
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (a.mInvMass + b.mInvMass);
    let jT = (newFriction - 1) * rVelocityInTangent;
    jT = jT / (a.mInvMass + b.mInvMass);

    // Step F: Update velocity in both normal and tangent directions
    a.mVelocity = va
      .add(n.scale(jN * a.mInvMass))
      .add(tangent.scale(jT * a.mInvMass));

    b.mVelocity = vb
      .add(n.scale(-jN * b.mInvMass))
      .add(tangent.scale(-jT * b.mInvMass));
  }
}
