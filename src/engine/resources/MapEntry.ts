import { EngineError } from "../EngineError";
import { ResourceContent } from "./ResourceManager";

export class MapEntry {
  isLoaded: boolean;
  content: ResourceContent | null;
  refCount: number;

  private constructor(content: ResourceContent | null) {
    this.content = content;
    this.isLoaded = content !== null;
    this.refCount = 1;
  }

  public static EmptyEntry() {
    return new MapEntry(null);
  }

  public static Entry(content: ResourceContent) {
    if (content === null || content === undefined) {
      throw new EngineError(
        MapEntry.name,
        "Entry content cannot be null or undefined"
      );
    }
    return new MapEntry(content);
  }

  decRef() {
    this.refCount--;
  }

  incRef() {
    this.refCount++;
  }

  set(content: ResourceContent) {
    this.content = content;
  }

  canRemove() {
    return this.refCount == 0;
  }
}
