import { GameObject, IComponent, isDebugMode, LineRenderable } from "..";
import { DrawingResources } from "../core";

export abstract class RigidShape implements IComponent {
  protected owner: GameObject;
  protected debugBox: LineRenderable | undefined;

  constructor(owner: GameObject) {
    this.owner = owner;
  }

  getCenter() {
    return this.owner.getTransform().getPosition();
  }

  /////
  /// ICompontent
  /////
  load() {
    isDebugMode() && this.debugBox && this.debugBox.load();
  }

  init() {
    isDebugMode() && this.debugBox && this.debugBox.init();
  }

  update() {
    //
  }

  draw(resources: DrawingResources) {
    isDebugMode() && this.debugBox && this.debugBox.draw(resources);
  }

  unload() {
    //
  }
}
