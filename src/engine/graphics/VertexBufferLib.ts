import { VertexBuffer } from ".";

let unitSquareCenteredOnZero: VertexBuffer;
let unitSquareLeftBottonOnZero: VertexBuffer;

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
    const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
    const buffer = new VertexBuffer();
    buffer.initDynamicBuffer(vertices);

    return buffer;
  }
}
