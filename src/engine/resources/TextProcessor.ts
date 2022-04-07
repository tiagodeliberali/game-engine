import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./IResourceProcessor";

export class TextProcessor implements IResourceProcessor {
  extensions() {
    return ["glsl", "txt"];
  }

  async decode(data: Response): Promise<unknown> {
    return await data.text();
  }

  async parse(text: unknown): Promise<MapEntry> {
    return MapEntry.Entry(text as string);
  }
}
