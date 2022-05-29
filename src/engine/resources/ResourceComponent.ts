import { getResourceManager, ResourceManager } from ".";
import { IComponent } from "..";

export class ResourceComponent implements IComponent {
  path: string;
  resourceManager: ResourceManager;

  constructor(path: string) {
    this.path = path;
    this.resourceManager = getResourceManager();
  }

  load() {
    this.resourceManager.loadScene(this.path);
  }

  get<T>(): T {
    return this.resourceManager.get<T>(this.path);
  }
}
