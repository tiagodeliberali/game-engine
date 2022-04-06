import { EngineError } from "../EngineError";
import { MapEntry } from "./MapEntry";
import { TextProcessor } from "./TextProcessor";

export interface IResourceProcessor {
  decode: (data: Response) => Promise<unknown>;
  parse: (data: unknown) => Promise<MapEntry>;
}

export class ResourceManager {
  globalResourceMap: Map<string, MapEntry> = new Map();
  sceneResourceMap: Map<string, MapEntry> = new Map();
  outstandingPromises: Promise<Map<string, MapEntry>>[] = [];

  public async waitOnPromises() {
    await Promise.all(this.outstandingPromises);
    this.outstandingPromises = [];
  }

  public get(path: string): unknown {
    const entry =
      this.globalResourceMap.get(path) || this.sceneResourceMap.get(path);

    if (entry === undefined) {
      throw new EngineError(
        ResourceManager.name,
        "Error [" + path + "]: not added to Resource Manager"
      );
    }

    if (!entry.isLoaded || entry.content === null) {
      throw new EngineError(
        ResourceManager.name,
        "Error [" + path + "]: not loaded"
      );
    }

    entry.incRef();
    return entry.content;
  }

  public loadText(path: string, isGlobal?: boolean): void {
    const textProcessor = new TextProcessor();
    this.loadDecodeParse(path, textProcessor, isGlobal || false);
  }

  public loadDecodeParse(
    path: string,
    processor: IResourceProcessor,
    isGlobal: boolean
  ): void {
    if (!this.globalResourceMap.has(path) && !this.sceneResourceMap.has(path)) {
      this.globalResourceMap.set(path, MapEntry.EmptyEntry());

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
    this.sceneResourceMap.clear();
  }

  public unload(path: string): boolean {
    const entry = this.globalResourceMap.get(path);
    if (entry === undefined) {
      return false;
    }

    entry.decRef();

    if (entry.canRemove()) {
      this.globalResourceMap.delete(path);
    }

    return entry.canRemove();
  }
}
