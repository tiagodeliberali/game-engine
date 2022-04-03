import { getGL } from "./GL";
import { SimpleShader } from "./SimpleShader";

let constColorShader: SimpleShader | undefined;

export function getConstColorShader(): SimpleShader {
  if (constColorShader === undefined) {
    constColorShader = new SimpleShader(getGL());
  }

  return constColorShader;
}
