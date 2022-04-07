import { EngineError } from "../EngineError";
import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./IResourceProcessor";

export class ResourceManager {
  processors: Map<string, IResourceProcessor> = new Map();
  globalResourceMap: Map<string, MapEntry> = new Map();
  sceneResourceMap: Map<string, MapEntry> = new Map();
  outstandingPromises: Promise<Map<string, MapEntry>>[] = [];

  public async waitOnLoading() {
    await Promise.all(this.outstandingPromises);
    this.outstandingPromises = [];
  }

  public addResourceProcessor(processor: IResourceProcessor) {
    processor
      .extensions()
      .forEach((extension) => this.processors.set(extension, processor));
  }

  public get(path: string): unknown {
    const entry =
      this.globalResourceMap.get(path) || this.sceneResourceMap.get(path);

    if (entry === undefined) {
      throw new EngineError(
        ResourceManager.name,
        `${path} not added to Resource Manager`
      );
    }

    if (!entry.isLoaded || entry.content === null) {
      throw new EngineError(
        ResourceManager.name,
        `${path} not loaded by Resource Manager`
      );
    }

    entry.incRef();
    return entry.content;
  }

  public loadGlobal(path: string, extension?: string) {
    this.load(path, true, extension);
  }

  public loadScene(path: string, extension?: string) {
    this.load(path, false, extension);
  }

  private load(path: string, isGlobal: boolean, extension?: string) {
    const processorExtension =
      extension || path.substring(path.lastIndexOf(".") + 1);

    const processor = this.processors.get(processorExtension);

    if (processor === undefined) {
      throw new EngineError(
        ResourceManager.name,
        `Could not found processor for ${processorExtension} extension.`
      );
    }

    this.loadDecodeParse(path, processor, isGlobal);
  }

  public loadDecodeParse(
    path: string,
    processor: IResourceProcessor,
    isGlobal: boolean
  ): void {
    if (!this.globalResourceMap.has(path) && !this.sceneResourceMap.has(path)) {
      isGlobal
        ? this.globalResourceMap.set(path, MapEntry.EmptyEntry())
        : this.sceneResourceMap.set(path, MapEntry.EmptyEntry());

      const fetchPromise = fetch(path)
        .then((res) => processor.decode(res))
        .then((data) => processor.parse(data))
        .then((data) =>
          isGlobal
            ? this.globalResourceMap.set(path, data)
            : this.sceneResourceMap.set(path, data)
        )
        .catch((err) => {
          throw err;
        });

      this.outstandingPromises.push(fetchPromise);
    }
  }

  public unloadScene() {
    this.sceneResourceMap.forEach((entry) => entry.unload && entry.unload());
    this.sceneResourceMap.clear();
  }

  public unloadAll() {
    this.unloadScene();
    this.globalResourceMap.forEach((entry) => entry.unload && entry.unload());
    this.globalResourceMap.clear();
  }

  public unload(path: string): boolean {
    const entry =
      this.globalResourceMap.get(path) || this.sceneResourceMap.get(path);

    if (entry === undefined) {
      return false;
    }

    entry.decRef();

    if (entry.canRemove()) {
      entry.unload && entry.unload();
      this.globalResourceMap.delete(path);
    }

    return entry.canRemove();
  }
}
