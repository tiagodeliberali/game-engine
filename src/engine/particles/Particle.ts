import { Color, TextureRenderable } from "..";
import { DrawingResources, IComponent } from "../core";
import { Vec2d } from "../DataStructures";
import { getUpdateIntervalInSeconds } from "../Loop";
import { getResourceManager } from "../resources";
import { getSystemAcceleration } from "./ParticleSystem";

export const defaultParticlePath = "/textures/particle.png";

export class Particle implements IComponent {
  texturePath: string;
  renderable: TextureRenderable;
  velocity: Vec2d;
  acceleration: Vec2d;
  drag: number;
  deltaColor: Color;
  sizeDelta: number;
  cyclesToLive: number;
  initialColor: Color;
  finalColor: Color;
  initialSize: Vec2d;
  life: number;
  initialWait: number;

  constructor(
    texturePath: string,
    position: Vec2d,
    life: number,
    initialColor: Color,
    finalColor: Color,
    initialSize: Vec2d,
    velocity: Vec2d,
    initialWait: number
  ) {
    // Life control
    this.life = life;
    this.cyclesToLive = life;
    this.initialWait = initialWait;

    this.texturePath = texturePath;
    this.renderable = TextureRenderable.build(texturePath)
      .setTransform({
        position: position,
        scale: initialSize,
      })
      .setColor(initialColor);

    // position control
    this.velocity = velocity;
    this.acceleration = getSystemAcceleration();
    this.drag = 0.95;

    // Color control
    this.initialColor = initialColor;
    this.finalColor = finalColor;
    this.deltaColor = Color.White();
    this.setFinalColor(finalColor);

    // Size control
    this.initialSize = initialSize;
    this.sizeDelta = 0.95;
  }

  static BuildRandom(position: Vec2d, initialWait: number, life: number) {
    // size of the particle
    const partcileSize = 0.2 + Math.random() * 0.5;

    const initialColor = Color.FromColorDef({
      red: 255,
      green: 0,
      blue: 0,
      alpha: 0.6,
    });

    // final color
    const fr = 255 * 3.5 + 255 * Math.random();
    const fg = 255 * 0.4 + 255 * 0.1 * Math.random();
    const fb = 255 * 0.3 + 255 * 0.1 * Math.random();
    const finalColor = Color.FromColorDef({
      red: fr,
      green: fg,
      blue: fb,
      alpha: 0.6,
    });

    // velocity on the particle
    const fx = 10 - 20 * Math.random();
    const fy = 10 * Math.random();
    const velocity = Vec2d.from(fx, fy);

    life = life * 0.8 + Math.random() * life * 0.4;
    const p = new Particle(
      defaultParticlePath,
      position,
      life,
      initialColor,
      finalColor,
      Vec2d.from(partcileSize, partcileSize),
      velocity,
      initialWait
    );

    return p;
  }

  recycle(position: Vec2d) {
    this.cyclesToLive = this.life;

    // size of the particle
    const partcileSize = 0.2 + Math.random() * 0.5;

    // final color
    const fr = 3.5 + Math.random();
    const fg = 0.4 + 0.1 * Math.random();
    const fb = 0.3 + 0.1 * Math.random();
    this.finalColor = Color.FromColorDef({
      red: fr,
      green: fg,
      blue: fb,
      alpha: 0.6,
    });

    // velocity on the particle
    const fx = 10 - 20 * Math.random();
    const fy = 10 * Math.random();
    this.velocity = Vec2d.from(fx, fy);

    this.setSize(Vec2d.from(partcileSize, partcileSize));

    this.renderable
      .setTransform({
        position: position,
        scale: this.initialSize,
      })
      .setColor(this.initialColor);
  }

  setColor(color: Color) {
    this.renderable.color = color;
    return this;
  }

  setFinalColor(finalColor: Color) {
    this.deltaColor = finalColor.sub(this.initialColor);

    if (this.cyclesToLive !== 0) {
      this.deltaColor = this.deltaColor.scale(1 / this.cyclesToLive);
    }
  }

  setSize(size: Vec2d) {
    this.renderable.setTransform({ scale: size });
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.renderable.init();
  }

  unload() {
    //
  }

  draw(resources: DrawingResources) {
    if (this.initialWait > 0) {
      return;
    }

    if (this.hasExpired()) {
      return;
    }

    // const gl = getGL();
    this.renderable.draw(resources);
  }

  update() {
    if (this.initialWait > 0) {
      this.initialWait--;
      return;
    }

    if (this.hasExpired()) {
      return;
    }

    this.cyclesToLive--;
    const dt = getUpdateIntervalInSeconds();
    const transform = this.renderable.getTransform();

    // Symplectic Euler
    //    v += a * dt
    //    x += v * dt
    this.velocity = this.velocity
      .add(this.acceleration.scale(dt))
      .scale(this.drag);
    const position = transform.getPosition().add(this.velocity.scale(dt));

    // update color
    this.renderable.color = this.renderable.color.add(this.deltaColor);

    // update
    this.renderable.setTransform({
      scale: transform.getScale().scale(this.sizeDelta),
      position: position,
    });
  }

  hasExpired() {
    return this.cyclesToLive <= 0;
  }
}
