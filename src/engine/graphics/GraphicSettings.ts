import { vec4 } from "gl-matrix";

let mGlobalAmbientColor: vec4 = [1, 1, 1, 1];
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

export function setGlobalAmbientColor(value: number[]) {
  mGlobalAmbientColor = vec4.fromValues(value[0], value[1], value[2], value[3]);
}
