import { EngineError } from "../EngineError";
import { SimpleShader, ShaderLib } from "../graphics";
import { AbstractRenderable } from "./AbstractRenderable";
import { DrawingResources } from "../core";

export class Renderable extends AbstractRenderable<SimpleShader> {
  constructor() {
    super();
  }

  static build() {
    return new Renderable();
  }

  load() {
    //
  }

  init() {
    this.shader = ShaderLib.getConstColorShader();
    this.shader.initBuffer([
      0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
    ]);
  }

  update() {
    //
  }

  draw(resources: DrawingResources) {
    if (this.shader === undefined) {
      throw new EngineError(
        Renderable.name,
        "Cannot run draw with undefined shader"
      );
    }

    this.shader.setCameraAndLight(resources.camera, resources.lights);

    this.shader.draw(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      resources.camera.getCameraMatrix()
    );
  }
}
