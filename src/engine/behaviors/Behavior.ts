import { IComponent } from ".";

export class Behavior implements IComponent {
  action: () => void;

  constructor(action: () => void) {
    this.action = action;
  }

  load() {
    //
  }

  init() {
    //
  }

  update() {
    this.action();
  }

  draw() {
    //
  }

  unload() {
    //
  }
}
