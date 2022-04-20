import { MapEntry, ResourceProcessor } from ".";
import { Texture } from "../graphics";

export class TextureProcessor extends ResourceProcessor {
  extensions() {
    return ["png", "jpg"];
  }

  async fetch(path: string): Promise<unknown> {
    const image = new Image();
    image.src = path;
    return image.decode().then(() => image);
  }

  async parse(data: unknown): Promise<MapEntry> {
    const texture = new Texture(data as HTMLImageElement);
    return MapEntry.Entry(texture, () => texture.unload());
  }
}
