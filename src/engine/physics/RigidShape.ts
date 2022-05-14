import { CollisionInfo, PhysicsEngine } from ".";
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

  constructor(owner: GameObject) {
    this.owner = owner;
    this._radius = 0;
    this.color = Color.random();

    this.mAcceleration = PhysicsEngine.getSystemAcceleration();
    this.mVelocity = Vec2d.from(0, 0);
    this.mInvMass = 1;
    this.mInertia = 0;
    this.mFriction = 0.8;
    this.mRestitution = 0.2;
    this.mAngularVelocity = 0;

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

  setMass(mass: number) {
    if (mass > 0) {
      this.mInvMass = 1 / mass;
      this.mAcceleration = PhysicsEngine.getSystemAcceleration();
    } else {
      this.mInvMass = 0;
      this.mAcceleration = Vec2d.from(0, 0); // to ensure object does not move
    }
    this.updateInertia();
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

    // p  = p + v*dt  with new velocity
    this.owner.addToPosition(this.mVelocity.scale(dt));

    this.owner.addToRotationInDegree(this.mAngularVelocity * dt);
  }

  addToOwnerPosition(value: Vec2d) {
    this.owner.addToPosition(value);
  }
}
