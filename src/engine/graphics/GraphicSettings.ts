import { Color } from "../core";

let mGlobalAmbientColor: Color = Color.White();
let mGlobalAmbientIntensity = 1;
let maxLightSourceNumber = 0;

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

export function getMaxLightSourceNumber() {
  return maxLightSourceNumber;
}

export function setMaxLightSourceNumber(max: number) {
  maxLightSourceNumber = max;
}
