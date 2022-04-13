import { Camera } from "..";
import { IRenderable } from "../renderable";
import { getResourceManager } from "../resources";
import { IGameObject } from ".";

export class GameObject implements IGameObject {
  private renderable?: IRenderable;

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  load() {
    this.renderable && this.renderable.load();
  }

  init() {
    this.renderable && this.renderable.init();
  }

  update() {
    // virtual method
  }

  draw(camera: Camera) {
    this.renderable && this.renderable.draw(camera);
  }

  unload() {
    this.renderable && this.renderable.unload();
  }

  getRenderable<T extends IRenderable>(): T {
    return this.renderable as T;
  }

  setRenderable(renderable: IRenderable) {
    this.renderable = renderable;
  }

  static FromRenderable(renderable: IRenderable): IGameObject {
    const gameObject = new GameObject();
    gameObject.renderable = renderable;

    return gameObject;
  }
}
