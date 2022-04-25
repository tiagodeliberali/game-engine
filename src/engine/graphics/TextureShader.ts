import { mat4 } from "gl-matrix";
import { Texture, VertexBuffer } from ".";
import { Color } from "..";
import { EngineError } from "../EngineError";
import { AbstractShader } from "./AbstractShader";

export class TextureShader extends AbstractShader {
  private texture: Texture | undefined;
  private vertexPositionBuffer: VertexBuffer;
  private pixelColorLocation: WebGLUniformLocation;
  private modelMatrixLocation: WebGLUniformLocation;
  private cameraXformMatrix: WebGLUniformLocation;
  private textureCoordinateBuffer: VertexBuffer;
  private samplerLocation: WebGLUniformLocation;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(vertexShaderSource, fragmentShaderSource);

    this.vertexPositionBuffer = new VertexBuffer(
      this.getAttribLocation("aVertexPosition"),
      3
    );

    this.textureCoordinateBuffer = new VertexBuffer(
      this.getAttribLocation("aTextureCoordinate"),
      2
    );

    this.pixelColorLocation = this.getUniformLocation("uPixelColor");
    this.modelMatrixLocation = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrix = this.getUniformLocation("uCameraXformMatrix");

    this.samplerLocation = this.getUniformLocation("uSampler");
  }

  initBuffers(
    texture: Texture,
    positionVertices: number[],
    textureVertices: number[]
  ) {
    this.texture = texture;
    this.vertexPositionBuffer.initVertexArray();
    this.vertexPositionBuffer.initBuffer(positionVertices, this.gl.STATIC_DRAW);
    this.textureCoordinateBuffer.initBuffer(
      textureVertices,
      this.gl.STATIC_DRAW
    );
    this.vertexPositionBuffer.clearVertexArray();
  }

  setSpritePosition(rows: number, columns: number, position: number) {
    this.setTextureCoordinate(
      this.getSpritePosition(
        rows,
        columns,
        position
      ).getElementUVCoordinateArray()
    );
  }

  private getSpritePosition(rows: number, columns: number, position: number) {
    if (this.texture === undefined) {
      throw new EngineError(
        TextureShader.name,
        "Trying to getSpritePosition with undefined texture"
      );
    }

    let spritePosition = this.texture.getSpritePositionLinear(
      rows,
      columns,
      position
    );

    if (!spritePosition.isNormalized()) {
      spritePosition = spritePosition.normalize(
        this.texture.width,
        this.texture.height
      );
    }

    return spritePosition;
  }

  setSpriteByRowColumn(
    rows: number,
    columns: number,
    row: number,
    column: number
  ) {
    this.setTextureCoordinate(
      this.getSpritePositionByRowColumn(
        rows,
        columns,
        row,
        column
      ).getElementUVCoordinateArray()
    );
  }

  private getSpritePositionByRowColumn(
    rows: number,
    columns: number,
    row: number,
    column: number
  ) {
    if (this.texture === undefined) {
      throw new EngineError(
        TextureShader.name,
        "Trying to getSpritePosition with undefined texture"
      );
    }

    let spritePosition = this.texture.getSpritePositionAsArray(
      rows,
      columns,
      row,
      column
    );

    if (!spritePosition.isNormalized()) {
      spritePosition = spritePosition.normalize(
        this.texture.width,
        this.texture.height
      );
    }

    return spritePosition;
  }

  private setTextureCoordinate(vertices: number[]) {
    this.textureCoordinateBuffer.setTextureCoordinate(vertices);
  }

  draw(pixelColor: Color, trsMatrix: mat4, cameraMatrix: mat4) {
    this.gl.useProgram(this.program);

    this.gl.uniform4fv(
      this.pixelColorLocation,
      pixelColor.getNormalizedArray()
    );
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, trsMatrix);
    this.gl.uniformMatrix4fv(this.cameraXformMatrix, false, cameraMatrix);

    this.texture?.activate(this.samplerLocation);

    this.vertexPositionBuffer.activate();
    this.vertexPositionBuffer.drawSquare();
  }
}
