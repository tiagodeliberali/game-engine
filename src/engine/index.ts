import { Vec2d } from "./DataStructures";
import {
  Viewport,
  initGL,
  clearCanvas,
  getGL,
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  setGlobalAmbientColor,
  setGlobalAmbientIntensity,
} from "./graphics";
import {
  Camera,
  Color,
  ColorDef,
  TransformDef,
  Transform,
  ITransformable,
  IComponent,
} from "./core";
import {
  SpriteRenderable,
  TextureRenderable,
  FontRenderable,
  Renderable,
  IRenderable,
  AnimationType,
} from "./renderable";
import { BasicScene, SimplifiedScene } from "./scene";
import { GameEngine } from "./GameEngine";
import { isKeyPressed, isKeyClicked, Keys } from "./input";
import { Audio, ResourceComponent } from "./resources";
import { EngineError } from "./EngineError";
import {
  GameObject,
  Behavior,
  walk2d,
  rotate,
  moveTowardsCurrentDirection,
  BoundingBox,
  ColisionStatus,
  GameObjectHelper,
} from "./behaviors";
import { isDebugMode } from "./Settings";
import { clampAtBoundary, panWith, Movement } from "./behaviors/Walking";

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
  Viewport,
  EngineError,
  SpriteRenderable,
  AnimationType,
  GameObject,
  ResourceComponent,
  Behavior,
  Movement,
  walk2d,
  clampAtBoundary,
  panWith,
  SimplifiedScene,
  Transform,
  rotate,
  moveTowardsCurrentDirection,
  BoundingBox,
  ColisionStatus,
  isDebugMode,
  GameObjectHelper,
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  setGlobalAmbientIntensity,
  setGlobalAmbientColor,
};

export type { IRenderable, TransformDef, IComponent, ITransformable, ColorDef };
