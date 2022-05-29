import { DrawingResources } from ".";

export interface IComponent {
  load?: () => void;
  init?: () => void;
  update?: () => void;
  draw?: (resources: DrawingResources) => void;
  unload?: () => void;
}
