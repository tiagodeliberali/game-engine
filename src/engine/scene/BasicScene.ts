import { Camera } from "..";
import { AbstractScene } from ".";

export class BasicScene extends AbstractScene {
  constructor(cameras: Camera[]) {
    super(cameras);
  }

  draw() {
    super.draw();
  }
}
