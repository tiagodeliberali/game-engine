import {
  ShaderLib,
  TextureShader,
  VertexBuffer,
  VertexBufferLib,
  Camera,
  Color,
} from "../graphics";
import { getResourceManager, Texture } from "../resources";
import { AbstractRenderable } from "./AbstractRenderable";

export class TextureRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture | undefined;
  texturePath: string;

  constructor(texturePath: string) {
    const vertexBuffer = VertexBufferLib.UnitSquareCenteredOnZero();

    super(vertexBuffer);

    this.color = Color.Transparent();
    this.textureVertexBuffer = VertexBufferLib.UnitSquareLeftBottonOnZero();
    this.texturePath = texturePath;
  }

  static build(texturePath: string) {
    return new TextureRenderable(texturePath);
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.shader = ShaderLib.getTextureShader(this.gl);
    this.texture = getResourceManager().get<Texture>(this.texturePath);
  }

  update() {
    //
  }

  draw(camera: Camera) {
    this.texture!.activate();
    this.shader!.activate(
      this.vertexBuffer,
      this.textureVertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
