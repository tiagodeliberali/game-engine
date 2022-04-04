import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import { Renderable } from "./graphics/Renderable";
import { Camera } from "./graphics/Camera";
import { Color } from "./graphics/Color";
import { SceneDef } from "./Scene";
import { GameEngine } from "./GameEngine";
import { isKeyPressed, isKeyClicked, Keys } from "./input/Keyboard";

export {
  getGL,
  initGL,
  clearCanvas,
  Renderable,
  Camera,
  Color,
  Vec2d,
  GameEngine,
  isKeyPressed,
  isKeyClicked,
  Keys,
};

export type { SceneDef };
