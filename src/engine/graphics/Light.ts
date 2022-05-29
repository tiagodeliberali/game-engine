import { Color, IComponent } from "../core";
import { Vec3d } from "../DataStructures";

export class Light implements IComponent {
  color: Color;
  position: Vec3d;
  isOn: boolean;
  nearRadius: number;
  farRadius: number;
  intensity: number;

  constructor(
    color: Color,
    position: Vec3d,
    near: number,
    far: number,
    isOn: boolean
  ) {
    this.color = color;
    this.position = position;
    this.isOn = isOn;

    this.nearRadius = near;
    this.farRadius = far;
    this.intensity = 1;
  }

  load() {
    // Need to add at elast one element from IComponent to accept the interface implementation
  }

  static buildDefault() {
    return new Light(
      Color.FromColorDef({ red: 150, green: 150, blue: 150, alpha: 1 }),
      Vec3d.from(0, 0, 0),
      2,
      4,
      true
    );
  }
}
