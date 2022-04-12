import { IGameObject } from ".";
import { Camera } from "../graphics";

export class GameObjectSet implements IGameObject {
  set: IGameObject[] = [];

  load() {
    this.set.forEach((item) => item.load());
  }

  init() {
    this.set.forEach((item) => item.init());
  }

  update() {
    this.set.forEach((item) => item.update());
  }

  draw(camera: Camera) {
    this.set.forEach((item) => item.draw(camera));
  }

  unload() {
    this.set.forEach((item) => item.unload());
  }

  push(item: IGameObject) {
    this.set.push(item);
  }

  get<T extends IGameObject>(position: number): T {
    return this.set[position] as T;
  }
}
