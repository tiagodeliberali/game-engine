import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./ResourceManager";

export class TextProcessor implements IResourceProcessor {
  decode(data: any) {
    return data.text();
  }

  parse(text: any): MapEntry {
    return MapEntry.Entry(text);
  }
}
