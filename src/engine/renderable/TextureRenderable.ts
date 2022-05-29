import { Color } from "..";
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

  draw(resources: DrawingResources) {
    if (
      this.forceDraw ||
      resources.camera.isVisibleOnWC(this.getTransform().getPosition())
    )
      this.getActivatedShader(resources).drawSquare();
  }
}
