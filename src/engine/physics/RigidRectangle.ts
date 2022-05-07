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
      this.drawDebugCollisionInfo(resources);
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
    // faceNormal is normal of face toward outside of rectangle
    for (let side = 0; side < 4; side++) {
      const normalEndVertex = (side + 1) % 4;
      const normalStartVertex = (side + 2) % 4;

      this.faceNormal[side] = this.vertex[normalEndVertex]
        .sub(this.vertex[normalStartVertex])
        .normalize();
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

  collisionTest(otherShape: RigidShape): CollisionInfo {
    if (otherShape.constructor.name === RigidCircle.name) {
      return CollisionInfo.notColided();
    }

    return this.collideRectRect(otherShape as RigidRectangle);
  }

  collideRectRect(other: RigidRectangle) {
    this.collisionInfo = CollisionInfo.notColided();
    // find Axis of Separation for both rectangle
    const collisionInfoOther = this.findAxisLeastPenetration(other);

    // if one of the findAxisLeastPenetration calls return not collided, then there is no collision
    if (collisionInfoOther.collided) {
      const colisionInfoThis = other.findAxisLeastPenetration(this);
      if (colisionInfoThis.collided) {
        // if rectangles overlap, the shorter normal is the normal
        if (collisionInfoOther.depth < colisionInfoThis.depth) {
          const depthVec = collisionInfoOther.normal.scale(
            collisionInfoOther.depth
          );
          this.collisionInfo = CollisionInfo.colided(
            collisionInfoOther.depth,
            collisionInfoOther.normal,
            collisionInfoOther.start.sub(depthVec)
          );
        } else {
          this.collisionInfo = CollisionInfo.colided(
            colisionInfoThis.depth,
            colisionInfoThis.normal.scale(-1),
            colisionInfoThis.start
          );
        }
      }
    }
    return this.collisionInfo;
  }

  private findAxisLeastPenetration(otherRect: RigidRectangle) {
    let bestPoint = new SupportStruct();
    let bestIndex = -1;

    for (let i = 0; i < this.faceNormal.length; i++) {
      const reversedNormal = this.faceNormal[i].scale(-1);
      const positionOnEdge = this.vertex[i];

      // find the support on B
      // the point has longest distance with edge i
      const supportPoint = otherRect.findSupportPoint(
        reversedNormal,
        positionOnEdge
      );

      if (!supportPoint.found) {
        return CollisionInfo.notColided();
      }

      // get the shortest support point depth
      if (bestPoint.length < 0 || supportPoint.length < bestPoint.length) {
        bestIndex = i;
        bestPoint = supportPoint;
      }
    }

    const bestVector = this.faceNormal[bestIndex].scale(bestPoint.length);
    const startPosition = bestPoint.position.add(bestVector);
    return CollisionInfo.colided(
      bestPoint.length,
      this.faceNormal[bestIndex],
      startPosition
    );
  }

  private findSupportPoint(edgeNormal: Vec2d, pointOnEdge: Vec2d) {
    const supportPoint = new SupportStruct();

    for (let i = 0; i < this.vertex.length; i++) {
      const vectorToEdge = this.vertex[i].sub(pointOnEdge);
      const projection = vectorToEdge.dot(edgeNormal);

      if (projection > 0 && projection > supportPoint.length) {
        supportPoint.set(this.vertex[i], projection);
      }
    }

    return supportPoint;
  }
}

class SupportStruct {
  position: Vec2d;
  length: number;
  found: boolean;

  constructor() {
    this.position = Vec2d.from(0, 0);
    this.length = -1;
    this.found = false;
  }

  set(position: Vec2d, length: number) {
    this.position = position;
    this.length = length;
    this.found = true;
  }
}
