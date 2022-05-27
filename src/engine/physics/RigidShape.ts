import { CollisionInfo, PhysicsEngine, PhysicsSettings } from ".";
import { GameObject, IComponent, isDebugMode, LineRenderable, Vec2d } from "..";
import { Color, DrawingResources } from "../core";
import { getUpdateIntervalInSeconds } from "../Loop";

export abstract class RigidShape implements IComponent {
  protected owner: GameObject;
  protected debugBox: LineRenderable | undefined;
  protected collisionDebugBox: LineRenderable | undefined;
  protected collisionInfo: CollisionInfo | undefined;
  protected color: Color;
  private _radius: number;

  public get radius(): number {
    return this._radius;
  }
  public set radius(value: number) {
    this._radius = value;
    this.updateInertia();
  }

  mAcceleration: Vec2d;
  mVelocity: Vec2d;
  mInvMass: number;
  mInertia: number;
  mFriction: number;
  mRestitution: number;
  mAngularVelocity: number;
  disableRotation: boolean;

  constructor(owner: GameObject) {
    this.owner = owner;
    this._radius = 0;
    this.color = Color.random();

    this.mAcceleration = PhysicsEngine.getGlobalAcceleration();
    this.mVelocity = Vec2d.from(0, 0);
    this.mInvMass = 1;
    this.mInertia = 0;
    this.mFriction = 0;
    this.mRestitution = 1;
    this.mAngularVelocity = 0;
    this.disableRotation = false;

    if (isDebugMode()) {
      this.collisionDebugBox = LineRenderable.build([0, 0, 0]);
      this.collisionDebugBox.color = this.color;
    }
  }

  getCenter() {
    return this.owner.getTransform().getPosition();
  }

  boundTest(otherShape: RigidShape) {
    const distance = otherShape.getCenter().sub(this.getCenter()).length();
    const radiusSum = this.radius + otherShape.radius;

    if (distance > radiusSum) {
      this.collisionInfo = undefined;
      return false;
    }

    return true;
  }

  setPhysics(physicsSettings: PhysicsSettings) {
    physicsSettings.velocity !== undefined &&
      this.setVelocity(physicsSettings.velocity);

    physicsSettings.acceleration !== undefined &&
      this.setAcceleration(physicsSettings.acceleration);

    physicsSettings.mass !== undefined && this.setMass(physicsSettings.mass);

    physicsSettings.inertia !== undefined &&
      this.setInertia(physicsSettings.inertia);

    physicsSettings.friction !== undefined &&
      this.setFriction(physicsSettings.friction);

    physicsSettings.restitution !== undefined &&
      this.setRestitution(physicsSettings.restitution);

    physicsSettings.angularVelocity !== undefined &&
      this.setAngularVelocity(physicsSettings.angularVelocity);

    physicsSettings.disableRotation !== undefined &&
      this.setDisableRotation(physicsSettings.disableRotation);

    return this;
  }

  setDisableRotation(disableRotation: boolean) {
    this.disableRotation = disableRotation;
    return this;
  }

  setAngularVelocity(angularVelocity: number) {
    this.mAngularVelocity = this.disableRotation ? 0 : angularVelocity;
    return this;
  }

  setRestitution(restitution: number) {
    this.mRestitution = restitution;
    return this;
  }

  setInertia(inertia: number) {
    this.mInertia = inertia;
    return this;
  }

  setAcceleration(acceleration: Vec2d) {
    this.mAcceleration = acceleration;
    return this;
  }

  setFriction(friction: number) {
    this.mFriction = friction;
    return this;
  }

  setVelocity(velocity: Vec2d) {
    this.mVelocity = velocity;
    return this;
  }

  abstract collisionTest(otherShape: RigidShape): CollisionInfo;

  /////
  /// ICompontent
  /////
  load() {
    isDebugMode() && this.debugBox && this.debugBox.load();
    isDebugMode() && this.collisionDebugBox && this.collisionDebugBox.load();
  }

  init() {
    isDebugMode() && this.debugBox && this.debugBox.init();
    isDebugMode() && this.collisionDebugBox && this.collisionDebugBox.init();
  }

  update() {
    if (this.mInvMass === 0) return;
    this.travel();
  }

  draw(resources: DrawingResources) {
    isDebugMode() && this.debugBox && this.debugBox.draw(resources);
    this.drawDebugCollisionInfo(resources);
  }

  unload() {
    //
  }

  drawDebugCollisionInfo(resources: DrawingResources) {
    if (
      isDebugMode() &&
      this.collisionDebugBox &&
      this.collisionInfo &&
      this.collisionInfo.collided
    ) {
      const collisionLine = [
        this.collisionInfo.start.x,
        this.collisionInfo.start.y,
        0,
        this.collisionInfo.mEnd.x,
        this.collisionInfo.mEnd.y,
        0,
      ];
      this.collisionDebugBox.updateVertices(collisionLine);
      this.collisionDebugBox.draw(resources);
    }
  }

  setAngularVelocityDelta(dw: number) {
    this.mAngularVelocity += dw;
  }

  setMass(mass: number) {
    if (mass > 0) {
      this.mInvMass = 1 / mass;
      this.mAcceleration = PhysicsEngine.getGlobalAcceleration();
    } else {
      this.mInvMass = 0;
      this.mAcceleration = Vec2d.from(0, 0); // to ensure object does not move
    }
    this.updateInertia();

    return this;
  }

  getCurrentState() {
    let m = this.mInvMass;
    const kPrintPrecision = 2;

    if (m !== 0) m = 1 / m;
    return (
      "M=" +
      m.toFixed(kPrintPrecision) +
      "(I=" +
      this.mInertia.toFixed(kPrintPrecision) +
      ")" +
      " F=" +
      this.mFriction.toFixed(kPrintPrecision) +
      " R=" +
      this.mRestitution.toFixed(kPrintPrecision)
    );
  }

  abstract updateInertia(): void;

  travel() {
    const dt = getUpdateIntervalInSeconds();

    // update velocity by acceleration
    this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));

    // add global friction
    this.mVelocity = this.mVelocity.scale(PhysicsEngine.getGlobalFriction());

    // p  = p + v*dt  with new velocity
    this.owner.addToPosition(this.mVelocity.scale(dt));

    if (!this.disableRotation)
      this.owner.addToRotationInRad(this.mAngularVelocity * dt);

    this.mAngularVelocity *= PhysicsEngine.getGlobalAngularFriction();
  }

  addToOwnerPosition(value: Vec2d) {
    this.owner.addToPosition(value);
  }
}
