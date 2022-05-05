import { SimpleShader, ShaderLib } from "../graphics";
import { AbstractRenderable } from "./AbstractRenderable";
import { DrawingResources } from "../core";

export class LineRenderableFormats {
  static box() {
    return [
      0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0, -0.5, 0.5, 0.0, 0.5, 0.5,
      0.0,
    ];
  }

  static circle(points: number) {
    const result: number[] = [];

    const deltaTheta = (Math.PI * 2.0) / points;
    let theta = deltaTheta;

    for (let i = 1; i <= points; i++) {
      result.push(Math.cos(theta), Math.sin(theta), 0);
      theta += deltaTheta;
    }

    result.push(result[0], result[1], 0);

    return result;
  }
}

export class LineRenderable extends AbstractRenderable<SimpleShader> {
  vertices: number[];

  constructor(vertices: number[]) {
    super();
    this.vertices = vertices;
  }

  static build(vertices: number[]) {
    return new LineRenderable(vertices);
  }

  updateVertices(vertices: number[]) {
    this.vertices = vertices;
    if (this.shader !== undefined) {
      this.shader.initBuffer(this.vertices);
    }
  }

  load() {
    //
  }

  init() {
    this.shader = ShaderLib.getConstColorShader();
    this.shader.initBuffer(this.vertices);
  }

  update() {
    //
  }

  draw(resources: DrawingResources) {
    this.getActivatedShader(resources).drawLines(this.vertices.length / 3);
  }
}
