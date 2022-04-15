import { Camera, Transform, Vec2d } from "..";
import { getResourceManager } from "../resources";
import { IComponent } from ".";
import { ITransformable, TransformDef } from "../graphics";

export class GameObject implements IComponent, ITransformable {
  private readonly transform: Transform;
  private components: IComponent[] = [];

  constructor() {
    this.transform = Transform.BuldDefault();
  }

  getTransform() {
    return this.transform;
  }

  setTransform(transform: TransformDef) {
    if (transform.position !== undefined) {
      const positionChange = transform.position.sub(
        this.transform.getPosition()
      );
    }

    if (transform.rotationInDegree !== undefined) {
      const angleChange =
        transform.rotationInDegree - this.transform.getRotationInDegree();
    }
  }

  addToPosition(vector: Vec2d) {
    this.components.forEach((x) => {
      if ((x as unknown as ITransformable) !== undefined) {
        (x as unknown as ITransformable).addToPosition(vector);
      }
    });
  }

  addToRotationInDegree(value: number) {
    this.components.forEach((x) => {
      if ((x as unknown as ITransformable) !== undefined) {
        (x as unknown as ITransformable).addToRotationInDegree(value);
      }
    });
  }

  loadResource(path: string, extension?: string) {
    getResourceManager().loadScene(path, extension);
  }

  getResource<T>(path: string) {
    return getResourceManager().get<T>(path);
  }

  load() {
    this.components.forEach((item) => item.load());
  }

  init() {
    this.components.forEach((item) => item.init());
  }

  update() {
    this.components.forEach((item) => item.update());
  }

  draw(camera: Camera) {
    this.components.forEach((item) => item.draw(camera));
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
