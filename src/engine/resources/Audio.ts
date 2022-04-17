import { EngineError } from "../EngineError";

const audioContext: AudioContext = new AudioContext();

const masterGain: GainNode = audioContext.createGain();
masterGain.connect(audioContext.destination);
masterGain.gain.value = 0.1;

export class Audio {
  private sourceGain: GainNode;
  private buffer: AudioBuffer | undefined;
  private latestSource: AudioBufferSourceNode | undefined;

  private constructor() {
    this.sourceGain = audioContext.createGain();
    this.sourceGain.connect(masterGain);
    this.sourceGain.gain.value = 1.0;
  }

  static async BuildAudioAsync(data: ArrayBuffer): Promise<Audio> {
    const audio = new Audio();
    await audio.init(data);
    return audio;
  }

  private async init(data: ArrayBuffer) {
    try {
      this.buffer = await audioContext.decodeAudioData(data);
    } catch (e) {
      throw new EngineError(Audio.name, "Error on initializing.");
    }
  }

  // You cannot use a source more than once, so you need to generate it every time
  private getSource() {
    if (this.buffer === undefined) {
      throw new EngineError(Audio.name, "Buffer not initialized");
    }
    const source = audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.sourceGain);

    return source;
  }

  // stops the current run to play again
  playOnce(volume?: number) {
    if (this.sourceGain === undefined) {
      throw new EngineError(Audio.name, "Audio not initialized");
    }

    const source = this.getSource();
    source.start(0);

    if (volume !== undefined) {
      this.setSourceVolume(volume);
    }
  }

  // do nothing if it's already playing
  playLoop(volume?: number) {
    if (this.sourceGain === undefined) {
      throw new EngineError(Audio.name, "Audio not initialized");
    }

    if (this.isPlaying()) {
      return;
    }

    this.latestSource = this.getSource();
    this.latestSource.loop = true;
    this.latestSource.start(0);

    if (volume !== undefined) {
      this.setSourceVolume(volume);
    }
  }

  stop() {
    if (this.isPlaying()) {
      this.latestSource!.stop(0);
      this.latestSource = undefined;
    }
  }

  isPlaying() {
    return this.latestSource !== undefined;
  }

  setSourceVolume(volume: number) {
    if (this.sourceGain !== undefined) {
      this.sourceGain.gain.value = volume;
    }
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
