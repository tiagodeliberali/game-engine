import { AnimationSettings } from ".";
import { Animator } from "./Animator";

export class ForwardToBeginingAnimator extends Animator {
  constructor(settings: AnimationSettings) {
    super(settings);
  }

  getInitialPosition(): number {
    return this.settings.initialPosition;
  }

  getEndLoopPosition(): number {
    return this.settings.initialPosition;
  }

  getNextPosition(currentPosition: number): number {
    return currentPosition + 1;
  }

  isLoopEnded(currentPosition: number): boolean {
    return currentPosition > this.settings.lastPosition;
  }
}
