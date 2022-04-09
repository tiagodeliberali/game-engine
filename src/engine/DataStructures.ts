export class Vec2d {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Box {
  top: number;
  bottom: number;
  left: number;
  right: number;

  constructor(top: number, bottom: number, right: number, left: number) {
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  normalize(width: number, height: number) {
    this.top = this.top / height;
    this.bottom = this.bottom / height;
    this.left = this.left / width;
    this.right = this.right / width;
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
