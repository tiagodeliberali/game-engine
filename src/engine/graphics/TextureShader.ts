import { Light, Texture, VertexBuffer } from ".";
import { Camera } from "../core";
import { EngineError } from "../EngineError";
import { AbstractShader } from "./AbstractShader";

export class TextureShader extends AbstractShader {
  private texture: Texture | undefined;
  private textureCoordinateBuffer: VertexBuffer;
  private samplerLocation: WebGLUniformLocation;

  private light: Light | undefined;
  private camera: Camera | undefined;

  lightColorLocation: WebGLUniformLocation;
  lightPositionLocation: WebGLUniformLocation;
  lightRadiusLocation: WebGLUniformLocation;
  lightIsOnLocation: WebGLUniformLocation;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    super(vertexShaderSource, fragmentShaderSource);

    this.textureCoordinateBuffer = new VertexBuffer(
      this.getAttribLocation("aTextureCoordinate"),
      2
    );
    this.samplerLocation = this.getUniformLocation("uSampler");

    this.lightColorLocation = this.getUniformLocation("uLightColor");
    this.lightPositionLocation = this.getUniformLocation("uLightPosition");
    this.lightRadiusLocation = this.getUniformLocation("uLightRadius");
    this.lightIsOnLocation = this.getUniformLocation("uLightOn");
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

  setCameraAndLight(camera: Camera, light: Light) {
    this.camera = camera;
    this.light = light;
  }

  drawExtension(): void {
    if (this.light !== null) {
      this.loadLightInformation();
    } else {
      this.gl.uniform1i(this.lightIsOnLocation, 0); // switch off light!
    }

    this.texture?.activate(this.samplerLocation);
  }

  loadLightInformation() {
    if (this.light === undefined || this.camera == undefined) {
      return;
    }

    this.gl.uniform1i(this.lightIsOnLocation, this.light.isOn ? 1 : 0);

    if (this.light.isOn) {
      this.gl.uniform4fv(
        this.lightColorLocation,
        this.light.color.getNormalizedArray()
      );

      const lightPosition = this.camera.convertWCtoDC(this.light.position);
      this.gl.uniform3fv(this.lightPositionLocation, lightPosition.toVec3());

      const radius = this.light.radius * this.camera.getPixelsPerWCunits().x;
      this.gl.uniform1f(this.lightRadiusLocation, radius);
    }
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
