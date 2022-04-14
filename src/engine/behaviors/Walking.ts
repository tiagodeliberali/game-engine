import { Transform } from "../graphics";
import { isKeyPressed, Keys } from "../input";
import { Behavior } from "./Behavior";

export function walk2d(
  transform: Transform,
  speed: number,
  onUpdate?: (isWalking: boolean) => void
) {
  return new Behavior(() => {
    const scaledSpeed = speed * transform.getHorizontalScale();

    let isWalking = false;
    if (isKeyPressed(Keys.Left)) {
      transform.addToHorizontalPosition(-scaledSpeed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Right)) {
      transform.addToHorizontalPosition(scaledSpeed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Up)) {
      transform.addToVerticalPosition(scaledSpeed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Down)) {
      transform.addToVerticalPosition(-scaledSpeed);
      isWalking = true;
    }

    onUpdate && onUpdate(isWalking);
  });
}
