import { Vec2d } from "../DataStructures";
import { ITransformable } from "../graphics";
import { IComponent } from "./IComponent";

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
    other: ITransformable,
    tag: string,
    status: ColisionStatus
  ) => void;
  onColliding?: (other: ITransformable, tag: string) => void;
  onCollideEnded?: (other: ITransformable, tag: string) => void;
};

export class BoundingBox implements IComponent {
  width: number;
  height: number;
  targets: BoundingBox[] = [];
  owner: ITransformable;
  actions?: ColisionActions;
  colisionList: ITransformable[] = [];
  tag: string;

  constructor(
    owner: ITransformable,
    tag: string,
    width: number,
    height: number,
    actions?: ColisionActions
  ) {
    this.owner = owner;
    this.tag = tag;
    this.actions = actions;
    this.width = width;
    this.height = height;
  }

  static from(owner: ITransformable, tag: string) {
    return new BoundingBox(
      owner,
      tag,
      owner.getTransform().getScale().x,
      owner.getTransform().getScale().y
    );
  }

  minX() {
    return this.owner.getTransform().getPosition().x - this.width / 2;
  }

  maxX() {
    return (
      this.owner.getTransform().getPosition().x - this.width / 2 + this.width
    );
  }

  minY() {
    return this.owner.getTransform().getPosition().y - this.height / 2;
  }

  maxY() {
    return (
      this.owner.getTransform().getPosition().y - this.height / 2 + this.height
    );
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

  add(box: BoundingBox) {
    this.targets.push(box);
  }

  load() {
    //
  }

  init() {
    //
  }

  update() {
    if (this.actions === undefined) {
      return;
    }

    this.targets.forEach((target) => {
      if (target.intersectsBound(this)) {
        if (!this.colisionList.includes(target.owner)) {
          this.colisionList.push(target.owner);

          this.actions!.onCollideStarted &&
            this.actions!.onCollideStarted(
              target.owner,
              target.tag,
              this.boundCollideStatus(target)
            );
        }

        this.actions!.onColliding &&
          this.actions!.onColliding(target.owner, target.tag);
      } else {
        if (this.colisionList.includes(target.owner)) {
          const index = this.colisionList.indexOf(target.owner, 0);
          if (index > -1) {
            this.colisionList.splice(index, 1);
          }

          this.actions!.onCollideEnded &&
            this.actions!.onCollideEnded(target.owner, target.tag);
        }
      }
    });
  }

  draw() {
    //
  }

  unload() {
    //
  }
}
