import { Camera } from ".";
import { Light } from "../graphics";

export class DrawingResources {
  camera: Camera;
  lights: Light[];

  constructor(camera: Camera, lights: Light[]) {
    this.camera = camera;
    this.lights = lights;
  }
}
