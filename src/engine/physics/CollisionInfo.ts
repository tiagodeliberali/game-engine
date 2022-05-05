import { Vec2d } from "..";

export class CollisionInfo {
  colided: boolean;
  mDepth: number;
  mNormal: Vec2d;
  mStart: Vec2d;
  mEnd: Vec2d;

  constructor(colided: boolean, depth: number, normal: Vec2d, start: Vec2d) {
    this.colided = colided;
    this.mDepth = depth;
    this.mNormal = normal;
    this.mStart = start;
    this.mEnd = start.add(normal.scale(depth));
  }

  static colided(depth: number, normal: Vec2d, start: Vec2d) {
    return new CollisionInfo(true, depth, normal, start);
  }

  static notColided() {
    return new CollisionInfo(false, 0, Vec2d.from(0, 0), Vec2d.from(0, 0));
  }

  changeDir() {
    this.mNormal = this.mNormal.scale(-1);
    const n = this.mStart;
    this.mStart = this.mEnd;
    this.mEnd = n;
  }
}
