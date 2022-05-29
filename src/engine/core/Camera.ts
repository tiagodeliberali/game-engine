import { mat4, vec3 } from "gl-matrix";
import { Lerp2d } from "../behaviors";
import { Vec2d, Vec3d } from "../DataStructures";
import { Viewport } from "../graphics";
import { ITransformable } from "./ITransformable";
import { Transform, TransformDef } from "./Transform";

export class Camera implements ITransformable {
  private center: Vec2d;
  private size: Vec2d;
  private cameraMatrix: mat4;
  private viewport: Viewport;
  lerpPosition: Lerp2d | undefined;
  lerpScale: Lerp2d | undefined;
  pixelsPerWCunits: Vec2d = Vec2d.from(0, 0);
  WCunitsPerPixel: Vec2d = Vec2d.from(0, 0);
  originWC: Vec2d = Vec2d.from(0, 0);

  /**
   * Define a way to restrict usage of the camera over game elements. Whe the camera is tagged with 0, it means this camera is intended to display
   * all game objects. When you define a tag to a camera, this camera will only display elements that include its cameraTag.
   *
   * The definition of isInTag is bitwise, so cameraTag, in the game objects, can include as many cameras as it want to show.
   *
   * Eg:
   * camera1 = 1 (0b001)
   * camera2 = 2 (0b010)
   * camera3 = 4 (ob100)
   *
   * So, a game object with cameraTag 6 (0b110) will be displayed at cameras 2 and 3.
   * If the gameObject wants to be displayed on all cameras, need to define cameraTag as 7 (b111).
   */
  tag: number;

  constructor(center: Vec2d, size: Vec2d, viewport: Viewport) {
    this.center = center;
    this.size = size;
    this.cameraMatrix = mat4.create();
    this.viewport = viewport;

    this.configureCamera();
    this.tag = 0;
  }

  /**
   * ITransformable
   */
  getTransform(): Transform {
    return Transform.Build({
      position: this.center,
      scale: this.size,
    });
  }

  setTransform(transform: TransformDef) {
    if (transform.position !== undefined) {
      this.setCenter(transform.position);
    }

    if (transform.scale !== undefined) {
      this.setSize(transform.scale);
    }
  }

  getCurrentDirection() {
    return Vec2d.from(0, 0);
  }

  addToPosition(vector: Vec2d) {
    this.center = this.center.add(vector);
    this.configureCamera();
  }

  addToRotationInDegree() {
    // do nothing
  }

  factorToScale(vector: Vec2d) {
    this.size = this.size.multiply(vector);
    this.configureCamera();
  }

  /**
   * Camera
   */
  clone(): Camera {
    return new Camera(this.center, this.size, this.viewport.clone());
  }

  getCameraMatrix() {
    return this.cameraMatrix;
  }

  setCenter(center: Vec2d) {
    this.center = center;
    this.configureCamera();
  }

  setSize(size: Vec2d) {
    this.size = size;
    this.configureCamera();
  }

  panBy(vector: Vec2d) {
    this.lerpPosition = new Lerp2d(this.center, 50, 0.1);
    this.lerpPosition.setFinal(this.center.add(vector));
  }

  panTo(point: Vec2d) {
    this.lerpPosition = new Lerp2d(this.center, 50, 0.1);
    this.lerpPosition.setFinal(point);
  }

  zoomBy(zoom: number) {
    if (zoom > 0) {
      this.lerpScale = new Lerp2d(this.size, 50, 0.1);
      this.lerpScale.setFinal(Vec2d.from(zoom, zoom).multiply(this.size));
    }
  }

  zoomTowards(target: ITransformable, zoom: number) {
    const position = target.getTransform().getPosition();
    const delta = position.sub(this.center).scale(zoom - 1);
    this.panTo(this.center.sub(delta));
    this.zoomBy(zoom);
  }

  update() {
    if (this.lerpPosition) {
      this.lerpPosition.update();
      this.setCenter(this.lerpPosition.get());

      if (this.lerpPosition.cyclesLeft === 0) {
        this.lerpPosition = undefined;
      }
    }

    if (this.lerpScale) {
      this.lerpScale.update();
      this.setSize(this.lerpScale.get());

      if (this.lerpScale.cyclesLeft === 0) {
        this.lerpScale = undefined;
      }
    }
  }

  draw() {
    this.viewport.draw();
  }

  private configureCamera() {
    mat4.scale(
      this.cameraMatrix,
      mat4.create(),
      vec3.fromValues(2.0 / this.size.x, 2.0 / this.size.y, 1.0)
    );

    mat4.translate(
      this.cameraMatrix,
      this.cameraMatrix,
      vec3.fromValues(-this.center.x, -this.center.y, 0)
    );

    this.pixelsPerWCunits = Vec2d.from(
      this.viewport.size.x / this.size.x,
      this.viewport.size.y / this.size.y
    );

    this.WCunitsPerPixel = Vec2d.from(
      this.size.x / this.viewport.size.x,
      this.size.y / this.viewport.size.y
    );

    this.originWC = this.center.sub(this.size.scale(0.5));
  }

  isVisibleOnWC(position: Vec2d) {
    const tolerance = 0.1;
    return (
      this.originWC.x - this.size.x * tolerance < position.x &&
      this.originWC.y - this.size.y * tolerance < position.y &&
      this.originWC.x + this.size.x + this.size.x * tolerance > position.x &&
      this.originWC.y + this.size.y + this.size.y * tolerance > position.y
    );
  }

  isInTag(cameraTag: number): boolean {
    return this.tag === 0 || (this.tag & cameraTag) > 0;
  }

  /**
   * Coordinate system
   */
  convertDCtoWC(position: Vec2d) {
    const positionDC = this.getViewportPositionDC(position);

    const positionWC = positionDC.multiply(this.WCunitsPerPixel);
    return this.originWC.add(positionWC);
  }

  isInViewportDC(position: Vec2d) {
    const viewportSize = this.viewport.size;
    const positionDC = this.getViewportPositionDC(position);

    return (
      positionDC.x >= 0 &&
      positionDC.x < viewportSize.x &&
      positionDC.y >= 0 &&
      positionDC.y < viewportSize.y
    );
  }

  private getViewportPositionDC(position: Vec2d) {
    return position.sub(this.viewport.bottomLeftCorner);
  }

  convertWCtoDC(position: Vec3d) {
    const position2d = Vec2d.from(position.x, position.y);
    const wcPositionOnCamera = position2d.sub(this.originWC);
    const positionOnPixels = wcPositionOnCamera.multiply(this.pixelsPerWCunits);
    const result2d = this.viewport.bottomLeftCorner
      .add(positionOnPixels)
      .add(Vec2d.from(0.5, 0.5));

    return Vec3d.from(
      result2d.x,
      result2d.y,
      position.z * this.pixelsPerWCunits.x
    );
  }

  getPixelsPerWCunits() {
    return this.pixelsPerWCunits;
  }
}
