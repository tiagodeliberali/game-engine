import { Transform, Vec2d, IComponent } from "..";
import { getResourceManager } from "../resources";
import { GameObjectHelper } from ".";
import { ITransformable, TransformDef } from "..";
import { DrawingResources } from "../core";
import { Light } from "../graphics";

export class GameObject implements IComponent, ITransformable {
  private transform: Transform;
  private components: IComponent[] = [];
  private currentDirection: Vec2d = new Vec2d(1, 0);
  private index: Map<string, IComponent[]>;
  paused: boolean;
  private _visible: boolean;

  constructor() {
    this.transform = Transform.BuldDefault();
    this.paused = false;
    this._visible = true;
    this.index = new Map();
  }

  public get visible() {
    return this._visible;
  }

  public set visible(value: boolean) {
    this._visible = value;
    this.getAll<Light>(Light.name).forEach((light) => (light.isOn = value));
  }

  ///
  // ITransformable
  ///
  getTransform() {
    return this.transform;
  }

  getCurrentDirection() {
    return this.currentDirection;
  }

  setTransform(transform: TransformDef) {
    const newTransformDef: TransformDef = {
      position:
        transform.position === undefined
          ? this.transform.getPosition()
          : transform.position,
      rotationInDegree:
        transform.rotationInDegree === undefined
          ? this.transform.getRotationInDegree()
          : transform.rotationInDegree,
      scale:
        transform.scale === undefined
          ? this.transform.getScale()
          : transform.scale,
    };

    this.components.forEach((x) => {
      const transformable = x as unknown as ITransformable;
      if (transformable.addToPosition) {
        if (transform.position !== undefined) {
          transformable.addToPosition(
            transform.position.sub(this.transform.getPosition())
          );
        }

        // todo: it is wrong for IRenderables outside gameobject origin - missing position part
        if (transform.rotationInDegree !== undefined) {
          transformable.addToRotationInDegree(
            transform.rotationInDegree - this.transform.getRotationInDegree()
          );
        }

        if (transform.scale !== undefined) {
          transformable.factorToScale(
            new Vec2d(
              transform.scale.x / this.transform.getScale().x,
              transform.scale.y / this.transform.getScale().y
            )
          );
        }
      }
    });

    this.currentDirection = this.currentDirection.rotateInDegree(
      (newTransformDef.rotationInDegree || 0) -
        this.transform.getRotationInDegree()
    );
    this.transform = Transform.Build(newTransformDef);
  }

  addToPosition(vector: Vec2d) {
    this.components.forEach((x) => {
      const transformable = x as unknown as ITransformable;
      if (transformable.addToPosition) {
        transformable.addToPosition(vector);
      }
    });
    this.transform = this.transform.addToPosition(vector);
  }

  addToRotationInDegree(value: number) {
    this.components.forEach((x) => {
      const transformable = x as unknown as ITransformable;
      if (transformable.addToRotationInDegree) {
        transformable.addToRotationInDegree(value);
      }
    });
    this.currentDirection = this.currentDirection.rotateInDegree(value);
    this.transform = this.transform.addToRotationInDegree(value);
  }

  factorToScale(vector: Vec2d) {
    this.components.forEach((x) => {
      const transformable = x as unknown as ITransformable;
      if (transformable.factorToScale) {
        transformable.factorToScale(vector);
      }
    });
    this.transform = this.transform.factorToScale(vector);
  }

  ///
  // IComponent
  ///
  load() {
    this.components.forEach((item) => item.load());
  }

  init() {
    this.components.forEach((item) => item.init());
  }

  update() {
    !this.paused && this.components.forEach((item) => item.update());
  }

  draw(resources: DrawingResources) {
    this.visible && this.components.forEach((item) => item.draw(resources));
  }

  unload() {
    this.components.forEach((item) => item.unload());
  }

  ///
  // GameObject
  ///
  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  add(component: IComponent) {
    const items = this.index.get(component.constructor.name);
    this.index.set(
      component.constructor.name,
      (items || [])?.concat(component)
    );

    this.components.push(component);

    return new GameObjectHelper(this, component);
  }

  getLastComponent<T>(type: string): T | undefined {
    const typeArray = this.index.get(type);

    if (typeArray === undefined || typeArray?.length === 0) {
      return undefined;
    }

    return typeArray[typeArray.length - 1] as unknown as T;
  }

  getAll<T extends IComponent>(name: string): T[] {
    let boxes = this.index.get(name)?.map((x) => x as T) || [];

    this.components.forEach((item) => {
      if ((item as GameObject).getAll !== undefined) {
        boxes = boxes.concat((item as GameObject).getAll<T>(name));
      }
    });

    return boxes;
  }
}
