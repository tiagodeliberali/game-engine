import { ShaderLib, TextureShader, Camera, Color } from "../graphics";
import { getResourceManager, Texture } from "../resources";
import { AbstractRenderable } from "./AbstractRenderable";

export class TextureRenderable extends AbstractRenderable<TextureShader> {
  texture: Texture | undefined;
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
      [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0],
      [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    );
    this.texture = getResourceManager().get<Texture>(this.texturePath);
  }

  update() {
    //
  }

  draw(camera: Camera) {
    this.texture!.activate();
    this.shader!.draw(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
  }
}
