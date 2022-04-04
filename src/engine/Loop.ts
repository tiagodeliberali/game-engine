import { EngineError } from "./EngineError";
import { SceneDef } from "./Scene";

const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS; // Milliseconds per update.

let prevTime: number;
let lagTime: number;

let loopRunning = false;
let frameID = -1;

let currentScene: SceneDef | undefined;

export function start(scene: SceneDef) {
  if (loopRunning) {
    throw new Error("loop already running");
  }

  currentScene = scene;
  currentScene.init();
  prevTime = performance.now();
  lagTime = 0.0;
  loopRunning = true;
  frameID = requestAnimationFrame(loopOnce);
}

export function stop() {
  loopRunning = false;
  cancelAnimationFrame(frameID);
}

function loopOnce(currentTime: number) {
  if (currentScene === undefined) {
    throw new EngineError("Loop", "Current scene not initialized");
  }

  if (loopRunning) {
    frameID = requestAnimationFrame(loopOnce);

    currentScene.draw();

    const elapsedTime = currentTime - prevTime;
    prevTime = currentTime;
    lagTime += elapsedTime;

    while (lagTime >= kMPF && loopRunning) {
      currentScene.update();
      lagTime -= kMPF;
    }
  }
}
