import { CollisionInfo } from ".";
import { GameObject, IComponent, isDebugMode, LineRenderable } from "..";
import { Color, DrawingResources } from "../core";

export abstract class RigidShape implements IComponent {
  protected owner: GameObject;
  protected debugBox: LineRenderable | undefined;
  protected collisionDebugBox: LineRenderable | undefined;
  protected collisionInfo: CollisionInfo | undefined;
  protected color: Color;
  radius: number;

  constructor(owner: GameObject) {
    this.owner = owner;
    this.radius = 0;
    this.color = Color.random();

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
    //
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
      this.collisionInfo.colided
    ) {
      const collisionLine = [
        this.collisionInfo.mStart.x,
        this.collisionInfo.mStart.y,
        0,
        this.collisionInfo.mEnd.x,
        this.collisionInfo.mEnd.y,
        0,
      ];
      this.collisionDebugBox.updateVertices(collisionLine);
      this.collisionDebugBox.draw(resources);
    }
  }
}
