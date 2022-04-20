import { Camera, Color, ColorDef, Transform, TransformDef } from "..";
import { IRenderable } from ".";
import { AbstractShader } from "../graphics/AbstractShader";
import { Vec2d } from "..";

export abstract class AbstractRenderable<T extends AbstractShader>
  implements IRenderable
{
  shader: T | undefined;
  color: Color;
  trsMatrix: Transform;
  currentDirection: Vec2d = new Vec2d(1, 0);

  constructor() {
    this.color = Color.White();
    this.trsMatrix = Transform.BuldDefault();
  }

  abstract update(): void;
  abstract load(): void;
  abstract init(): void;
  abstract draw(_camera: Camera): void;

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
    this.color.set(colorDef);

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
