import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import {
  SpriteRenderable,
  TextureRenderable,
  Renderable,
  Camera,
  Color,
  IRenderable,
} from "./graphics";
import { BasicScene } from "./scene";
import { GameEngine } from "./GameEngine";
import { isKeyPressed, isKeyClicked, Keys } from "./input";
import { Audio, Texture } from "./resources";

export {
  getGL,
  initGL,
  clearCanvas,
  Renderable,
  TextureRenderable,
  SpriteRenderable,
  Camera,
  Color,
  Vec2d,
  GameEngine,
  isKeyPressed,
  isKeyClicked,
  Keys,
  BasicScene,
  Audio,
  Texture,
};

export type { IRenderable };
