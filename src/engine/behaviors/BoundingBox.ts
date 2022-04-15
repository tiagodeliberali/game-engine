import { Vec2d } from "../DataStructures";
import { ITransformable } from "../graphics";
import { IComponent } from "./IComponent";

enum ColisionType {
  collideLeft = 1,
  collideRight = 2,
  collideTop = 4,
  collideBottom = 8,
  inside = 16,
  outside = 0,
}

export type ColisionActions = {
  onCollideStarted?: (other: ITransformable) => void;
  onColliding?: (other: ITransformable) => void;
  onCollideEnded?: (other: ITransformable) => void;
};

export class BoundingBox implements IComponent {
  width: number;
  height: number;
  targets: BoundingBox[] = [];
  owner: ITransformable;
  actions: ColisionActions;
  colisionList: ITransformable[] = [];

  constructor(
    owner: ITransformable,
    width: number,
    height: number,
    actions: ColisionActions
  ) {
    this.owner = owner;
    this.actions = actions;
    this.width = width;
    this.height = height;
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

  boundCollideStatus(otherBound: BoundingBox): ColisionType {
    let status = ColisionType.outside;

    if (this.intersectsBound(otherBound)) {
      if (otherBound.minX() < this.minX()) {
        status |= ColisionType.collideLeft;
      }

      if (otherBound.maxX() > this.maxX()) {
        status |= ColisionType.collideRight;
      }

      if (otherBound.minY() < this.minY()) {
        status |= ColisionType.collideBottom;
      }

      if (otherBound.maxY() > this.maxY()) {
        status |= ColisionType.collideTop;
      }

      if (status === ColisionType.outside) {
        status = ColisionType.inside;
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
    this.targets.forEach((target) => {
      if (target.intersectsBound(this)) {
        if (!this.colisionList.includes(target.owner)) {
          this.colisionList.push(target.owner);

          this.actions.onCollideStarted &&
            this.actions.onCollideStarted(target.owner);
        }

        this.actions.onColliding && this.actions.onColliding(target.owner);
      } else {
        if (this.colisionList.includes(target.owner)) {
          const index = this.colisionList.indexOf(target.owner, 0);
          if (index > -1) {
            this.colisionList.splice(index, 1);
          }

          this.actions.onCollideEnded &&
            this.actions.onCollideEnded(target.owner);
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
