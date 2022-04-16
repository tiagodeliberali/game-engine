import { Vec2d } from "../DataStructures";
import { ITransformable } from "../graphics";
import { isKeyPressed, Keys } from "../input";
import { Behavior } from "./Behavior";

export function walk2d(
  transform: ITransformable,
  speed: number,
  onUpdate?: (isWalking: boolean) => void
) {
  return new Behavior(() => {
    const scaledSpeed = speed * transform.getTransform().getHorizontalScale();

    let isWalking = false;
    if (isKeyPressed(Keys.Left)) {
      transform.addToPosition(new Vec2d(-scaledSpeed, 0));
      isWalking = true;
    }
    if (isKeyPressed(Keys.Right)) {
      transform.addToPosition(new Vec2d(scaledSpeed, 0));
      isWalking = true;
    }
    if (isKeyPressed(Keys.Up)) {
      transform.addToPosition(new Vec2d(0, scaledSpeed));
      isWalking = true;
    }
    if (isKeyPressed(Keys.Down)) {
      transform.addToPosition(new Vec2d(0, -scaledSpeed));
      isWalking = true;
    }

    onUpdate && onUpdate(isWalking);
  });
}

export function moveTowardsCurrentDirection(
  transform: ITransformable,
  speed: number
) {
  return new Behavior(() => {
    const scaledSpeed = speed * transform.getTransform().getHorizontalScale();
    const velocityVector = transform.getCurrentDirection().scale(scaledSpeed);
    transform.addToPosition(velocityVector);
  });
}

export function rotate(
  origin: ITransformable,
  target: ITransformable,
  speed: number
) {
  return new Behavior(() => {
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
  });
}
