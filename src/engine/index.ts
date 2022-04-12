import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import { Camera, Color, TransformDef, Viewport } from "./graphics";
import {
  SpriteRenderable,
  TextureRenderable,
  FontRenderable,
  Renderable,
  IRenderable,
  AnimationType,
} from "./renderable";
import { BasicScene } from "./scene";
import { GameEngine } from "./GameEngine";
import { isKeyPressed, isKeyClicked, Keys } from "./input";
import { Audio, Texture } from "./resources";
import { EngineError } from "./EngineError";
import { GameObject } from "./behaviors";

export {
  getGL,
  initGL,
  clearCanvas,
  Renderable,
  TextureRenderable,
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
  SpriteRenderable,
  AnimationType,
  GameObject,
};

export type { IRenderable, TransformDef };
