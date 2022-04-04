import { initKeyboard } from "./input/Keyboard";
import { startLoop } from "./Loop";
import { SceneDef } from "./Scene";

export class GameEngine {
  currentScene: SceneDef;

  constructor(scene: SceneDef) {
    this.currentScene = scene;
  }

  start() {
    initKeyboard();
    startLoop(this.currentScene);
  }
}
