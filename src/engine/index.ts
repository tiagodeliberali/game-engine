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
  LineRenderable,
  LineRenderableFormats,
  IRenderable,
  AnimationType,
  TileMap,
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
import { Particle, ParticleSet } from "./particles";

export {
  getGL,
  initGL,
  clearCanvas,
  Renderable,
  LineRenderable,
  LineRenderableFormats,
  TextureRenderable,
  TileMap,
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
  Particle,
  ParticleSet,
};

export type { IRenderable, TransformDef, IComponent, ITransformable, ColorDef };
