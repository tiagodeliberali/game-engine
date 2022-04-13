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
import { Audio, Texture, ResourceComponent } from "./resources";
import { EngineError } from "./EngineError";
import { GameObject, Behavior } from "./behaviors";
import { IComponent } from "./behaviors/IComponent";

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
  ResourceComponent,
  Behavior,
};

export type { IRenderable, TransformDef, IComponent };
