export class Vec2d {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  rotate(target: Vec2d, radianAngle: number): Vec2d {
    const x =
      target.x * Math.cos(radianAngle) - target.y * Math.sin(radianAngle);
    const y =
      target.x * Math.sin(radianAngle) + target.y * Math.cos(radianAngle);

    return new Vec2d(x, y);
  }

  add(vector: Vec2d): Vec2d {
    return new Vec2d(this.x + vector.x, this.y + vector.y);
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
