import { Vec2d } from "../DataStructures";
import {
  GameObject,
  isDebugMode,
  LineRenderable,
  LineRenderableFormats,
} from "..";
import { DrawingResources, IComponent } from "../core";

export enum ColisionStatus {
  collideLeft = 1,
  collideRight = 2,
  collideTop = 4,
  collideBottom = 8,
  inside = 16,
  outside = 0,
}

export type ColisionActions = {
  onCollideStarted?: (
    other: GameObject,
    tag: string,
    status: ColisionStatus
  ) => void;
  onColliding?: (other: GameObject, tag: string) => void;
  onCollideEnded?: (other: GameObject, tag: string) => void;
};

export class BoundingBox implements IComponent {
  private scale: Vec2d = Vec2d.from(1, 1);
  private debugBox: LineRenderable | undefined;
  owner: GameObject;
  tag: string;
  actions?: ColisionActions;
  active: boolean;

  private constructor(
    owner: GameObject,
    tag: string,
    actions?: ColisionActions
  ) {
    this.owner = owner;
    this.tag = tag;
    this.actions = actions;
    this.active = true;

    if (isDebugMode()) {
      this.debugBox = LineRenderable.build(
        LineRenderableFormats.box()
      ).setColor({
        red: 255,
        green: 255,
        blue: 255,
        alpha: 0.3,
      });
    }
  }

  setScale(vector: Vec2d) {
    this.scale = vector;
  }

  static from(owner: GameObject, tag: string, scale?: Vec2d) {
    const box = new BoundingBox(owner, tag);
    scale && box.setScale(scale);
    return box;
  }

  static withAction(
    owner: GameObject,
    tag: string,
    scale?: Vec2d,
    actions?: ColisionActions
  ) {
    const box = new BoundingBox(owner, tag, actions);
    scale && box.setScale(scale);
    return box;
  }

  minX() {
    return this.getPosition().x - this.getScale().x / 2;
  }

  maxX() {
    return this.getPosition().x + this.getScale().x / 2;
  }

  minY() {
    return this.getPosition().y - this.getScale().y / 2;
  }

  maxY() {
    return this.getPosition().y + this.getScale().y / 2;
  }

  getPosition() {
    return this.owner.getTransform().getPosition();
  }

  getScale() {
    return this.owner.getTransform().getScale().multiply(this.scale);
  }

  containsPoint(point: Vec2d) {
    return (
      point.x > this.minX() &&
      point.x < this.maxX() &&
      point.y > this.minY() &&
      point.y < this.maxY()
    );
  }

  intersectsBound(otherBound: BoundingBox) {
    return (
      this.minX() < otherBound.maxX() &&
      this.maxX() > otherBound.minX() &&
      this.minY() < otherBound.maxY() &&
      this.maxY() > otherBound.minY()
    );
  }

  boundCollideStatus(otherBound: BoundingBox): ColisionStatus {
    let status = ColisionStatus.outside;

    if (this.intersectsBound(otherBound)) {
      if (otherBound.minX() < this.minX()) {
        status |= ColisionStatus.collideLeft;
      }

      if (otherBound.maxX() > this.maxX()) {
        status |= ColisionStatus.collideRight;
      }

      if (otherBound.minY() < this.minY()) {
        status |= ColisionStatus.collideBottom;
      }

      if (otherBound.maxY() > this.maxY()) {
        status |= ColisionStatus.collideTop;
      }

      if (status === ColisionStatus.outside) {
        status = ColisionStatus.inside;
      }
    }
    return status;
  }

  load() {
    const component = this.debugBox as IComponent;
    component && component.unload && component.unload();
  }

  init() {
    this.debugBox && this.debugBox.init();
  }

  update() {
    isDebugMode() &&
      this.debugBox &&
      this.debugBox.setTransform({
        position: this.getPosition(),
        scale: this.getScale(),
      });
  }

  draw(resources: DrawingResources) {
    isDebugMode() && this.debugBox && this.debugBox.draw(resources);
  }

  hasAction(): unknown {
    return (
      this.actions !== undefined &&
      (this.actions.onCollideEnded !== undefined ||
        this.actions.onCollideStarted !== undefined ||
        this.actions.onColliding !== undefined)
    );
  }
}
