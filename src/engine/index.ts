import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import { Camera, Color, Viewport } from "./graphics";
import {
  SpriteAnimateRenderable,
  SpriteRenderable,
  TextureRenderable,
  FontRenderable,
  Renderable,
  IRenderable,
} from "./renderable";
import { BasicScene } from "./scene";
import { GameEngine } from "./GameEngine";
import { isKeyPressed, isKeyClicked, Keys } from "./input";
import { Audio, Texture } from "./resources";
import { EngineError } from "./EngineError";

export {
  getGL,
  initGL,
  clearCanvas,
  Renderable,
  TextureRenderable,
  SpriteRenderable,
  FontRenderable,
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
  Viewport,
  EngineError,
  SpriteAnimateRenderable,
};

export type { IRenderable };
