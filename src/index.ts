import { initWebGL, clearCanvas } from "./core";

window.onload = function () {
  initWebGL("GLCanvas");
  clearCanvas();
};

// export const canvas = document.getElementById("GLCanvas");
