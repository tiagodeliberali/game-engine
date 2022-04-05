import { MapEntry } from "./MapEntry";
import { IResourceProcessor, ResourceContent } from "./ResourceManager";

export class TextProcessor implements IResourceProcessor {
  decode(data: Response): Promise<ResourceContent> {
    return data.text();
  }

  parse(text: ResourceContent): MapEntry {
    return MapEntry.Entry(text);
  }
}
