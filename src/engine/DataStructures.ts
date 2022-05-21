import { vec2, vec3 } from "gl-matrix";

export const simplifyRotationInRads = (rotation: number) => {
  while (rotation > 2 * Math.PI) {
    rotation -= 2 * Math.PI;
  }

  return rotation;
};

export const simplifyRotationInDegree = (rotation: number) => {
  while (rotation > 360) {
    rotation -= 360;
  }

  return rotation;
};

export const convertDegreeToRads = (rotation: number) =>
  simplifyRotationInRads((rotation * Math.PI) / 180.0);

export class Vec2d {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static from(x: number, y: number): Vec2d {
    return new Vec2d(x, y);
  }

  rotate(radianAngle: number): Vec2d {
    const x = this.x * Math.cos(radianAngle) - this.y * Math.sin(radianAngle);
    const y = this.x * Math.sin(radianAngle) + this.y * Math.cos(radianAngle);
    return new Vec2d(x, y);
  }

  rotateInDegree(degreeAngle: number) {
    return this.rotate(convertDegreeToRads(degreeAngle));
  }

  lerp(finalValue: Vec2d, rate: number) {
    const current = this.toVec2();

    return Vec2d.fromVec2(
      vec2.lerp(current, current, finalValue.toVec2(), rate)
    );
  }

  add(vector: Vec2d): Vec2d {
    return new Vec2d(this.x + vector.x, this.y + vector.y);
  }

  sub(vector: Vec2d) {
    return new Vec2d(this.x - vector.x, this.y - vector.y);
  }

  multiply(vector: Vec2d) {
    return Vec2d.from(this.x * vector.x, this.y * vector.y);
  }

  length() {
    return vec2.length(this.toVec2());
  }

  normalize() {
    if (this.length() === 0) {
      return Vec2d.from(this.x, this.y);
    }

    const result = [0, 0] as vec2;
    vec2.scale(result, this.toVec2(), 1 / this.length());
    return Vec2d.fromVec2(result);
  }

  scale(value: number) {
    return new Vec2d(this.x * value, this.y * value);
  }

  dot(vector: Vec2d): number {
    return vec2.dot(this.toVec2(), vector.toVec2());
  }

  cross(vector: Vec2d) {
    const currentVec2 = vec3.fromValues(this.x, this.y, 0);
    const vectorVec2 = vec3.fromValues(vector.x, vector.y, 0);
    const result: vec3 = [0, 0, 0];
    vec3.cross(result, currentVec2, vectorVec2);

    return result[2];
  }

  rotateWRT(angle: number, reference: Vec2d) {
    return this.sub(reference).rotate(angle).add(reference);
  }

  private toVec2(): vec2 {
    return [this.x, this.y];
  }

  private static fromVec2(vector: vec2) {
    return new Vec2d(vector[0], vector[1]);
  }

  toVec3(z: number): Vec3d {
    return Vec3d.from(this.x, this.y, z);
  }
}

export class Vec3d {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static from(x: number, y: number, z: number) {
    return new Vec3d(x, y, z);
  }

  toVec3(): Iterable<number> {
    return [this.x, this.y, this.z];
  }
}

export class Box {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;

  constructor(top: number, bottom: number, right: number, left: number) {
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  normalize(width: number, height: number) {
    return new Box(
      this.top / height,
      this.bottom / height,
      this.right / width,
      this.left / width
    );
  }

  isNormalized() {
    return (
      this.top >= 0 &&
      this.top <= 1 &&
      this.bottom >= 0 &&
      this.bottom <= 1 &&
      this.left >= 0 &&
      this.left <= 1 &&
      this.right >= 0 &&
      this.right <= 1
    );
  }

  getElementUVCoordinateArray() {
    return [
      this.right,
      this.top,
      this.left,
      this.top,
      this.right,
      this.bottom,
      this.left,
      this.bottom,
    ];
  }
}
