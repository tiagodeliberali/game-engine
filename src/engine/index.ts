import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import {
  Camera,
  Color,
  TransformDef,
  Viewport,
  Transform,
  ITransformable,
} from "./graphics";
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
import { Audio, Texture, ResourceComponent } from "./resources";
import { EngineError } from "./EngineError";
import {
  GameObject,
  Behavior,
  walk2d,
  rotate,
  moveTowardsCurrentDirection,
  BoundingBox,
  ColisionStatus,
} from "./behaviors";
import { IComponent } from "./behaviors";

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
  walk2d,
  SimplifiedScene,
  Transform,
  rotate,
  moveTowardsCurrentDirection,
  BoundingBox,
  ColisionStatus,
};

export type { IRenderable, TransformDef, IComponent, ITransformable };
