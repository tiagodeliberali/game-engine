import { Vec2d } from "../DataStructures";
import { Shake } from "./Shake";

export class Shake2d {
  xShake: Shake;
  yShake: Shake;

  constructor(deltas: Vec2d, frequency: Vec2d, duration: number) {
    this.xShake = new Shake(deltas.x, frequency.x, duration);
    this.yShake = new Shake(deltas.y, frequency.y, duration);
  }

  reStart() {
    this.xShake.reStart();
    this.yShake.reStart();
  }

  done() {
    return this.xShake.numCyclesLeft <= 0 && this.yShake.numCyclesLeft;
  }

  getNext(): Vec2d {
    const x = this.xShake.getNext();
    const y = this.yShake.getNext();
    return Vec2d.from(x, y);
  }
}
