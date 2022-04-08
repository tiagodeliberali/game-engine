import { EngineError } from "../EngineError";

export class Texture {
  gl: WebGL2RenderingContext;
  width: number;
  height: number;
  textureId: WebGLTexture;

  constructor(gl: WebGL2RenderingContext, image: HTMLImageElement) {
    this.gl = gl;
    const id = this.gl.createTexture();

    if (id === null) {
      throw new EngineError(Texture.name, "Failed to load texture id");
    }

    this.textureId = id;
    this.width = image.naturalWidth;
    this.height = image.naturalHeight;
    this.init(image);
  }

  init(image: HTMLImageElement) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureId);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  activate() {
    // Binds texture reference to the current webGL texture functionality
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureId);
    // To prevent texture wrapping
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
    // Handles how magnification and minimization filters will work.
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR_MIPMAP_LINEAR
    );
    // For the texture to look "sharp" do the following:
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
  }

  deactivate() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  unload() {
    this.gl.deleteTexture(this.textureId);
  }
}
