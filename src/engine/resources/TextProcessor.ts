import { MapEntry, ResourceProcessor } from ".";

export class TextProcessor extends ResourceProcessor {
  extensions() {
    return ["glsl", "txt"];
  }

  async parse(data: unknown): Promise<MapEntry> {
    const response = data as Response;
    const text = await response.text();
    return MapEntry.Entry(text);
  }
}
