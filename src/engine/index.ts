import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import { Renderable } from "./graphics/Renderable";
import { Camera } from "./graphics/Camera";
import { Color } from "./graphics/Color";
import { SceneDef } from "./Scene";
import { GameEngine } from "./GameEngine";

export {
  getGL,
  initGL,
  clearCanvas as limparTela,
  Renderable as Bloco,
  Camera,
  Color,
  Vec2d,
  GameEngine,
};

export type { SceneDef };
