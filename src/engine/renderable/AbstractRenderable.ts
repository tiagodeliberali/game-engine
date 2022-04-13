import {
  Camera,
  Color,
  Transform,
  TransformDef,
  VertexBuffer,
} from "../graphics";
import { IRenderable } from ".";
import { AbstractShader } from "../graphics/AbstractShader";

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
    this.color = Color.Black();
    this.trsMatrix = new Transform();
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
    return this.trsMatrix.setTransform(transform);
  }

  public unload() {
    // virtual method
  }
}
