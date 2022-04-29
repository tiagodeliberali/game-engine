import { ShaderLib } from "./graphics";
import { initKeyboard, initMouse, updateKeyboard, updateMouse } from "./input";
import { initLoop, stopLoop } from "./Loop";
import { getResourceManager } from "./resources";
import { AbstractScene } from "./scene";

const resourceManager = getResourceManager();

export class GameEngine {
  currentScene: AbstractScene;

  constructor(scene: AbstractScene) {
    this.currentScene = scene;
    this.currentScene.registerGameEngine(this);
  }

  async startGame() {
    ShaderLib.loadShaderLib();
    initKeyboard();
    initMouse();
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
    this.currentScene.draw();
    updateKeyboard();
    updateMouse();
  }

  private updateLoop() {
    this.currentScene.update();
  }

  async changeScene(scene: AbstractScene) {
    stopLoop();
    resourceManager.unloadScene();
    this.currentScene.unload();

    this.currentScene = scene;
    this.currentScene.registerGameEngine(this);

    await this.startScene();
  }
}
