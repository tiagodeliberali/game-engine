import { Color, EngineError } from "..";
import { DrawingResources } from "../core";
import { ShaderLib, TextureShader, Texture } from "../graphics";
import { getResourceManager } from "../resources";
import { AbstractRenderable } from "./AbstractRenderable";

export class TextureRenderable extends AbstractRenderable<TextureShader> {
  texturePath: string;

  constructor(texturePath: string) {
    super();

    this.color = Color.Transparent();
    this.texturePath = texturePath;
  }

  static build(texturePath: string) {
    return new TextureRenderable(texturePath);
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.shader = ShaderLib.getTextureShader();
    this.shader.initBuffers(
      getResourceManager().get<Texture>(this.texturePath),
      [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0],
      [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    );
  }

  update() {
    //
  }

  draw(resources: DrawingResources) {
    if (this.shader === undefined) {
      throw new EngineError(
        TextureRenderable.name,
        "Cannot run draw with undefined shader"
      );
    }

    if (resources.lights.length > 0) {
      this.shader.setCameraAndLight(resources.camera, resources.lights[0]);
    }

    this.shader.draw(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      resources.camera.getCameraMatrix()
    );
  }
}
