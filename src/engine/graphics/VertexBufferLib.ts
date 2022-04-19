import { VertexBuffer } from ".";

export class VertexBufferLib {
  static UnitSquareCenteredOnZero() {
    const vertices = [
      0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
    ];
    const buffer = new VertexBuffer(3);
    buffer.initStaticBuffer(vertices);

    return buffer;
  }

  static UnitSquareLeftBottonOnZero() {
    const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
    const buffer = new VertexBuffer(2);
    buffer.initStaticBuffer(vertices);

    return buffer;
  }

  static DynamicUnitSquareLeftBottonOnZero() {
    const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
    const buffer = new VertexBuffer(2);
    buffer.initDynamicBuffer(vertices);

    return buffer;
  }
}
