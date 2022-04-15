import {
  Camera,
  Color,
  Transform,
  TransformDef,
  VertexBuffer,
} from "../graphics";
import { IRenderable } from ".";
import { AbstractShader } from "../graphics/AbstractShader";
import { Vec2d } from "..";

export abstract class AbstractRenderable<T extends AbstractShader>
  implements IRenderable
{
  gl: WebGL2RenderingContext;
  shader: T | undefined;
  vertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;

  constructor(gl: WebGL2RenderingContext, vertexBuffer: VertexBuffer) {
    this.gl = gl;
    this.color = Color.White();
    this.trsMatrix = Transform.BuldDefault();
    this.vertexBuffer = vertexBuffer;
  }

  abstract update(): void;
  abstract load(): void;
  abstract init(): void;

  abstract draw(_camera: Camera): void;

  public getTransform() {
    return this.trsMatrix;
  }

  public setTransform(transform: TransformDef) {
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

    this.trsMatrix = Transform.Build(newTransformDef);
  }

  addToPosition(vector: Vec2d) {
    this.trsMatrix = this.trsMatrix.addToPosition(vector);
  }

  addToRotationInDegree(value: number) {
    this.trsMatrix = this.trsMatrix.addToRotationInDegree(value);
  }

  public unload() {
    // virtual method
  }
}
