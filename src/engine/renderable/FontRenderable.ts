import { ShaderLib, TextureShader, Texture } from "../graphics";
import { Color } from "..";
import { Vec2d } from "../DataStructures";
import { getResourceManager } from "../resources";
import { AbstractRenderable } from "./AbstractRenderable";
import { DrawingResources } from "../core";

export const defaultFontPath = "/textures/default_font.png";

export class FontRenderable extends AbstractRenderable<TextureShader> {
  rows: number;
  columns: number;
  text: string;

  private constructor(rows: number, columns: number, text: string) {
    super();

    this.color = Color.Transparent();
    this.rows = rows;
    this.columns = columns;
    this.text = text;
  }

  static getDefaultFont(initialText: string) {
    return new FontRenderable(8, 12, initialText);
  }

  setText(text: string) {
    this.text = text;
  }

  load() {
    getResourceManager().loadGlobal(defaultFontPath);
  }

  init() {
    this.shader = ShaderLib.getTextureShader();
    this.shader.initBuffers(
      getResourceManager().get<Texture>(defaultFontPath),
      [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0],
      [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    );
  }

  update() {
    //
  }

  draw(resources: DrawingResources) {
    const initialTrsPosition = this.trsMatrix.getPosition().x;

    if (this.shader === undefined) {
      return;
    }

    const shader = this.shader;

    this.text.split("").forEach((character) => {
      const charCode = character.charCodeAt(0);
      const position = charCode - 33;

      shader.setSpritePosition(this.rows, this.columns, position);
      this.getActivatedShader(resources).drawSquare();

      this.addToPosition(new Vec2d(this.trsMatrix.getHorizontalScale(), 0));
    });

    this.setTransform({
      position: new Vec2d(initialTrsPosition, this.trsMatrix.getPosition().y),
    });
  }
}
