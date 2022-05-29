const updatesPerSecond = 60;
const milisecondsPerUpdate = 1000 / updatesPerSecond;
const secondsPerUpdate = 1 / updatesPerSecond;

let prevTime: number;
let lagTime: number;

let loopRunning = false;
let frameID = -1;

let loopDrawAction = () => {
  // empty method
};

let loopUpdateAction = () => {
  // empty method
};

export function getUpdateIntervalInSeconds() {
  return secondsPerUpdate;
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

    while (lagTime >= milisecondsPerUpdate && loopRunning) {
      loopUpdateAction();
      lagTime -= milisecondsPerUpdate;
    }
  }
}
