import { Oscillate } from "./Oscillate";

export class Shake extends Oscillate {
  constructor(delta: number, frequency: number, duration: number) {
    super(delta, frequency, duration);
  }

  nextValue() {
    const v = this.nextDampedHarmonic();
    const fx = Math.random() > 0.5 ? -v : v;
    return fx;
  }
}
