import { BoundingBox, GameObject } from ".";
import { IComponent, ITransformable, TransformDef, Vec2d } from "..";
import {
  PhysicsSettings,
  RigidCircle,
  RigidRectangle,
  RigidShape,
} from "../physics";
import { Behavior } from "./Behavior";
import { ColisionActions } from "./BoundingBox";

export class GameObjectHelper {
  gameObject: GameObject;
  component: IComponent;
  lastRigidShape?: RigidShape;

  constructor(gameObject: GameObject, component: IComponent) {
    this.gameObject = gameObject;
    this.component = component;
  }

  getComponent<T>() {
    return this.component as unknown as T;
  }

  withRigidRectangle(scale: Vec2d, phisicsSettings: PhysicsSettings) {
    this.lastRigidShape = new RigidRectangle(this.gameObject, scale).setPhysics(
      phisicsSettings
    );
    this.gameObject.add(this.lastRigidShape);

    return this;
  }

  withRigidCircle(radius: number, phisicsSettings: PhysicsSettings) {
    this.lastRigidShape = new RigidCircle(this.gameObject, radius).setPhysics(
      phisicsSettings
    );
    this.gameObject.add(this.lastRigidShape);

    return this;
  }

  withBoundingBox(
    tag: string,
    scale?: Vec2d,
    actions?: (helper: GameObjectHelper) => ColisionActions
  ) {
    const box = BoundingBox.withAction(
      this.gameObject,
      tag,
      scale,
      actions && actions(this)
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

  withBehavior(action: (helper: GameObjectHelper) => void) {
    this.gameObject.add(
      new Behavior(() => {
        action(this);
      })
    );

    return this;
  }

  setTransform(def: TransformDef) {
    this.gameObject.setTransform(def);

    return this;
  }
}
