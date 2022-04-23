import { ITransformable } from "..";
import { BoundingBox, GameObject } from "../behaviors";
import { EngineError } from "../EngineError";
import { GameEngine } from "../GameEngine";
import { getResourceManager } from "../resources";

export abstract class AbstractScene {
  private gameEngine: GameEngine | undefined;
  private boundingBoxList: BoundingBox[] = [];
  private colisionList: ITransformable[] = [];
  protected gameObjects: GameObject;

  constructor() {
    this.gameObjects = new GameObject();
  }

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

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
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
    this.processBoudingBoxes();
  }

  unload() {
    // unload all objects
  }

  processBoudingBoxes() {
    this.boundingBoxList = this.boundingBoxList.concat(
      this.gameObjects.popBoundingBoxes()
    );

    if (this.boundingBoxList.length === 0) {
      return;
    }

    const actionableBoudingBoxes = this.boundingBoxList.filter((x) =>
      x.hasAction()
    );

    if (actionableBoudingBoxes.length === 0) {
      return;
    }

    const nonActionableBoudingBoxes = this.boundingBoxList.filter(
      (x) => !x.hasAction()
    );

    actionableBoudingBoxes.forEach((actionable) => {
      nonActionableBoudingBoxes.forEach((nonActinable) => {
        this.executeActions(actionable, nonActinable);
      });
    });
  }

  private executeActions(origin: BoundingBox, target: BoundingBox) {
    if (origin.actions === undefined) {
      return;
    }

    if (target.intersectsBound(origin)) {
      if (!this.colisionList.includes(target.owner)) {
        this.colisionList.push(target.owner);

        origin.actions.onCollideStarted &&
          origin.actions.onCollideStarted(
            target.owner,
            target.tag,
            origin.boundCollideStatus(target)
          );
      }

      origin.actions.onColliding &&
        origin.actions.onColliding(target.owner, target.tag);
    } else {
      if (this.colisionList.includes(target.owner)) {
        const index = this.colisionList.indexOf(target.owner, 0);
        if (index > -1) {
          this.colisionList.splice(index, 1);
        }

        origin.actions.onCollideEnded &&
          origin.actions.onCollideEnded(target.owner, target.tag);
      }
    }
  }
}
