import { SimpleShader } from "./SimpleShader";
import { TextureShader } from "./TextureShader";
import { SpriteShader } from "./SpriteShader";
import { getResourceManager } from "../resources";

const simpleVertexPath = "/shaders/simple_vs.glsl";
const simpleFragmentPath = "/shaders/simple_fs.glsl";

const textureVertexPath = "/shaders/texture_vs.glsl";
const textureFragmentPath = "/shaders/texture_fs.glsl";

const resourceManager = getResourceManager();

export function loadShaderLib() {
  resourceManager.loadGlobal(simpleVertexPath);
  resourceManager.loadGlobal(simpleFragmentPath);

  resourceManager.loadGlobal(textureVertexPath);
  resourceManager.loadGlobal(textureFragmentPath);
}

let constColorShader: SimpleShader | undefined;

export function getConstColorShader(gl: WebGL2RenderingContext): SimpleShader {
  if (constColorShader === undefined) {
    constColorShader = new SimpleShader(
      gl,
      resourceManager.get(simpleVertexPath) as string,
      resourceManager.get(simpleFragmentPath) as string
    );
  }

  return constColorShader;
}

let textureShader: TextureShader | undefined;

export function getTextureShader(gl: WebGL2RenderingContext): TextureShader {
  if (textureShader === undefined) {
    textureShader = new TextureShader(
      gl,
      resourceManager.get(textureVertexPath) as string,
      resourceManager.get(textureFragmentPath) as string
    );
  }

  return textureShader;
}

let spriteShader: SpriteShader | undefined;

export function getSpriteShader(gl: WebGL2RenderingContext): SpriteShader {
  if (spriteShader === undefined) {
    spriteShader = new SpriteShader(
      gl,
      resourceManager.get(textureVertexPath) as string,
      resourceManager.get(textureFragmentPath) as string
    );
  }

  return spriteShader;
}
