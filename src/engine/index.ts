import { initGL, clearCanvas, getGL } from "./GL";
import { Vec2d } from "./DataStructures";
import { Renderable } from "./graphics/Renderable";
import { Camera } from "./graphics/Camera";
import { Color } from "./graphics/Color";

export {
  getGL,
  initGL,
  clearCanvas as limparTela,
  Renderable as Bloco,
  Camera,
  Color,
  Vec2d,
};
