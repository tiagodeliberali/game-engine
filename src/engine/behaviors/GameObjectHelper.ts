import { BoundingBox, GameObject } from ".";
import { IComponent, ITransformable, Vec2d } from "..";
import { Behavior } from "./Behavior";
import { ColisionActions } from "./BoundingBox";

export class GameObjectHelper {
  gameObject: GameObject;
  component: IComponent;

  constructor(gameObject: GameObject, component: IComponent) {
    this.gameObject = gameObject;
    this.component = component;
  }

  getComponent<T>() {
    return this.component as unknown as T;
  }

  withBoundingBox<T>(
    tag: string,
    scale?: Vec2d,
    actions?: (component: T) => ColisionActions
  ) {
    const box = BoundingBox.withAction(
      this.gameObject,
      tag,
      scale,
      actions && actions(this.component as unknown as T)
    );

    const transformable = this.component as unknown as ITransformable;

    if (transformable.getTransform !== undefined) {
      box.setScale(
        transformable
          .getTransform()
          .getScale()
          .multiply(scale || Vec2d.from(1, 1))
      );
    }

    this.gameObject.add(box);

    return this;
  }

  withBehavior<T>(action: (component: T) => void) {
    this.gameObject.add(
      new Behavior(() => {
        action(this.component as unknown as T);
      })
    );

    return this;
  }
}
