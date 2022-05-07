import { CollisionInfo, RigidShape } from ".";

export class PhysicsEngine {
  static collideShape(s1: RigidShape, s2: RigidShape) {
    if (s1 !== s2) {
      if (s1.boundTest(s2)) {
        const collisionInfo = s1.collisionTest(s2);
        if (collisionInfo.collided) {
          // make sure mCInfo is always from s1 towards s2
          const mS1toS2 = s2.getCenter().sub(s1.getCenter());
          if (mS1toS2.dot(collisionInfo.normal) < 0) {
            collisionInfo.changeDir();
          }

          return collisionInfo;
        }
      }
    }
    return CollisionInfo.notColided();
  }
}
