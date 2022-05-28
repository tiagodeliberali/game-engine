import {
  Vec2d,
  Color,
  ColorDef,
  Transform,
  TransformDef,
  EngineError,
} from "..";
import { IRenderable } from ".";
import { AbstractShader } from "../graphics/AbstractShader";
import { Camera, DrawingResources } from "../core";

export abstract class AbstractRenderable<T extends AbstractShader>
  implements IRenderable
{
  shader: T | undefined;
  color: Color;
  trsMatrix: Transform;
  currentDirection: Vec2d = new Vec2d(1, 0);
  freezeCamera: boolean;
  protected frozenCamera: Camera | undefined;
  forceDraw: boolean;

  constructor() {
    this.color = Color.White();
    this.trsMatrix = Transform.BuldDefault();
    this.freezeCamera = false;
    this.forceDraw = false;
  }

  abstract update(): void;
  abstract load(): void;
  abstract init(): void;
  abstract draw(resources: DrawingResources): void;

  getActivatedShader(resources: DrawingResources) {
    if (this.shader === undefined) {
      throw new EngineError(
        AbstractRenderable.name,
        "Cannot run draw with undefined shader"
      );
    }

    const camera = this.getCamera(resources.camera);

    this.shader.setCameraAndLight(camera, resources.lights);

    this.shader.activate(
      this.color,
      this.trsMatrix.getTrsMatrix(),
      camera.getCameraMatrix()
    );

    return this.shader;
  }

  getCamera(camera: Camera): Camera {
    if (!this.freezeCamera) {
      this.frozenCamera = undefined;
      return camera;
    }

    if (this.frozenCamera === undefined) {
      this.frozenCamera = camera.clone();
    }

    return this.frozenCamera;
  }

  setFrozenCamera(value: boolean) {
    this.freezeCamera = value;
    return this;
  }

  getTransform() {
    return this.trsMatrix;
  }

  getCurrentDirection() {
    return this.currentDirection;
  }

  setTransform(transform: TransformDef) {
    const newTransformDef: TransformDef = {
      position:
        transform.position === undefined
          ? this.trsMatrix.getPosition()
          : transform.position,
      rotationInDegree:
        transform.rotationInDegree === undefined
          ? this.trsMatrix.getRotationInDegree()
          : transform.rotationInDegree,
      scale:
        transform.scale === undefined
          ? this.trsMatrix.getScale()
          : transform.scale,
    };

    this.currentDirection = this.currentDirection.rotateInDegree(
      (newTransformDef.rotationInDegree || 0) -
        this.trsMatrix.getRotationInDegree()
    );
    this.trsMatrix = Transform.Build(newTransformDef);

    return this;
  }

  setColor(colorDef: ColorDef) {
    this.color = Color.FromColorDef(colorDef);

    return this;
  }

  addToPosition(vector: Vec2d) {
    this.trsMatrix = this.trsMatrix.addToPosition(vector);
  }

  addToRotationInDegree(value: number) {
    this.trsMatrix = this.trsMatrix.addToRotationInDegree(value);
    this.currentDirection = this.currentDirection.rotateInDegree(value);
  }

  factorToScale(vector: Vec2d) {
    this.trsMatrix = this.trsMatrix.factorToScale(vector);
  }

  unload() {
    // virtual method
  }
}
