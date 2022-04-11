import { AnimationSettings } from ".";

export abstract class Animator {
  settings: AnimationSettings;

  constructor(settings: AnimationSettings) {
    this.settings = settings;
  }

  abstract getEndLoopPosition(): number;
  abstract isLoopEnded(currentPosition: number): boolean;
  abstract getNextPosition(currentPosition: number): number;
  abstract getInitialPosition(): number;

  shouldUpdatePosition(currenfFrame: number) {
    return currenfFrame % this.settings.speed === 0;
  }
}
