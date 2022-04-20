import { Camera, Transform, Vec2d } from "..";
import { getResourceManager } from "../resources";
import { IComponent } from ".";
import { ITransformable, TransformDef } from "../graphics";

export class GameObject implements IComponent, ITransformable {
  private transform: Transform;
  private components: IComponent[] = [];
  private currentDirection: Vec2d = new Vec2d(1, 0);
  paused: boolean;
  visible: boolean;

  constructor() {
    this.transform = Transform.BuldDefault();
    this.paused = false;
    this.visible = true;
  }

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

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  pause() {
    this.paused = true;
  }

  load() {
    this.components.forEach((item) => item.load());
  }

  init() {
    this.components.forEach((item) => item.init());
  }

  update() {
    !this.paused && this.components.forEach((item) => item.update());
  }

  draw(camera: Camera) {
    this.visible && this.components.forEach((item) => item.draw(camera));
  }

  unload() {
    this.components.forEach((item) => item.unload());
  }

  add(component: IComponent) {
    this.components.push(component);
  }

  getFirst<T extends IComponent>(): T | undefined {
    const result = this.components.filter((x) => (x as T) !== undefined);
    return result.length > 0 ? (result[0] as T) : undefined;
  }

  static FromComponent(renderable: IComponent): IComponent {
    const gameObject = new GameObject();
    gameObject.add(renderable);

    return gameObject;
  }
}
