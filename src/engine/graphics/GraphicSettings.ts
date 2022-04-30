import { Color } from "../core";

let mGlobalAmbientColor: Color = Color.White();
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
