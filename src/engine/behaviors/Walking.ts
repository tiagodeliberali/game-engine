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

// export function rotateObjPointTo(
//   origin: Transform,
//   target: Transform,
//   speed: number
// ) {
//   let result = origin.getPosition().sub(target.getPosition());
//   if (result.length() < Number.MIN_VALUE) {
//     return;
//   }

//   result = result.normalize();

//   // Step B: compute the angle to rotate
//   let fdir = this.getCurrentFrontDir();
//   let cosTheta = vec2.dot(dir, fdir);
//   if (cosTheta > 0.999999) {
//     // almost exactly the same direction
//     return;
//   }
//   // Step C: clamp the cosTheta to -1 to 1
//   // in a perfect world, this would never happen! BUT ...
//   if (cosTheta > 1) {
//     cosTheta = 1;
//   } else {
//     if (cosTheta < -1) {
//       cosTheta = -1;
//     }
//   }
//   // Step D: compute whether to rotate clockwise, or counterclockwise
//   let dir3d = vec3.fromValues(dir[0], dir[1], 0);
//   let f3d = vec3.fromValues(fdir[0], fdir[1], 0);
//   let r3d = [];
//   vec3.cross(r3d, f3d, dir3d);
//   let rad = Math.acos(cosTheta); // radian to roate
//   if (r3d[2] < 0) {
//     rad = -rad;
//   }
//   // Step E: rotate the facing direction with the angle and rate
//   rad *= rate; // actual angle need to rotate from Obj's front
//   vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
//   this.getXform().incRotationByRad(rad);
// }
