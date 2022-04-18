import {
  ShaderLib,
  TextureShader,
  VertexBuffer,
  Camera,
  Color,
} from "../graphics";
import { getResourceManager, Texture } from "../resources";
import { getGL } from "../GL";
import { AbstractRenderable } from "./AbstractRenderable";

export class TextureRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture | undefined;
  texturePath: string;

  constructor(texturePath: string) {
    const gl = getGL();
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, vertexBuffer);

    this.color = Color.Transparent();
    this.textureVertexBuffer = VertexBuffer.UnitSquareLeftBottonOnZero(this.gl);
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
