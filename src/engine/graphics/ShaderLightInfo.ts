import { Camera } from "../core";
import { AbstractShader } from "./AbstractShader";
import { Light } from "./Light";

export class ShaderLightInfo {
  shader: AbstractShader;

  colorLocation: WebGLUniformLocation;
  positionLocation: WebGLUniformLocation;
  nearRadiusLocation: WebGLUniformLocation;
  farRadiusLocation: WebGLUniformLocation;
  intensityLocation: WebGLUniformLocation;
  isOnLocation: WebGLUniformLocation;

  constructor(shader: AbstractShader, index: number) {
    this.shader = shader;

    this.colorLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].Color"
    );
    this.positionLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].Position"
    );
    this.nearRadiusLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].Near"
    );
    this.farRadiusLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].Far"
    );
    this.intensityLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].Intensity"
    );
    this.isOnLocation = this.shader.getUniformLocation(
      "uLights[" + index + "].IsOn"
    );
  }

  loadToShader(camera: Camera, light: Light) {
    this.shader.gl.uniform1i(this.isOnLocation, light.isOn ? 1 : 0);

    if (light.isOn) {
      this.shader.gl.uniform4fv(
        this.colorLocation,
        light.color.getNormalizedArray()
      );

      const lightPosition = camera.convertWCtoDC(light.position);
      this.shader.gl.uniform3fv(this.positionLocation, lightPosition.toVec3());

      this.shader.gl.uniform1f(
        this.nearRadiusLocation,
        light.nearRadius * camera.getPixelsPerWCunits().x
      );
      this.shader.gl.uniform1f(
        this.farRadiusLocation,
        light.farRadius * camera.getPixelsPerWCunits().x
      );

      this.shader.gl.uniform1f(this.intensityLocation, light.intensity);
    }
  }

  switchOffLight() {
    this.shader.gl.uniform1i(this.isOnLocation, 0);
  }
}
