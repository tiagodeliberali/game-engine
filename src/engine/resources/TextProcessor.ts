import { MapEntry } from "./MapEntry";
import { IResourceProcessor, ResourceContent } from "./ResourceManager";

export class TextProcessor implements IResourceProcessor {
  async decode(data: Response): Promise<ResourceContent> {
    return await data.text();
  }

  async parse(text: ResourceContent): Promise<MapEntry> {
    return MapEntry.Entry(text);
  }
}
