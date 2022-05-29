import { CollisionInfo, RigidShape } from ".";
import { Vec2d } from "..";

let globalAcceleration = Vec2d.from(0, 0);
let globalFriction = 0;
let globalAngularFriction = 0;
let mPosCorrectionRate = 0.8; // % separation to project objects
let mRelaxationCount = 15; // number of relaxation iterations

export type PhysicsSettings = {
  globalAcceleration?: Vec2d;
  globalFriction?: number;
  globalAngularFriction?: number;
  relaxationCount?: number;
  posCorrectionRate?: number;
};

export class PhysicsEngine {
  static setPhysics(settings: PhysicsSettings) {
    if (settings.globalAcceleration !== undefined)
      globalAcceleration = settings.globalAcceleration;

    if (settings.globalFriction !== undefined)
      globalFriction = settings.globalFriction;

    if (settings.globalAngularFriction !== undefined)
      globalAngularFriction = settings.globalAngularFriction;

    if (settings.relaxationCount !== undefined)
      mRelaxationCount = settings.relaxationCount;

    if (settings.posCorrectionRate !== undefined)
      mPosCorrectionRate = settings.posCorrectionRate;
  }

  static getGlobalAcceleration(): Vec2d {
    return globalAcceleration;
  }

  static getGlobalFriction(): number {
    return globalFriction;
  }

  static getGlobalAngularFriction(): number {
    return globalAngularFriction;
  }

  static getRelaxationCount() {
    return mRelaxationCount;
  }

  static collideShape(s1: RigidShape, s2: RigidShape): void {
    if (s1 !== s2) {
      if (s1.boundTest(s2) && (s1.invMass !== 0 || s2.invMass !== 0)) {
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
      (collisionInfo.depth / (s1.invMass + s2.invMass)) * mPosCorrectionRate;
    const correctionAmount = collisionInfo.normal.scale(num);

    s1.addToOwnerPosition(correctionAmount.scale(-s1.invMass));
    s2.addToOwnerPosition(correctionAmount.scale(s2.invMass));
  }

  static resolveCollision(
    b: RigidShape,
    a: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    const n = collisionInfo.normal;
    // Step A: Compute relative velocity
    const va = a.velocity;
    const vb = b.velocity;

    // Step A1: Compute the intersection position p
    // the direction of collisionInfo is always from b to a
    // but the Mass is inverse, so start scale with a and end scale with b
    const invSum = 1 / (b.invMass + a.invMass);
    const start = collisionInfo.start.scale(a.invMass * invSum);
    const end = collisionInfo.end.scale(b.invMass * invSum);
    const p = start.add(end);

    // Step A2: Compute relative velocity with rotation components
    //    Vectors from center to P
    //    r is vector from center of object to collision point
    const rAP = p.sub(a.getCenter());
    const rBP = p.sub(b.getCenter());

    // newV = V + mAngularVelocity cross R
    const vAP1 = Vec2d.from(
      -1 * a.angularVelocity * rAP.y,
      a.angularVelocity * rAP.x
    ).add(va);

    const vBP1 = Vec2d.from(
      -1 * b.angularVelocity * rBP.y,
      b.angularVelocity * rBP.x
    ).add(vb);

    const relativeVelocity = vAP1.sub(vBP1);

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
    const newRestituion = (a.restitution + b.restitution) * 0.5;
    const newFriction = 1 - (a.friction + b.friction) * 0.5;

    // Step E: Impulse in the normal and tangent directions
    // R cross N
    const rBPcrossN = rBP.x * n.y - rBP.y * n.x; // rBP cross n
    const rAPcrossN = rAP.x * n.y - rAP.y * n.x; // rAP cross n

    // Calc impulse scalar, formula of jN
    // can be found in http://www.myphysicslab.com/collision.html
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN =
      jN /
      (b.invMass +
        a.invMass +
        rBPcrossN * rBPcrossN * b.inertia +
        rAPcrossN * rAPcrossN * a.inertia);

    const rBPcrossT = rBP.x * tangent.y - rBP.y * tangent.x;
    const rAPcrossT = rAP.x * tangent.y - rAP.y * tangent.x;

    let jT = (newFriction - 1) * rVelocityInTangent;
    jT =
      jT /
      (b.invMass +
        a.invMass +
        rBPcrossT * rBPcrossT * b.inertia +
        rAPcrossT * rAPcrossT * a.inertia);

    // Update linear and angular velocities
    a.velocity = va
      .add(n.scale(jN * a.invMass))
      .add(tangent.scale(jT * a.invMass));

    a.setAngularVelocityDelta(
      rAPcrossN * jN * a.inertia + rAPcrossT * jT * a.inertia
    );

    b.velocity = vb
      .add(n.scale(-(jN * b.invMass)))
      .add(tangent.scale(-(jT * b.invMass)));

    b.setAngularVelocityDelta(
      -(rBPcrossN * jN * b.inertia + rBPcrossT * jT * b.inertia)
    );
  }

  static resolveCollisionSimplified(
    b: RigidShape,
    a: RigidShape,
    collisionInfo: CollisionInfo
  ) {
    const n = collisionInfo.normal;

    // Step A: Compute relative velocity
    const va = a.velocity;
    const vb = b.velocity;
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
    const newRestituion = (a.restitution + b.restitution) * 0.5;
    const newFriction = 1 - (a.friction + b.friction) * 0.5;

    // Step E: Impulse in the normal and tangent directions
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (a.invMass + b.invMass);
    let jT = (newFriction - 1) * rVelocityInTangent;
    jT = jT / (a.invMass + b.invMass);

    // Step F: Update velocity in both normal and tangent directions
    a.velocity = va
      .add(n.scale(jN * a.invMass))
      .add(tangent.scale(jT * a.invMass));

    b.velocity = vb
      .add(n.scale(-jN * b.invMass))
      .add(tangent.scale(-jT * b.invMass));
  }
}
