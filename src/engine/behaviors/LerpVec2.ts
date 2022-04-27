import { Vec2d } from "..";

export class LerpVec2 {
  currentValue: Vec2d;
  finalValue: Vec2d;
  cycles: number;
  rate: number;
  cyclesLeft: number;

  constructor(value: Vec2d, cycles: number, rate: number) {
    this.currentValue = value; // begin value of interpolation
    this.finalValue = value; // final value of interpolation
    this.cycles = cycles;
    this.rate = rate;
    // Number of cycles left for interpolation
    this.cyclesLeft = 0;
  }

  interpolateValue() {
    this.currentValue = this.currentValue.lerp(this.finalValue, this.rate);
  }

  config(stiffness: number, duration: number) {
    this.rate = stiffness;
    this.cycles = duration;
  }

  get() {
    return this.currentValue;
  }

  setFinal(v: Vec2d) {
    this.finalValue = v;
    this.cyclesLeft = this.cycles; // will trigger interpolation
  }

  update() {
    if (this.cyclesLeft <= 0) {
      return;
    }
    this.cyclesLeft--;
    if (this.cyclesLeft === 0) {
      this.currentValue = this.finalValue;
    } else {
      this.interpolateValue();
    }
  }
}
