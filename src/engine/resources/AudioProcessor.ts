import { MapEntry, ResourceProcessor } from ".";
// import { Audio } from "./Audio";

export class AudioProcessor extends ResourceProcessor {
  extensions() {
    return ["wav", "mp3"];
  }

  async parse(data: unknown): Promise<MapEntry> {
    const response = data as Response;
    const buffer = await response.arrayBuffer();

    const audio = await Audio.BuildAudioAsync(buffer);
    return MapEntry.Entry(audio, () => audio.stop());
  }
}
