import { getGL } from "../GL";
import { MapEntry, ResourceProcessor, Texture } from ".";

export class TextureProcessor extends ResourceProcessor {
  extensions() {
    return ["png", "jpg"];
  }

  async fetch(path: string): Promise<unknown> {
    const image = new Image();
    image.src = path;
    // return new Promise((resolve) => {
    //   image.onload = resolve;
    // });

    return image.decode().then(() => image);
  }

  async parse(data: unknown): Promise<MapEntry> {
    const texture = new Texture(getGL(), data as HTMLImageElement);
    return MapEntry.Entry(texture, () => texture.unload());
  }
}
