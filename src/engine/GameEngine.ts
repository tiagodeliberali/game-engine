import { start } from "./Loop";
import { SceneDef } from "./Scene";

export class GameEngine {
  currentScene: SceneDef;

  constructor(scene: SceneDef) {
    this.currentScene = scene;
  }

  start() {
    start(this.currentScene);
  }
}
