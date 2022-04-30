import { ShaderLib } from "./ShaderLib";
import { Viewport } from "./Viewport";
import { VertexBuffer } from "./VertexBuffer";
import { SimpleShader } from "./SimpleShader";
import { TextureShader } from "./TextureShader";
import { Texture } from "./Texture";
import { initGL, getGL, clearCanvas, getCanvasSize, DefaultGlName } from "./GL";
import {
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  setGlobalAmbientColor,
  setGlobalAmbientIntensity,
  getMaxLightSourceNumber,
  setMaxLightSourceNumber,
} from "./GraphicSettings";

import { Light } from "./Light";

export {
  ShaderLib,
  Viewport,
  VertexBuffer,
  SimpleShader,
  TextureShader,
  Texture,
  initGL,
  getGL,
  clearCanvas,
  getCanvasSize,
  DefaultGlName,
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  getMaxLightSourceNumber,
  setGlobalAmbientIntensity,
  setGlobalAmbientColor,
  setMaxLightSourceNumber,
  Light,
};
