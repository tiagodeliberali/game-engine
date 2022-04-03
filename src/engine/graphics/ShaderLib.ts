import { SimpleShader } from "./SimpleShader";

let constColorShader: SimpleShader | undefined;

export function getConstColorShader(gl: WebGL2RenderingContext): SimpleShader {
  if (constColorShader === undefined) {
    constColorShader = new SimpleShader(gl);
  }

  return constColorShader;
}
