import { Color } from "./Color";
import { getSpriteShader } from "./ShaderLib";
import { Camera } from "./Camera";
import { Texture } from "../resources";
import { IRenderable } from "./IRenderable";
import { TextureShader } from "./TextureShader";
import { getGL } from "../GL";
import { VertexBuffer } from "./VertexBuffer";
import { Transform } from "./Transform";
import { Box } from "../DataStructures";

export class SpriteRenderable implements IRenderable {
  gl: WebGL2RenderingContext;
  shader: TextureShader;
  vertexBuffer: VertexBuffer;
  textureVertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;
  texture: Texture;

  constructor(texture: Texture, spritePosition: Box) {
    this.gl = getGL();
    this.vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(this.gl);
    this.trsMatrix = new Transform();
    this.color = Color.Transparent();
    this.shader = getSpriteShader(this.gl);
    this.texture = texture;

    if (!spritePosition.isNormalized()) {
      spritePosition.normalize(texture.width, texture.height);
    }

    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );
    this.textureVertexBuffer.setTextureCoordinate(
      spritePosition.getElementUVCoordinateArray()
    );
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
