import { ShaderLib } from "./graphics";
import { initKeyboard, updateKeyboard } from "./input";
import { initLoop, stopLoop } from "./Loop";
import { FontRenderable } from "./renderable";
import { getResourceManager } from "./resources";
import { AbstractScene } from "./scene";

const resourceManager = getResourceManager();

export class GameEngine {
  currentScene: AbstractScene;

  constructor(scene: AbstractScene) {
    this.currentScene = scene;
    this.currentScene.registerGameEngine(this);
  }

  public async startGame() {
    ShaderLib.loadShaderLib();
    initKeyboard();
    FontRenderable.load();
    await this.startScene();
  }

  private async startScene() {
    this.currentScene.load();
    await resourceManager.waitOnLoading();

    this.currentScene.init();

    initLoop(
      () => this.drawLoop(),
      () => this.updateLoop()
    );
  }

  private drawLoop() {
    this.currentScene!.draw && this.currentScene!.draw();
    updateKeyboard();
  }

  private updateLoop() {
    this.currentScene!.update && this.currentScene!.update();
  }

  public async changeScene(scene: AbstractScene) {
    stopLoop();
    resourceManager.unloadScene();
    this.currentScene.unload();

    this.currentScene = scene;
    this.currentScene.registerGameEngine(this);

    await this.startScene();
  }
}
