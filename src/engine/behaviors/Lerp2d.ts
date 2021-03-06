import { Vec2d } from "..";

export class Lerp2d {
  currentValue: Vec2d;
  finalValue: Vec2d;
  cycles: number;
  rate: number;
  cyclesLeft: number;

  constructor(value: Vec2d, cycles: number, rate: number) {
    this.currentValue = value;
    this.finalValue = value;
    this.cycles = cycles;
    this.rate = rate;
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
