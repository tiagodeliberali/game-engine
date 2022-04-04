const keyPreviousState: boolean[] = []; // a new array
const pressedKey: boolean[] = [];
const clickedKey: boolean[] = [];

// Event handler functions
function onKeyDown(event: KeyboardEvent) {
  pressedKey[event.keyCode] = true;
}

function onKeyUp(event: KeyboardEvent) {
  pressedKey[event.keyCode] = false;
}

export function initKeyboard() {
  for (let i = 0; i < Keys.LastKeyCode; i++) {
    pressedKey[i] = false;
    keyPreviousState[i] = false;
    clickedKey[i] = false;
  }

  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("keydown", onKeyDown);
}

export function updateKeyboard() {
  for (let i = 0; i < Keys.LastKeyCode; i++) {
    clickedKey[i] = !keyPreviousState[i] && pressedKey[i];
    keyPreviousState[i] = pressedKey[i];
  }
}

export function isKeyPressed(keyCode: number) {
  return pressedKey[keyCode];
}

export function isKeyClicked(keyCode: number) {
  return clickedKey[keyCode];
}

export enum Keys {
  // arrows
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40,
  // space bar
  Space = 32,
  // numbers
  Zero = 48,
  One = 49,
  Two = 50,
  Three = 51,
  Four = 52,
  Five = 53,
  Six = 54,
  Seven = 55,
  Eight = 56,
  Nine = 57,
  // Alphabets
  A = 65,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  Q = 81,
  R = 82,
  S = 83,
  W = 87,
  LastKeyCode = 222,
}
