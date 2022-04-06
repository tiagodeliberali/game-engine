import { EngineError } from "../EngineError";
import { MapEntry } from "./MapEntry";
import { IResourceProcessor } from "./ResourceManager";

const audioContext: AudioContext = new AudioContext();

const masterGain: GainNode = audioContext.createGain();
masterGain.connect(audioContext.destination);
masterGain.gain.value = 0.1;

export class Audio {
  sourceGain: GainNode | undefined;
  source: AudioBufferSourceNode;
  isPlaying: boolean;

  private constructor() {
    this.source = audioContext.createBufferSource();
    this.isPlaying = false;
  }

  public static async BuildAudioAsync(data: ArrayBuffer): Promise<Audio> {
    const audio = new Audio();
    await audio.init(data);
    return audio;
  }

  public async init(data: ArrayBuffer) {
    try {
      this.source.buffer = await audioContext.decodeAudioData(data);

      this.sourceGain = audioContext.createGain();
      this.sourceGain.connect(masterGain);
      this.sourceGain.gain.value = 1.0;
    } catch (e) {
      throw new EngineError(Audio.name, "Error on initializing.");
    }
  }

  playCue(volume: number) {
    if (this.sourceGain === undefined) {
      throw new EngineError(Audio.name, "Audio not initialized");
    }

    this.source.start(0);

    this.source.connect(this.sourceGain);
    this.setSourceVolume(volume);
  }

  playBackground(volume: number) {
    if (this.sourceGain === undefined) {
      throw new EngineError(Audio.name, "Audio not initialized");
    }

    this.stopBackground();
    this.source.loop = true;
    this.source.start(0);

    this.source.connect(this.sourceGain);
    this.setSourceVolume(volume);
    this.isPlaying = true;
  }

  stopBackground() {
    this.source.stop(0);
    this.isPlaying = false;
  }

  setSourceVolume(volume: number) {
    if (this.sourceGain !== undefined) {
      this.sourceGain.gain.value = volume;
    }
  }

  isBackgroundPlaying() {
    return this.isPlaying;
  }

  incSourceVolume(increment: number) {
    if (this.sourceGain === undefined) {
      throw new EngineError(Audio.name, "Audio not initialized");
    }

    this.sourceGain.gain.value = Math.max(
      this.sourceGain.gain.value + increment,
      0
    );
  }

  setMasterVolume(volume: number) {
    masterGain.gain.value = volume;
  }

  incMasterVolume(increment: number) {
    masterGain.gain.value = Math.max(masterGain.gain.value + increment, 0);
  }
}

export class AudioProcessor implements IResourceProcessor {
  async decode(data: Response): Promise<unknown> {
    return await data.arrayBuffer();
  }

  async parse(data: unknown): Promise<MapEntry> {
    return MapEntry.Entry(await Audio.BuildAudioAsync(data as ArrayBuffer));
  }
}
