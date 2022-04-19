import { VertexBuffer } from ".";

let unitSquareCenteredOnZero: VertexBuffer;
let unitSquareLeftBottonOnZero: VertexBuffer;
let dynamicUnitSquareLeftBottonOnZero: VertexBuffer;
let dynamicUnitSquareLeftBottonOnZeroForFont: VertexBuffer;

export class VertexBufferLib {
  static UnitSquareCenteredOnZero() {
    if (unitSquareCenteredOnZero === undefined) {
      const vertices = [
        0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
      ];
      unitSquareCenteredOnZero = new VertexBuffer();
      unitSquareCenteredOnZero.initStaticBuffer(vertices);
    }

    return unitSquareCenteredOnZero;
  }

  static UnitSquareLeftBottonOnZero() {
    if (unitSquareLeftBottonOnZero === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      unitSquareLeftBottonOnZero = new VertexBuffer();
      unitSquareLeftBottonOnZero.initStaticBuffer(vertices);
    }

    return unitSquareLeftBottonOnZero;
  }

  static DynamicUnitSquareLeftBottonOnZero() {
    // should be cached?
    if (dynamicUnitSquareLeftBottonOnZero === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      dynamicUnitSquareLeftBottonOnZero = new VertexBuffer();
      dynamicUnitSquareLeftBottonOnZero.initDynamicBuffer(vertices);
    }

    return dynamicUnitSquareLeftBottonOnZero;
  }

  static DynamicUnitSquareLeftBottonOnZeroForFont() {
    // should be cached?
    if (dynamicUnitSquareLeftBottonOnZeroForFont === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      dynamicUnitSquareLeftBottonOnZeroForFont = new VertexBuffer();
      dynamicUnitSquareLeftBottonOnZeroForFont.initDynamicBuffer(vertices);
    }

    return dynamicUnitSquareLeftBottonOnZeroForFont;
  }
}
