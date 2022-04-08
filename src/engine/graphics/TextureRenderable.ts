import { Color } from "./Color";
import { Renderable } from "./Renderable";
import { getTextureShader } from "./ShaderLib";
import { Camera } from "./Camera";
import { Texture } from "../resources";

export class TextureRenderable extends Renderable {
  texture: Texture;

  constructor(texture: Texture) {
    super();
    this.color = Color.Transparent();
    this.shader = getTextureShader(this.gl);
    this.texture = texture;
  }

  draw(camera: Camera) {
    this.texture.activate();
    super.draw(camera);
  }
}
