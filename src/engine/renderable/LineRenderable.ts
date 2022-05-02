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
