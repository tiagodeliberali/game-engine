import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./ResourceManager";

export class TextProcessor implements IResourceProcessor {
  async decode(data: Response): Promise<unknown> {
    return await data.text();
  }

  async parse(text: unknown): Promise<MapEntry> {
    return MapEntry.Entry(text as string);
  }
}
