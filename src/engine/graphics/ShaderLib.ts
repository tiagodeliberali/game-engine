import { getResourceManager } from "../resources";
import { SimpleShader, TextureShader } from ".";

const simpleVertexPath = "/shaders/simple_vs.glsl";
const simpleFragmentPath = "/shaders/simple_fs.glsl";

const textureVertexPath = "/shaders/texture_vs.glsl";
const textureFragmentPath = "/shaders/texture_fs.glsl";

const resourceManager = getResourceManager();

export class ShaderLib {
  static loadShaderLib() {
    resourceManager.loadGlobal(simpleVertexPath);
    resourceManager.loadGlobal(simpleFragmentPath);

    resourceManager.loadGlobal(textureVertexPath);
    resourceManager.loadGlobal(textureFragmentPath);
  }

  static getConstColorShader(): SimpleShader {
    return new SimpleShader(
      resourceManager.get<string>(simpleVertexPath),
      resourceManager.get<string>(simpleFragmentPath)
    );
  }

  static getTextureShader(): TextureShader {
    return new TextureShader(
      resourceManager.get<string>(textureVertexPath),
      resourceManager.get<string>(textureFragmentPath)
    );
  }
}
