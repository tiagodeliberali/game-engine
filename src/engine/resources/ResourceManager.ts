import { EngineError } from "../EngineError";
import { MapEntry } from "./MapEntry";
import { TextProcessor } from "./TextProcessor";

export interface IResourceProcessor {
  decode: (data: any) => any;
  parse: (data: any) => MapEntry;
}

export class ResourceManager {
  resourceMap: Map<string, MapEntry> = new Map();
  outstandingPromises: Promise<Map<string, MapEntry>>[] = [];

  public async waitOnPromises() {
    await Promise.all(this.outstandingPromises);
    this.outstandingPromises = [];
  }

  public get(path: string) {
    const entry = this.resourceMap.get(path);

    if (entry === undefined) {
      throw new EngineError(
        ResourceManager.name,
        "Error [" + path + "]: not added to Resource Manager"
      );
    }

    if (!entry.isLoaded) {
      throw new EngineError(
        ResourceManager.name,
        "Error [" + path + "]: not loaded"
      );
    }

    entry.incRef();
    return entry.content;
  }

  public loadText(path: string) {
    const textProcessor = new TextProcessor();
    this.loadDecodeParse(path, textProcessor);
  }

  public loadDecodeParse(path: string, processor: IResourceProcessor) {
    if (!this.resourceMap.has(path)) {
      this.resourceMap.set(path, MapEntry.EmptyEntry());

      const fetchPromise = fetch(path)
        .then((res) => processor.decode(res))
        .then((data) => processor.parse(data))
        .then((data) => this.resourceMap.set(path, data))
        .catch((err) => {
          throw err;
        });

      this.outstandingPromises.push(fetchPromise);
    }
  }

  public unload(path: string) {
    const entry = this.resourceMap.get(path);
    if (entry === undefined) {
      return;
    }

    entry.decRef();

    if (entry.canRemove()) {
      this.resourceMap.delete(path);
    }

    return entry.canRemove();
  }
}
