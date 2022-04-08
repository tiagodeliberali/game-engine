import { EngineError } from "../EngineError";
import { GameEngine } from "../GameEngine";
import { getResourceManager } from "../resources";

export abstract class AbstractScene {
  private gameEngine: GameEngine | undefined;

  registerGameEngine(engine: GameEngine) {
    this.gameEngine = engine;
  }

  goToScene(scene: AbstractScene) {
    if (this.gameEngine === undefined) {
      throw new EngineError(AbstractScene.name, "No game engine registered");
    }

    this.gameEngine.changeScene(scene);
  }

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource(path: string) {
    return getResourceManager().get(path);
  }

  load() {
    // time to load all resources with resource manager
  }

  init() {
    // all one time actions that should be executed in the begining of the scene
  }

  draw() {
    // draw stuff every loop iteration
  }

  update() {
    // update stuff every loop iteration
  }

  unload() {
    // unload all objects
  }
}
