import { BoundingBox, GameObject } from ".";
import { ITransformable, Vec2d } from "..";
import { EngineError } from "../EngineError";
import { Behavior } from "./Behavior";
import { ColisionActions } from "./BoundingBox";
import { IComponent } from "./IComponent";

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
    const transformable = this.component as unknown as ITransformable;

    if (transformable.getTransform === undefined) {
      throw new EngineError(
        GameObjectHelper.name,
        "Cannot add bounding box to a component that does not implements ITransformable"
      );
    }

    const box = BoundingBox.withAction(
      transformable,
      tag,
      scale,
      actions && actions(this.component as unknown as T)
    );
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
