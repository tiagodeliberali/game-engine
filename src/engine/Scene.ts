export interface SceneDef {
  init: () => void;
  draw: () => void;
  update: () => void;
}
