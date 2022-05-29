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

  acceleration: Vec2d;
  velocity: Vec2d;
  invMass: number;
  inertia: number;
  friction: number;
  restitution: number;
  angularVelocity: number;
  disableRotation: boolean;

  constructor(owner: GameObject) {
    this.owner = owner;
    this._radius = 0;
    this.color = Color.random();

    this.acceleration = PhysicsEngine.getGlobalAcceleration();
    this.velocity = Vec2d.from(0, 0);
    this.invMass = 1;
    this.inertia = 0;
    this.friction = 0;
    this.restitution = 1;
    this.angularVelocity = 0;
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
    this.angularVelocity = this.disableRotation ? 0 : angularVelocity;
    return this;
  }

  setRestitution(restitution: number) {
    this.restitution = restitution;
    return this;
  }

  setInertia(inertia: number) {
    this.inertia = inertia;
    return this;
  }

  setAcceleration(acceleration: Vec2d) {
    this.acceleration = acceleration;
    return this;
  }

  setFriction(friction: number) {
    this.friction = friction;
    return this;
  }

  setVelocity(velocity: Vec2d) {
    this.velocity = velocity;
    return this;
  }

  abstract collisionTest(otherShape: RigidShape): CollisionInfo;

  /**
   * ICompontent
   */
  load() {
    const debugBoxComponent = this.debugBox as IComponent;
    const collisionDebugBoxComponent = this.collisionDebugBox as IComponent;

    isDebugMode() &&
      debugBoxComponent &&
      debugBoxComponent.load &&
      debugBoxComponent.load();
    isDebugMode() &&
      collisionDebugBoxComponent &&
      collisionDebugBoxComponent.load &&
      collisionDebugBoxComponent.load();
  }

  init() {
    isDebugMode() && this.debugBox && this.debugBox.init();
    isDebugMode() && this.collisionDebugBox && this.collisionDebugBox.init();
  }

  update() {
    if (this.invMass === 0) return;
    this.travel();
  }

  draw(resources: DrawingResources) {
    isDebugMode() && this.debugBox && this.debugBox.draw(resources);
    this.drawDebugCollisionInfo(resources);
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
        this.collisionInfo.end.x,
        this.collisionInfo.end.y,
        0,
      ];
      this.collisionDebugBox.updateVertices(collisionLine);
      this.collisionDebugBox.draw(resources);
    }
  }

  setAngularVelocityDelta(dw: number) {
    this.angularVelocity += dw;
  }

  setMass(mass: number) {
    if (mass > 0) {
      this.invMass = 1 / mass;
      this.acceleration = PhysicsEngine.getGlobalAcceleration();
    } else {
      this.invMass = 0;
      this.acceleration = Vec2d.from(0, 0); // to ensure object does not move
    }
    this.updateInertia();

    return this;
  }

  getCurrentState() {
    let m = this.invMass;
    const kPrintPrecision = 2;

    if (m !== 0) m = 1 / m;
    return (
      "M=" +
      m.toFixed(kPrintPrecision) +
      "(I=" +
      this.inertia.toFixed(kPrintPrecision) +
      ")" +
      " F=" +
      this.friction.toFixed(kPrintPrecision) +
      " R=" +
      this.restitution.toFixed(kPrintPrecision)
    );
  }

  abstract updateInertia(): void;

  travel() {
    const dt = getUpdateIntervalInSeconds();

    // update velocity by acceleration
    this.velocity = this.velocity.add(this.acceleration.scale(dt));

    // add global friction
    this.velocity = this.velocity.scale(1 - PhysicsEngine.getGlobalFriction());

    // p  = p + v*dt  with new velocity
    this.owner.addToPosition(this.velocity.scale(dt));

    if (!this.disableRotation)
      this.owner.addToRotationInRad(this.angularVelocity * dt);

    this.angularVelocity *= 1 - PhysicsEngine.getGlobalAngularFriction();
  }

  addToOwnerPosition(value: Vec2d) {
    this.owner.addToPosition(value);
  }
}
