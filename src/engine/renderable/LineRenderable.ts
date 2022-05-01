import { EngineError } from "../EngineError";
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
    if (this.shader === undefined) {
      throw new EngineError(
        LineRenderable.name,
        "Cannot run draw with undefined shader"
      );
    }

    this.shader.setCameraAndLight(resources.camera, resources.lights);

    this.shader.activate(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      resources.camera.getCameraMatrix()
    );
    this.shader.drawLines(this.vertices.length / 3);
  }
}
