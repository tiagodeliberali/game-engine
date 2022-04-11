abstract class Animator {
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

class ForwardToBeginingAnimator extends Animator {
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

class BackwardToBeginingAnimator extends Animator {
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

export class AnimationType {
  static forwardToBeginingAnimator(settings: AnimationSettings) {
    return new ForwardToBeginingAnimator(settings);
  }

  static backwardToBeginingAnimator(settings: AnimationSettings) {
    return new BackwardToBeginingAnimator(settings);
  }
}

export interface AnimationSettings {
  initialPosition: number;
  lastPosition: number;
  speed: number;
}

export class RenderableAnimator {
  currentPosition: number;
  currenfFrame: number;
  isPlaying: boolean;
  isLooping: boolean;
  setSprite: (position: number) => void;
  animator: Animator;

  constructor(animator: Animator, setSprite: (position: number) => void) {
    this.animator = animator;
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
