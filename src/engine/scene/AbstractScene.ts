import { EngineError } from "../EngineError";
import { GameEngine } from "../GameEngine";

export abstract class AbstractScene {
  private gameEngine: GameEngine | undefined;

  registerGameEngine(engine: GameEngine) {
    this.gameEngine = engine;
  }

  loadScene(scene: AbstractScene) {
    if (this.gameEngine === undefined) {
      throw new EngineError(AbstractScene.name, "No game engine registered");
    }

    this.gameEngine.loadScene(scene);
  }

  init() {
    // virtual method.
  }

  draw() {
    // virtual method.
  }

  update() {
    // virtual method.
  }
}
