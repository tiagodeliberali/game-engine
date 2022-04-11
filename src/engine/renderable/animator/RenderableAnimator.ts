import {
  AnimationSettings,
  AnimationType,
  BackwardToBeginingAnimator,
} from ".";
import { EngineError } from "../../EngineError";
import { Animator } from "./Animator";
import { ForwardToBeginingAnimator } from "./ForwardToBeginingAnimator";

function getAnimator(settings: AnimationSettings): Animator {
  switch (settings.type) {
    case AnimationType.BackwardToBegining:
      return new BackwardToBeginingAnimator(settings);
    case AnimationType.ForwardToBegining:
      return new ForwardToBeginingAnimator(settings);
    default:
      throw new EngineError(
        "getAnimator",
        `Unexpected animation type: ${settings.type}`
      );
  }
}

export class RenderableAnimator {
  currentPosition: number;
  currenfFrame: number;
  isPlaying: boolean;
  isLooping: boolean;
  setSprite: (position: number) => void;
  animator: Animator;

  constructor(
    settings: AnimationSettings,
    setSprite: (position: number) => void
  ) {
    this.animator = getAnimator(settings);
    this.currentPosition = this.animator.getInitialPosition();
    this.currenfFrame = 0;
    this.isPlaying = false;
    this.isLooping = false;
    this.setSprite = setSprite;

    this.setSprite(this.currentPosition);
  }

  stopLooping() {
    this.isLooping = false;
  }
  runOnce() {
    this.isPlaying = true;
    this.isLooping = false;
  }
  runInLoop() {
    this.isPlaying = true;
    this.isLooping = true;
  }

  animate() {
    if (!this.isPlaying) {
      return;
    }

    this.setCurrentPosition();
    this.setSprite(this.currentPosition);
  }

  setCurrentPosition() {
    if (!this.shouldUpdatePosition()) {
      return;
    }

    this.currentPosition = this.animator.getNextPosition(this.currentPosition);

    if (this.animator.isLoopEnded(this.currentPosition)) {
      this.isPlaying = this.isLooping;
      this.currentPosition = this.animator.getEndLoopPosition();
    }
  }

  shouldUpdatePosition(): boolean {
    this.currenfFrame++;
    if (this.animator.shouldUpdatePosition(this.currenfFrame)) {
      this.currenfFrame = 0;
      return true;
    }
    return false;
  }
}
