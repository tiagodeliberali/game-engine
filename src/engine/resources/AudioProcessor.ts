import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./IResourceProcessor";
import { Audio } from "./Audio";

export class AudioProcessor implements IResourceProcessor {
  extensions() {
    return ["wav", "mp3"];
  }

  async decode(data: Response): Promise<unknown> {
    return await data.arrayBuffer();
  }

  async parse(data: unknown): Promise<MapEntry> {
    const audio = await Audio.BuildAudioAsync(data as ArrayBuffer);
    return MapEntry.Entry(audio, () => audio.stop());
  }
}
