import { Camera, Color, Transform, VertexBuffer } from "../graphics";
import { IRenderable } from ".";
import { AbstractShader } from "../graphics/AbstractShader";

export abstract class AbstractRenderable<T extends AbstractShader>
  implements IRenderable
{
  gl: WebGL2RenderingContext;
  shader: T;
  vertexBuffer: VertexBuffer;
  color: Color;
  trsMatrix: Transform;

  constructor(
    gl: WebGL2RenderingContext,
    shader: T,
    vertexBuffer: VertexBuffer
  ) {
    this.gl = gl;
    this.color = Color.Black();
    this.trsMatrix = new Transform();
    this.shader = shader;
    this.vertexBuffer = vertexBuffer;
  }

  abstract draw(_camera: Camera): void;

  public getTransform() {
    return this.trsMatrix;
  }

  public unload() {
    // virtual method
  }
}
