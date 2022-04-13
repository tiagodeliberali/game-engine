import {
  ShaderLib,
  Camera,
  TextureShader,
  VertexBuffer,
  Color,
} from "../graphics";
import { Texture } from "../resources";
import { getGL } from "../GL";
import { Box } from "../DataStructures";
import { getResourceManager } from "../resources";
import { AbstractRenderable } from "./AbstractRenderable";

export const defaultFontPath = "/textures/default_font.png";

export class FontRenderable extends AbstractRenderable<TextureShader> {
  textureVertexBuffer: VertexBuffer;
  texture: Texture | undefined;
  rows: number;
  columns: number;
  text: string;

  private constructor(rows: number, columns: number, text: string) {
    const gl = getGL();
    const vertexBuffer = VertexBuffer.UnitSquareCenteredOnZero(gl);

    super(gl, vertexBuffer);

    this.color = Color.Transparent();
    this.rows = rows;
    this.columns = columns;
    this.text = text;

    this.textureVertexBuffer = VertexBuffer.DynamicUnitSquareLeftBottonOnZero(
      this.gl
    );
  }

  load() {
    getResourceManager().loadGlobal(defaultFontPath);
  }

  init() {
    this.shader = ShaderLib.getSpriteShader(this.gl);
    this.texture = getResourceManager().get<Texture>(defaultFontPath);
  }

  update() {
    //
  }

  public static getDefaultFont(initialText: string) {
    return new FontRenderable(8, 12, initialText);
  }

  public setText(text: string) {
    this.text = text;
  }

  public setSpritePosition(spritePosition: Box) {
    if (!spritePosition.isNormalized()) {
      spritePosition.normalize(this.texture!.width, this.texture!.height);
    }

    this.textureVertexBuffer.setTextureCoordinate(
      spritePosition.getElementUVCoordinateArray()
    );
  }

  public draw(camera: Camera) {
    this.texture!.activate();
    const initialTrsPosition = this.trsMatrix.getHorizontalPosition();

    this.text.split("").forEach((character) => {
      const charCode = character.charCodeAt(0);
      const position = charCode - 33;
      this.setSpritePosition(
        this.texture!.getSpritePositionLinear(this.rows, this.columns, position)
      );

      this.shader!.activate(
        this.vertexBuffer,
        this.textureVertexBuffer,
        this.color,
        this.trsMatrix.getTrsMatrix(),
        camera.getCameraMatrix()
      );
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      this.trsMatrix.addToHorizontalPosition(
        this.trsMatrix.getHorizontalScale()
      );
    });

    this.trsMatrix.setHorizontalPosition(initialTrsPosition);
  }
}
