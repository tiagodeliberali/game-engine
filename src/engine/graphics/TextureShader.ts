import { getMaxLightSourceNumber, Light, Texture, VertexBuffer } from ".";
import { Camera } from "../core";
import { EngineError } from "../EngineError";
import { AbstractShader } from "./AbstractShader";
import { ShaderLightInfo } from "./ShaderLightInfo";

export class TextureShader extends AbstractShader {
  private texture: Texture | undefined;
  private textureCoordinateBuffer: VertexBuffer;
  private samplerLocation: WebGLUniformLocation;

  private lights: Light[] = [];
  private camera: Camera | undefined;

  shaderLightInfoList: ShaderLightInfo[] = [];

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(
      vertexShaderSource,
      fragmentShaderSource.replace(
        "#LIGHT_ARRAY_SIZE",
        getMaxLightSourceNumber().toString()
      )
    );

    this.textureCoordinateBuffer = new VertexBuffer(
      this.getAttribLocation("aTextureCoordinate"),
      2
    );
    this.samplerLocation = this.getUniformLocation("uSampler");

    for (let i = 0; i < getMaxLightSourceNumber(); i++) {
      const info = new ShaderLightInfo(this, i);
      this.shaderLightInfoList.push(info);
    }
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

  setCameraAndLight(camera: Camera, light: Light[]) {
    this.camera = camera;
    this.lights = light;
  }

  drawExtension(): void {
    if (this.camera !== undefined) {
      for (let i = 0; i < this.lights.length; i++) {
        this.shaderLightInfoList[i].loadToShader(this.camera, this.lights[i]);
      }
      for (
        let i = this.lights.length;
        i < this.shaderLightInfoList.length;
        i++
      ) {
        this.shaderLightInfoList[i].switchOffLight();
      }
    } else {
      // turn off all lights
      for (let i = 0; i < this.shaderLightInfoList.length; i++) {
        this.shaderLightInfoList[i].switchOffLight();
      }
    }

    this.texture?.activate(this.samplerLocation);
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
}
