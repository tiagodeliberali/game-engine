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

  withBoundingBox(
    tag: string,
    scale?: Vec2d,
    actions?: (component: IComponent) => ColisionActions
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
      actions && actions(this.component)
    );
    this.gameObject.addBoundingBox(box);

    return this;
  }

  withBehavior(action: (component: IComponent) => void) {
    this.gameObject.add(
      new Behavior(() => {
        action(this.component);
      })
    );

    return this;
  }
}
