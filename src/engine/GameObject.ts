import { Camera } from ".";
import { IRenderable } from "./renderable";
import { getResourceManager } from "./resources";

export class GameObject {
  renderable?: IRenderable;

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  load() {
    // virtual method
  }

  init() {
    // virtual method
  }

  update() {
    // virtual method
  }

  draw(camera: Camera) {
    this.renderable && this.renderable.draw(camera);
  }

  unload() {
    // virtual method
  }
}
