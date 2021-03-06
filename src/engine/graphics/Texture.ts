import { getGL } from "..";
import { Box } from "../DataStructures";
import { EngineError } from "../EngineError";

export class Texture {
  private gl: WebGL2RenderingContext;
  private textureId: WebGLTexture;
  width: number;
  height: number;

  constructor(image: HTMLImageElement) {
    this.gl = getGL();
    const id = this.gl.createTexture();

    if (id === null) {
      throw new EngineError(Texture.name, "Failed to load texture id");
    }

    this.textureId = id;
    this.width = image.naturalWidth;
    this.height = image.naturalHeight;
    this.init(image);
  }

  private init(image: HTMLImageElement) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureId);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );
    this.setFilters();

    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  private setFilters() {
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
  }

  activate(location: WebGLUniformLocation) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureId);
    this.gl.uniform1i(location, 0);
  }

  deactivate() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  unload() {
    this.gl.deleteTexture(this.textureId);
  }

  getSpritePositionAsArray(
    rows: number,
    columns: number,
    selectedRow: number,
    selectedColumn: number
  ): Box {
    const boxWidth = this.width / columns;
    const boxHeight = this.height / rows;

    // invert rows to make it more easy to reason about
    const invertedRow = rows - selectedRow - 1;

    return new Box(
      boxHeight * (1 + invertedRow),
      boxHeight * invertedRow,
      boxWidth * (1 + selectedColumn),
      boxWidth * selectedColumn
    );
  }

  getSpritePositionLinear(
    rows: number,
    columns: number,
    position: number
  ): Box {
    if (position > rows * columns) {
      throw new EngineError(
        Texture.name,
        `Max position value is ${
          rows * columns - 1
        } but it was supplied ${position}.`
      );
    }

    let currentPosition = position;
    let selectedRow = 0;
    let selectedColumn = 0;

    while (currentPosition >= columns) {
      currentPosition -= columns;
      selectedRow++;
    }

    selectedColumn = currentPosition;

    return this.getSpritePositionAsArray(
      rows,
      columns,
      selectedRow,
      selectedColumn
    );
  }
}
