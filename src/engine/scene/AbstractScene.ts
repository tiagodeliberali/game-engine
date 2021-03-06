import { Camera, IComponent, ITransformable } from "..";
import { BoundingBox, GameObject } from "../behaviors";
import { DrawingResources } from "../core";
import { EngineError } from "../EngineError";
import { GameEngine } from "../GameEngine";
import { Light, setMaxLightSourceNumber } from "../graphics";
import {
  PhysicsEngine,
  RigidCircle,
  RigidRectangle,
  RigidShape,
} from "../physics";
import { getResourceManager } from "../resources";

export abstract class AbstractScene {
  private gameEngine: GameEngine | undefined;
  private boundingBoxes: BoundingBox[] = [];
  private lights: Light[] = [];
  private colisionList: ITransformable[] = [];
  protected gameObjects: GameObject;
  protected cameras: Camera[];
  protected rigidShapes: RigidShape[] = [];

  constructor(camera: Camera[]) {
    this.gameObjects = new GameObject();
    this.cameras = camera;
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

  protected loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  protected getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  load() {
    this.gameObjects.load();
    this.boundingBoxes = this.gameObjects.getAll<BoundingBox>(BoundingBox.name);
    this.lights = this.gameObjects.getAll<Light>(Light.name);
    this.rigidShapes = this.gameObjects
      .getAll<RigidCircle>(RigidCircle.name)
      .map((x) => x as RigidShape)
      .concat(
        this.gameObjects
          .getAll<RigidRectangle>(RigidRectangle.name)
          .map((x) => x as RigidShape)
      );
    setMaxLightSourceNumber(Math.max(this.lights.length, 1));
  }

  init() {
    this.gameObjects.init();
  }

  draw() {
    this.cameras.forEach((camera) => {
      camera.draw();
      this.gameObjects.draw(new DrawingResources(camera, this.lights));
    });
  }

  update() {
    this.cameras.forEach((camera) => camera.update());
    this.gameObjects.update();
    this.processBoudingBoxes();
    this.processPhysics();
  }

  unload() {
    this.gameObjects.unload();
  }

  add(component: IComponent) {
    this.gameObjects.add(component);
  }

  private processBoudingBoxes() {
    if (this.boundingBoxes.length === 0) {
      return;
    }

    const actionableBoudingBoxes = this.boundingBoxes.filter(
      (x) => x.hasAction() && x.active
    );

    if (actionableBoudingBoxes.length === 0) {
      return;
    }

    const nonActionableBoudingBoxes = this.boundingBoxes.filter(
      (x) => !x.hasAction() && x.active
    );

    // interact each actionable with each non-actionable
    actionableBoudingBoxes.forEach((actionable) => {
      nonActionableBoudingBoxes.forEach((nonActinable) => {
        this.executeActions(actionable, nonActinable);
      });
    });

    // interactions between actionables
    for (let i = 0; i < actionableBoudingBoxes.length - 1; i++) {
      for (let j = i + 1; j < actionableBoudingBoxes.length; j++) {
        this.executeActions(
          actionableBoudingBoxes[i],
          actionableBoudingBoxes[j]
        );
      }
    }
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

  private processPhysics() {
    for (let r = 0; r < PhysicsEngine.getRelaxationCount(); r++) {
      for (let i = 0; i < this.rigidShapes.length - 1; i++) {
        for (let j = i + 1; j < this.rigidShapes.length; j++) {
          PhysicsEngine.collideShape(this.rigidShapes[i], this.rigidShapes[j]);
        }
      }
    }
  }

  displayOnCamera(tag: number) {
    this.gameObjects.cameraTag = tag;
  }
}
