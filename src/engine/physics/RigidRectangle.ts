import { CollisionInfo, RigidCircle, RigidShape } from ".";
import { GameObject, isDebugMode, LineRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";

export class RigidRectangle extends RigidShape {
  vertex: Vec2d[] = [];
  faceNormal: Vec2d[] = [];
  scale: Vec2d;

  constructor(owner: GameObject, scale: Vec2d) {
    super(owner);
    this.scale = scale;
    this.setDebugBox();
  }

  setDebugBox() {
    if (isDebugMode()) {
      this.setVertices();
      this.debugBox = LineRenderable.build(this.buildPoints());
      this.debugBox.color = this.color;
    }
  }

  private buildPoints() {
    const result: number[] = [];
    this.vertex.forEach((v) => result.push(v.x, v.y, 0));
    result.push(this.vertex[0].x, this.vertex[0].y, 0);
    return result;
  }

  update() {
    super.update();
    this.setVertices();
    this.rotateVertices();
  }

  draw(resources: DrawingResources) {
    if (isDebugMode() && this.debugBox) {
      this.debugBox.updateVertices(this.buildPoints());
      this.debugBox.draw(resources);
    }
  }

  private setVertices() {
    this.radius =
      Math.sqrt(this.scale.x * this.scale.x + this.scale.y * this.scale.y) / 2;
    const center = this.getCenter();

    const halfWidth = this.scale.x / 2;
    const halfHeight = this.scale.y / 2;

    // 0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.vertex[0] = Vec2d.from(center.x - halfWidth, center.y - halfHeight);
    this.vertex[1] = Vec2d.from(center.x + halfWidth, center.y - halfHeight);
    this.vertex[2] = Vec2d.from(center.x + halfWidth, center.y + halfHeight);
    this.vertex[3] = Vec2d.from(center.x - halfWidth, center.y + halfHeight);
  }

  private computeFaceNormals() {
    // 0--Top;1--Right;2--Bottom;3--Left
    // mFaceNormal is normal of face toward outside of rectangle
    for (let side = 0; side < 4; side++) {
      const v = (side + 1) % 4;
      const nv = (side + 2) % 4;
      this.faceNormal[side] = this.vertex[v];

      this.faceNormal[side] = this.faceNormal[side].sub(this.vertex[nv]);
      this.faceNormal[side] = this.faceNormal[side].normalize();
    }
  }

  private rotateVertices() {
    const center = this.owner.getTransform().getPosition();
    const rotation = this.owner.getTransform().getRotationInRads();

    for (let i = 0; i < this.vertex.length; i++) {
      this.vertex[i] = this.vertex[i].rotateWRT(rotation, center);
    }

    this.computeFaceNormals();
  }

  collisionTest(otherShape: RigidShape) {
    if (otherShape.constructor.name === RigidCircle.name) {
      return CollisionInfo.notColided();
    }

    return CollisionInfo.notColided();
  }
}
