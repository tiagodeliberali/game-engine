import { getResourceManager } from "../resources";
import { SimpleShader, TextureShader, SpriteShader } from ".";

const simpleVertexPath = "/shaders/simple_vs.glsl";
const simpleFragmentPath = "/shaders/simple_fs.glsl";

const textureVertexPath = "/shaders/texture_vs.glsl";
const textureFragmentPath = "/shaders/texture_fs.glsl";

const resourceManager = getResourceManager();
let constColorShader: SimpleShader | undefined;
let textureShader: TextureShader | undefined;
let spriteShader: SpriteShader | undefined;

export class ShaderLib {
  static loadShaderLib() {
    resourceManager.loadGlobal(simpleVertexPath);
    resourceManager.loadGlobal(simpleFragmentPath);

    resourceManager.loadGlobal(textureVertexPath);
    resourceManager.loadGlobal(textureFragmentPath);
  }

  static getConstColorShader(gl: WebGL2RenderingContext): SimpleShader {
    if (constColorShader === undefined) {
      constColorShader = new SimpleShader(
        gl,
        resourceManager.get<string>(simpleVertexPath),
        resourceManager.get<string>(simpleFragmentPath)
      );
    }

    return constColorShader;
  }

  static getTextureShader(gl: WebGL2RenderingContext): TextureShader {
    if (textureShader === undefined) {
      textureShader = new TextureShader(
        gl,
        resourceManager.get<string>(textureVertexPath),
        resourceManager.get<string>(textureFragmentPath)
      );
    }

    return textureShader;
  }

  static getSpriteShader(gl: WebGL2RenderingContext): SpriteShader {
    if (spriteShader === undefined) {
      spriteShader = new SpriteShader(
        gl,
        resourceManager.get<string>(textureVertexPath),
        resourceManager.get<string>(textureFragmentPath)
      );
    }

    return spriteShader;
  }
}
