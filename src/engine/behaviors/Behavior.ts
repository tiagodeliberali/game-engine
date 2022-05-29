import { IComponent } from "..";

export class Behavior implements IComponent {
  action: () => void;

  constructor(action: () => void) {
    this.action = action;
  }

  update() {
    this.action();
  }
}
