import { EngineError } from "../EngineError";

let unitSquareCenteredOnZero: VertexBuffer;
let unitSquareLeftBottonOnZero: VertexBuffer;
let dynamicUnitSquareLeftBottonOnZero: VertexBuffer;
let dynamicUnitSquareLeftBottonOnZeroForFont: VertexBuffer;

export class VertexBuffer {
  gl: WebGL2RenderingContext;
  vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    const buffer = gl.createBuffer();
    if (buffer === null) {
      throw new EngineError(VertexBuffer.name, "Failed to load vertex buffer");
    }

    this.gl = gl;
    this.vertexBuffer = buffer;
  }

  static UnitSquareCenteredOnZero(gl: WebGL2RenderingContext) {
    if (unitSquareCenteredOnZero === undefined) {
      const vertices = [
        0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
      ];
      unitSquareCenteredOnZero = new VertexBuffer(gl);
      unitSquareCenteredOnZero.initStaticBuffer(vertices);
    }

    return unitSquareCenteredOnZero;
  }

  static UnitSquareLeftBottonOnZero(gl: WebGL2RenderingContext) {
    if (unitSquareLeftBottonOnZero === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      unitSquareLeftBottonOnZero = new VertexBuffer(gl);
      unitSquareLeftBottonOnZero.initStaticBuffer(vertices);
    }

    return unitSquareLeftBottonOnZero;
  }

  static DynamicUnitSquareLeftBottonOnZero(gl: WebGL2RenderingContext) {
    // should be cached?
    if (dynamicUnitSquareLeftBottonOnZero === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      dynamicUnitSquareLeftBottonOnZero = new VertexBuffer(gl);
      dynamicUnitSquareLeftBottonOnZero.initDynamicBuffer(vertices);
    }

    return dynamicUnitSquareLeftBottonOnZero;
  }

  static DynamicUnitSquareLeftBottonOnZeroForFont(gl: WebGL2RenderingContext) {
    // should be cached?
    if (dynamicUnitSquareLeftBottonOnZeroForFont === undefined) {
      const vertices = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      dynamicUnitSquareLeftBottonOnZeroForFont = new VertexBuffer(gl);
      dynamicUnitSquareLeftBottonOnZeroForFont.initDynamicBuffer(vertices);
    }

    return dynamicUnitSquareLeftBottonOnZeroForFont;
  }

  initStaticBuffer(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
  }

  initDynamicBuffer(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.DYNAMIC_DRAW
    );
  }

  setTextureCoordinate(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
  }

  // this should be calledn when removing vertex buffer completely from webgl
  private unload() {
    if (this.vertexBuffer !== null) {
      this.gl.deleteBuffer(this.vertexBuffer);
    }
  }
}
