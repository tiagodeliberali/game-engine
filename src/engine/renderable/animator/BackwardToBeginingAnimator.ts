import { AnimationSettings } from ".";
import { Animator } from "./Animator";

export class BackwardToBeginingAnimator extends Animator {
  constructor(settings: AnimationSettings) {
    super(settings);
  }

  getInitialPosition(): number {
    return this.settings.lastPosition;
  }

  getEndLoopPosition(): number {
    return this.settings.lastPosition;
  }

  getNextPosition(currentPosition: number): number {
    return currentPosition - 1;
  }

  isLoopEnded(currentPosition: number): boolean {
    return currentPosition < this.settings.initialPosition;
  }
}
