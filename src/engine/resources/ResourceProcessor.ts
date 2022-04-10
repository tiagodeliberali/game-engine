import { EngineError } from "../EngineError";
import { MapEntry } from ".";

export abstract class ResourceProcessor {
  extensions(): string[] {
    throw new EngineError(ResourceProcessor.name, "Extensions not implemented");
  }

  async fetch(path: string): Promise<unknown> {
    return fetch(path);
  }

  async parse(data: unknown): Promise<MapEntry> {
    throw new EngineError(
      ResourceProcessor.name,
      `Could not parse ${data}. Not implemented`
    );
  }
}
