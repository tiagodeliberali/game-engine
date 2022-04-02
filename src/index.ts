import { initWebGL, clearCanvas, drawSquare } from "./Core";

window.onload = function () {
  initWebGL("GLCanvas");
  clearCanvas();
  drawSquare();
};
