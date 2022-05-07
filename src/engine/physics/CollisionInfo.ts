import { Vec2d } from "..";

export class CollisionInfo {
  collided: boolean;
  depth: number;
  normal: Vec2d;
  start: Vec2d;
  mEnd: Vec2d;

  constructor(colided: boolean, depth: number, normal: Vec2d, start: Vec2d) {
    this.collided = colided;
    this.depth = depth;
    this.normal = normal;
    this.start = start;
    this.mEnd = start.add(normal.scale(depth));
  }

  static colided(depth: number, normal: Vec2d, start: Vec2d) {
    return new CollisionInfo(true, depth, normal, start);
  }

  static notColided() {
    return new CollisionInfo(false, 0, Vec2d.from(0, 0), Vec2d.from(0, 0));
  }

  changeDir() {
    this.normal = this.normal.scale(-1);
    const n = this.start;
    this.start = this.mEnd;
    this.mEnd = n;
  }
}
