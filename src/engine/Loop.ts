const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS; // Milliseconds per update.
const kSPU = 1 / kUPS; // seconds per update

let prevTime: number;
let lagTime: number;

let loopRunning = false;
let frameID = -1;

let loopDrawAction = () => {
  // virtual method
};

let loopUpdateAction = () => {
  // virtual method
};

export function getUpdateIntervalInSeconds() {
  return kSPU;
}

export function initLoop(drawAction?: () => void, updateAction?: () => void) {
  if (loopRunning) {
    throw new Error("loop already running");
  }

  loopDrawAction = drawAction || loopDrawAction;
  loopUpdateAction = updateAction || loopUpdateAction;

  prevTime = performance.now();
  lagTime = 0.0;
  loopRunning = true;
  frameID = requestAnimationFrame(loopOnce);
}

export function stopLoop() {
  loopRunning = false;
  cancelAnimationFrame(frameID);
}

function loopOnce(currentTime: number) {
  if (loopRunning) {
    frameID = requestAnimationFrame(loopOnce);

    loopDrawAction();

    const elapsedTime = currentTime - prevTime;
    prevTime = currentTime;
    lagTime += elapsedTime;

    while (lagTime >= kMPF && loopRunning) {
      loopUpdateAction();
      lagTime -= kMPF;
    }
  }
}
