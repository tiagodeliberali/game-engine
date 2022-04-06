import { EngineError } from "../EngineError";

export class MapEntry {
  isLoaded: boolean;
  content: unknown | null;
  refCount: number;

  private constructor(content: unknown | null) {
    this.content = content;
    this.isLoaded = content !== null;
    this.refCount = 1;
  }

  public static EmptyEntry() {
    return new MapEntry(null);
  }

  public static Entry(content: unknown) {
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

  set(content: unknown) {
    this.content = content;
  }

  canRemove() {
    return this.refCount == 0;
  }
}
