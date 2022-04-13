import { Camera } from "..";
import { getResourceManager } from "../resources";
import { IComponent } from ".";

export class GameObject implements IComponent {
  private components: IComponent[] = [];

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  load() {
    this.components.forEach((item) => item.load());
  }

  init() {
    this.components.forEach((item) => item.init());
  }

  update() {
    this.components.forEach((item) => item.update());
  }

  draw(camera: Camera) {
    this.components.forEach((item) => item.draw(camera));
  }

  unload() {
    this.components.forEach((item) => item.unload());
  }

  add(component: IComponent) {
    this.components.push(component);
  }

  getFirst<T extends IComponent>(): T | undefined {
    const result = this.components.filter((x) => (x as T) !== undefined);
    return result.length > 0 ? (result[0] as T) : undefined;
  }

  static FromComponent(renderable: IComponent): IComponent {
    const gameObject = new GameObject();
    gameObject.add(renderable);

    return gameObject;
  }
}
