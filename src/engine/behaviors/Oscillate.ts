export class Oscillate {
  mag: number;
  cycles: number;
  omega: number;
  numCyclesLeft: number;

  constructor(delta: number, frequency: number, duration: number) {
    this.mag = delta;
    this.cycles = duration; // cycles to complete the transition
    this.omega = frequency * 2 * Math.PI; // Converts to radians
    this.numCyclesLeft = duration;
  }

  protected nextDampedHarmonic() {
    // computes (Cycles) * cos(Omega * t)
    const frac = this.numCyclesLeft / this.cycles;
    return frac * frac * Math.cos((1 - frac) * this.omega);
  }

  protected nextValue() {
    return this.nextDampedHarmonic();
  }

  done() {
    return this.numCyclesLeft <= 0;
  }

  reStart() {
    this.numCyclesLeft = this.cycles;
  }

  getNext() {
    this.numCyclesLeft--;
    let v = 0;
    if (!this.done()) {
      v = this.nextValue();
    }
    return v * this.mag;
  }
}
