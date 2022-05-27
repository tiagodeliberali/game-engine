import { Color, TextureRenderable } from "..";
import { DrawingResources, IComponent } from "../core";
import { Vec2d } from "../DataStructures";
import { getUpdateIntervalInSeconds } from "../Loop";
import { getResourceManager } from "../resources";
import { getSystemAcceleration } from "./ParticleSystem";

export const defaultParticlePath = "/textures/particle.png";

export class Particle implements IComponent {
  texturePath: string;
  mRenderComponent: TextureRenderable;
  mVelocity: Vec2d;
  mAcceleration: Vec2d;
  mDrag: number;
  mDeltaColor: Color;
  mSizeDelta: number;
  mCyclesToLive: number;
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
    this.mCyclesToLive = life;
    this.initialWait = initialWait;

    this.texturePath = texturePath;
    this.mRenderComponent = TextureRenderable.build(texturePath)
      .setTransform({
        position: position,
        scale: initialSize,
      })
      .setColor(initialColor);

    // position control
    this.mVelocity = velocity;
    this.mAcceleration = getSystemAcceleration();
    this.mDrag = 0.95;

    // Color control
    this.initialColor = initialColor;
    this.finalColor = finalColor;
    this.mDeltaColor = Color.White();
    this.setFinalColor(finalColor);

    // Size control
    this.initialSize = initialSize;
    this.mSizeDelta = 0.95;
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
    this.mCyclesToLive = this.life;

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
    this.mVelocity = Vec2d.from(fx, fy);

    this.setSize(Vec2d.from(partcileSize, partcileSize));

    this.mRenderComponent
      .setTransform({
        position: position,
        scale: this.initialSize,
      })
      .setColor(this.initialColor);
  }

  setColor(color: Color) {
    this.mRenderComponent.color = color;
    return this;
  }

  setFinalColor(finalColor: Color) {
    this.mDeltaColor = finalColor.sub(this.initialColor);

    if (this.mCyclesToLive !== 0) {
      this.mDeltaColor = this.mDeltaColor.scale(1 / this.mCyclesToLive);
    }
  }

  setSize(size: Vec2d) {
    this.mRenderComponent.setTransform({ scale: size });
  }

  load() {
    getResourceManager().loadScene(this.texturePath);
  }

  init() {
    this.mRenderComponent.init();
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
    this.mRenderComponent.draw(resources);
  }

  update() {
    if (this.initialWait > 0) {
      this.initialWait--;
      return;
    }

    if (this.hasExpired()) {
      return;
    }

    this.mCyclesToLive--;
    const dt = getUpdateIntervalInSeconds();
    const transform = this.mRenderComponent.getTransform();

    // Symplectic Euler
    //    v += a * dt
    //    x += v * dt
    this.mVelocity = this.mVelocity
      .add(this.mAcceleration.scale(dt))
      .scale(this.mDrag);
    const position = transform.getPosition().add(this.mVelocity.scale(dt));

    // update color
    this.mRenderComponent.color = this.mRenderComponent.color.add(
      this.mDeltaColor
    );

    // update
    this.mRenderComponent.setTransform({
      scale: transform.getScale().scale(this.mSizeDelta),
      position: position,
    });
  }

  hasExpired() {
    return this.mCyclesToLive <= 0;
  }
}
