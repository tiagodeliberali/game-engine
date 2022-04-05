import { initShaderLib } from "./graphics/ShaderLib";
import { initKeyboard } from "./input/Keyboard";
import { startLoop } from "./Loop";
import { GetResourceManager } from "./resources";
import { SceneDef } from "./Scene";

const resourceManager = GetResourceManager();

export class GameEngine {
  currentScene: SceneDef;

  constructor(scene: SceneDef) {
    this.currentScene = scene;
  }

  public async start() {
    initShaderLib();
    initKeyboard();
    await resourceManager.waitOnPromises();
    startLoop(this.currentScene);
  }
}
