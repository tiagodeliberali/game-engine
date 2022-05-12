import { CollisionInfo, RigidCircle, RigidShape } from ".";
import { GameObject, isDebugMode, LineRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";

export class RigidRectangle extends RigidShape {
  vertex: Vec2d[] = [];
  faceNormal: Vec2d[] = [];
  private _scale: Vec2d;

  public get scale(): Vec2d {
    return this._scale;
  }
  public set scale(value: Vec2d) {
    this._scale = value;
    this.updateInertia();
  }

  constructor(owner: GameObject, scale: Vec2d) {
    super(owner);
    this._scale = scale;
    this.setDebugBox();
    this.updateInertia();
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
      return this.collideRectCirc(otherShape as RigidCircle);
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

  collideRectCirc(otherCir: RigidCircle): CollisionInfo {
    let outside = false;
    let bestDistance = -Number.MAX_VALUE;
    let nearestEdge = 0;
    let verticeToCenter = Vec2d.from(0, 0);
    let projection = 0;
    let i = 0;
    const cirCenter = otherCir.getCenter();

    // Step A: Compute the nearest edge
    // Actually, computes the first outside edge. Doesn't matter if it is the nearest one.
    // It will be the best distance only if the circle is inside the rectangle
    while (!outside && i < this.vertex.length) {
      verticeToCenter = cirCenter.sub(this.vertex[i]);
      projection = verticeToCenter.dot(this.faceNormal[i]);

      if (projection > bestDistance) {
        outside = projection > 0; // if projection < 0, inside
        bestDistance = projection;
        nearestEdge = i;
      }
      i++;
    }

    if (!outside) {
      // inside
      // Step B: The center of circle is inside of rectangle
      const radiusVec = this.faceNormal[nearestEdge].scale(otherCir.radius);
      const ptAtCirc = cirCenter.sub(radiusVec);

      this.collisionInfo = CollisionInfo.colided(
        otherCir.radius - bestDistance,
        this.faceNormal[nearestEdge],
        ptAtCirc
      );

      return this.collisionInfo;
    }

    let v1 = cirCenter.sub(this.vertex[nearestEdge]);
    let v2 = this.vertex[(nearestEdge + 1) % 4].sub(this.vertex[nearestEdge]);
    let dot = v1.dot(v2);

    if (dot < 0) {
      // Step C1: In Region RG1
      this.collisionInfo = this.checkCircRectVertex(
        v1,
        cirCenter,
        otherCir.radius
      );
    } else {
      // Either in Region RG2 or RG3
      // v1 is from right vertex of face to center of circle
      // v2 is from right vertex of face to left vertex of face
      v1 = cirCenter.sub(this.vertex[(nearestEdge + 1) % 4]);
      v2 = v2.scale(-1);
      dot = v1.dot(v2);

      if (dot < 0) {
        // Step C2: In Region RG2
        this.collisionInfo = this.checkCircRectVertex(
          v1,
          cirCenter,
          otherCir.radius
        );
      } else {
        // Step C3: In Region RG3
        if (bestDistance < otherCir.radius) {
          const radiusVec = this.faceNormal[nearestEdge].scale(otherCir.radius);
          const dist = otherCir.radius - bestDistance;
          const ptAtCirc = cirCenter.sub(radiusVec);

          this.collisionInfo = CollisionInfo.colided(
            dist,
            this.faceNormal[nearestEdge],
            ptAtCirc
          );
        } else {
          this.collisionInfo = CollisionInfo.notColided();
        }
      }
    }

    return this.collisionInfo;
  }

  private checkCircRectVertex(
    v1: Vec2d,
    cirCenter: Vec2d,
    r: number
  ): CollisionInfo {
    // the center of circle is in corner region of vertex[nearestEdge]
    const dist = v1.length();

    // compare the distance with radius to decide collision
    if (dist > r) {
      return CollisionInfo.notColided();
    }

    v1 = v1.normalize();

    const radiusVector = v1.scale(-r);
    const startPosition = cirCenter.add(radiusVector);

    return CollisionInfo.colided(r - dist, v1, startPosition);
  }

  updateInertia() {
    // Expect this.mInvMass to be already inverted!
    if (this.mInvMass === 0) this.mInertia = 0;
    else {
      // inertia=mass*width^2+height^2
      this.mInertia =
        ((1 / this.mInvMass) *
          (this.scale.x * this.scale.x + this.scale.y * this.scale.y)) /
        12;
      this.mInertia = 1 / this.mInertia;
    }
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
