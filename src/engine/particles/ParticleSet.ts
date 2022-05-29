import { getGL, IComponent, Vec2d } from "..";
import { DrawingResources } from "../core";
import { Particle } from "./Particle";

export class ParticleSet implements IComponent {
  particles: Particle[] = [];
  position: Vec2d;
  cameraTag: number;

  constructor(position: Vec2d, quantity: number, groups: number, life: number) {
    this.position = position;
    this.cameraTag = 0;

    for (let i = 0; i < quantity; i++)
      this.particles.push(
        Particle.BuildRandom(position, (i % groups) * (life / groups), life)
      );
  }

  load() {
    this.particles.forEach((x) => x.load());
  }

  init() {
    this.particles.forEach((x) => x.init());
  }

  update() {
    this.particles.forEach((x) => {
      x.update();

      if (x.hasExpired()) {
        x.recycle(this.position);
      }
    });
  }

  draw(resources: DrawingResources) {
    if (!resources.camera.includeTag(this.cameraTag)) {
      return;
    }
    const gl = getGL();
    gl.blendFunc(gl.ONE, gl.ONE); // for additive blending!
    this.particles.forEach((x) => x.draw(resources));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
  }

  unload() {
    this.particles.forEach((x) => x.unload());
  }
}
