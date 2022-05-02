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
    this.getActivatedShader(resources).drawSquare();
  }
}
