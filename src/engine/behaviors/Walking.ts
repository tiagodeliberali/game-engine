import { Vec2d } from "../DataStructures";
import { BoundingBox, ColisionStatus, GameObject, ITransformable } from "..";
import { isKeyPressed, Keys } from "../input";

export enum Movement {
  up = 1,
  down = 2,
  left = 4,
  right = 8,
  idle = 0,
}

export function walk2d(
  gameObject: GameObject,
  speed: number,
  onUpdate?: (isWalking: Movement) => void
) {
  const scaledSpeed = speed * gameObject.getTransform().getHorizontalScale();
  let movement = Movement.idle;

  if (isKeyPressed(Keys.Left)) {
    gameObject.addToPosition(new Vec2d(-scaledSpeed, 0));
    movement |= Movement.left;
  } else if (isKeyPressed(Keys.Right)) {
    gameObject.addToPosition(new Vec2d(scaledSpeed, 0));
    movement |= Movement.right;
  }

  if (isKeyPressed(Keys.Up)) {
    gameObject.addToPosition(new Vec2d(0, scaledSpeed));
    movement |= Movement.up;
  } else if (isKeyPressed(Keys.Down)) {
    gameObject.addToPosition(new Vec2d(0, -scaledSpeed));
    movement |= Movement.down;
  }

  onUpdate && onUpdate(movement);
}

export function moveTowardsCurrentDirection(
  transform: ITransformable,
  speed: number
) {
  const scaledSpeed = speed * transform.getTransform().getHorizontalScale();
  const velocityVector = transform.getCurrentDirection().scale(scaledSpeed);
  transform.addToPosition(velocityVector);
}

export function rotate(
  origin: ITransformable,
  target: ITransformable,
  speed: number
) {
  let movimentVector = origin
    .getTransform()
    .getPosition()
    .sub(target.getTransform().getPosition());
  if (movimentVector.length() < Number.MIN_VALUE) {
    return;
  }

  movimentVector = movimentVector.normalize();

  // compute the angle to rotate
  const transformableDirection = origin.getCurrentDirection();
  let cosTheta = movimentVector.dot(transformableDirection);
  if (cosTheta < -0.999) {
    return;
  }

  // fix theta (not sure why yet...)
  if (cosTheta > 1) {
    cosTheta = 1;
  } else {
    if (cosTheta < -1) {
      cosTheta = -1;
    }
  }

  // compute whether to rotate clockwise, or counterclockwise
  const crossResult = movimentVector.cross(transformableDirection);
  let angleToRotate = Math.acos(cosTheta);
  if (crossResult < 0) {
    angleToRotate = -angleToRotate;
  }

  // rotate the facing direction with the angle and rate
  angleToRotate *= speed;
  origin.addToRotationInDegree(angleToRotate);
}

export function clampAtBoundary(border: BoundingBox, target: BoundingBox) {
  const status = border.boundCollideStatus(target);

  if (status !== ColisionStatus.inside) {
    const center = border.getPosition();
    const size = border.getScale();

    const targetSize = target.getScale();
    let { x, y } = target.getPosition();

    if ((status & ColisionStatus.collideTop) !== 0) {
      y = center.y + size.y / 2 - targetSize.y / 2;
    }
    if ((status & ColisionStatus.collideBottom) !== 0) {
      y = center.y - size.y / 2 + targetSize.y / 2;
    }
    if ((status & ColisionStatus.collideRight) !== 0) {
      x = center.x + size.x / 2 - targetSize.x / 2;
    }
    if ((status & ColisionStatus.collideLeft) !== 0) {
      x = center.x - size.x / 2 + targetSize.x / 2;
    }

    target.owner.setTransform({ position: Vec2d.from(x, y) });
  }
  return status;
}

export function panWith(follower: BoundingBox, target: BoundingBox) {
  const status = follower.boundCollideStatus(target);

  if (status !== ColisionStatus.inside) {
    const position = target.getPosition();
    const scale = target.getScale();

    const followerSize = follower.getScale();
    let { x, y } = follower.getPosition();

    if ((status & ColisionStatus.collideTop) !== 0) {
      y = position.y + scale.y / 2 - followerSize.y / 2;
    }
    if ((status & ColisionStatus.collideBottom) !== 0) {
      y = position.y - scale.y / 2 + followerSize.y / 2;
    }
    if ((status & ColisionStatus.collideRight) !== 0) {
      x = position.x + scale.x / 2 - followerSize.x / 2;
    }
    if ((status & ColisionStatus.collideLeft) !== 0) {
      x = position.x - scale.x / 2 + followerSize.x / 2;
    }

    follower.owner.setTransform({ position: Vec2d.from(x, y) });
  }
}
