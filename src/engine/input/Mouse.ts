import { Camera } from "..";
import { Vec2d } from "../DataStructures";
import { EngineError } from "../EngineError";
import { DefaultGlName } from "../graphics";

export enum MouseButton {
  left = 0,
  middle = 1,
  right = 2,
}

let canvas: HTMLCanvasElement | undefined;
const previousState: boolean[] = [false, false, false];
const buttonPressed: boolean[] = [false, false, false];
const buttonClicked: boolean[] = [false, false, false];
let mousePosition = Vec2d.from(-1, -1);
let insideCanvas = false;

function onMouseMove(event: MouseEvent) {
  if (canvas === undefined) {
    throw new EngineError("Mouse", "Try to access canvas before initialize it");
  }

  insideCanvas = false;
  const bBox = canvas.getBoundingClientRect();

  // In Canvas Space now. Convert via ratio from canvas to client.
  const x = Math.round(
    (event.clientX - bBox.left) * (canvas.width / bBox.width)
  );
  const y = Math.round(
    (event.clientY - bBox.top) * (canvas.height / bBox.height)
  );
  if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
    mousePosition = Vec2d.from(x, canvas.height - 1 - y);
    insideCanvas = true;
  }
}

function onMouseDown(event: MouseEvent) {
  if (insideCanvas) {
    buttonPressed[event.button] = true;
  }
}

function onMouseUp(event: MouseEvent) {
  buttonPressed[event.button] = false;
}

export function isButtonPressed(button: MouseButton) {
  return buttonPressed[button];
}

export function isButtonClicked(button: MouseButton) {
  return buttonClicked[button];
}

export function getMousePosition(camera: Camera): Vec2d {
  return camera.convertDCtoWC(mousePosition);
}

export const isMouseInViewport = (camera: Camera) => {
  return insideCanvas && camera.isInViewportDC(mousePosition);
};

export function initMouse() {
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  canvas = document.getElementById(DefaultGlName) as HTMLCanvasElement;
}

export function updateMouse() {
  for (let i = 0; i < 3; i++) {
    buttonClicked[i] = !previousState[i] && buttonPressed[i];
    previousState[i] = buttonPressed[i];
  }
}
