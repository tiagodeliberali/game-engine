import { SimpleShader } from "./SimpleShader";
import { GetResourceManager } from "../resources";

const vertexPath = "/shaders/simple_vs.glsl";
const fragmentPath = "/shaders/simple_fs.glsl";
const resourceManager = GetResourceManager();

export function initShaderLib() {
  resourceManager.loadText(vertexPath);
  resourceManager.loadText(fragmentPath);
}

let constColorShader: SimpleShader | undefined;

export function getConstColorShader(gl: WebGL2RenderingContext): SimpleShader {
  if (constColorShader === undefined) {
    constColorShader = new SimpleShader(
      gl,
      resourceManager.get(vertexPath),
      resourceManager.get(fragmentPath)
    );
  }

  return constColorShader;
}
