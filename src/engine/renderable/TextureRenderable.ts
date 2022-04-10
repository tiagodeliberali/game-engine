import { Color } from "../graphics/Color";
import { getTextureShader } from "../graphics/ShaderLib";
import { Camera } from "../graphics/Camera";
import { Texture } from "../resources";
import { IRenderable } from "./IRenderable";
import { TextureShader } from "../graphics/TextureShader";
import { getGL } from "../GL";
import { VertexBuffer } from "../graphics/VertexBuffer";
import { Transform } from "../graphics/Transform";

export class TextureRenderable implements IRenderable {
  gl: WebGL2RenderingContext;
  shader: TextureShader;
  vertexBuffer: VertexBuffer;
  textureVertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;
  texture: Texture;

  constructor(texture: Texture) {
    this.gl = getGL();
    this.vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(this.gl);
    this.textureVertexBuffer = VertexBuffer.UnitSquareLeftBottonOnZero(this.gl);
    this.trsMatrix = new Transform();

    this.color = Color.Transparent();
    this.shader = getTextureShader(this.gl);
    this.texture = texture;
  }

  public draw(camera: Camera) {
    this.texture.activate();
    this.shader.activate(
      this.vertexBuffer,
      this.textureVertexBuffer,
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  public getTransform() {
    return this.trsMatrix;
  }

  public unload() {
    //
  }
}
