import { EngineError } from "./EngineError";
import { initShaderLib } from "./graphics/ShaderLib";
import { initKeyboard } from "./input/Keyboard";
import { startLoop, stopLoop } from "./Loop";
import { GetResourceManager } from "./resources";
import { AbstractScene } from "./scene";

const resourceManager = GetResourceManager();

export class GameEngine {
  currentScene: AbstractScene | undefined;

  constructor(scene: AbstractScene) {
    this.registerScene(scene);
  }

  public async startGame() {
    if (this.currentScene === undefined) {
      throw new EngineError(GameEngine.name, "Scene not defined.");
    }

    initShaderLib();
    initKeyboard();

    // load global resources alredy registered
    await resourceManager.waitOnPromises();

    await this.initScene();
  }

  private registerScene(scene: AbstractScene) {
    this.currentScene = scene;
    this.currentScene.registerGameEngine(this);
  }

  private async initScene() {
    if (
      this.currentScene !== undefined &&
      this.currentScene.init !== undefined
    ) {
      this.currentScene.init();
    }

    // load resources added by the scene
    await resourceManager.waitOnPromises();

    startLoop(this.currentScene!);
  }

  public async loadScene(scene: AbstractScene) {
    stopLoop();
    resourceManager.unloadScene();
    this.registerScene(scene);
    await this.initScene();
  }
}
