import { Color } from "../core";

let mGlobalAmbientColor: Color = Color.FromColorDef({
  red: 100,
  green: 100,
  blue: 100,
  alpha: 1,
});
let mGlobalAmbientIntensity = 1;

export function getGlobalAmbientIntensity() {
  return mGlobalAmbientIntensity;
}

export function setGlobalAmbientIntensity(value: number) {
  mGlobalAmbientIntensity = value;
}

export function getGlobalAmbientColor() {
  return mGlobalAmbientColor;
}

export function setGlobalAmbientColor(color: Color) {
  mGlobalAmbientColor = color;
}
