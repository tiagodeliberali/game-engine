import { Color, IComponent } from "../core";
import { Vec3d } from "../DataStructures";

export class Light implements IComponent {
  color: Color;
  position: Vec3d;
  radius: number;
  isOn: boolean;

  constructor(color: Color, position: Vec3d, radius: number, isOn: boolean) {
    this.color = color;
    this.position = position;
    this.radius = radius;
    this.isOn = isOn;
  }
  load() {
    //
  }

  init() {
    //
  }

  update() {
    //
  }

  draw() {
    //
  }

  unload() {
    //
  }

  static buildDefault() {
    return new Light(
      Color.FromColorDef({ red: 150, green: 150, blue: 150, alpha: 1 }),
      Vec3d.from(0, 0, 0),
      2,
      true
    );
  }
}