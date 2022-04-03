import { mat4, vec3 } from "gl-matrix";

type TransformDef = {
  position: number[];
  rotationInDegree: number;
  scale: number[];
};

export class Transform {
  private position: number[] = [0, 0];
  private rotation: number;
  private scale: number[] = [1, 1];

  constructor() {
    this.rotation = 0;
  }

  public setTransform(transformDef: TransformDef) {
    this.setPosition(transformDef.position[0], transformDef.position[1]);
    this.setRotationInDegree(transformDef.rotationInDegree);
    this.setScale(transformDef.scale[0], transformDef.scale[1]);
  }

  public setPosition(horizontal: number, vertical: number) {
    this.position = [horizontal, vertical];
  }

  public setScale(horizontal: number, vertical: number) {
    this.scale = [horizontal, vertical];
  }

  public setRotationInRad(rotationInRadians: number) {
    this.rotation = rotationInRadians;
    while (this.rotation > 2 * Math.PI) {
      this.rotation -= 2 * Math.PI;
    }
  }

  public setRotationInDegree(rotationInDegree: number) {
    this.setRotationInRad((rotationInDegree * Math.PI) / 180.0);
  }

  public getTrsMatrix() {
    const trsMatrix = mat4.create();

    mat4.translate(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.position[0], this.position[1], 0.0)
    );

    mat4.rotateZ(trsMatrix, trsMatrix, this.rotation);

    mat4.scale(
      trsMatrix,
      trsMatrix,
      vec3.fromValues(this.scale[0], this.scale[1], 1.0)
    );

    return trsMatrix;
  }
}
