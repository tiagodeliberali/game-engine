import { mat4 } from "gl-matrix";
import {
  getGlobalAmbientColor,
  getGlobalAmbientIntensity,
  getMaxLightSourceNumber,
  Light,
  VertexBuffer,
} from ".";
import { Camera, Color, getGL } from "..";
import { EngineError } from "../EngineError";
import { ShaderLightInfo } from "./ShaderLightInfo";

export abstract class AbstractShader {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  vertexPositionBuffer: VertexBuffer;
  pixelColorLocation: WebGLUniformLocation;
  globalAmbientColorLocation: WebGLUniformLocation;
  globalAmbientIntensityLocation: WebGLUniformLocation;
  modelMatrixLocation: WebGLUniformLocation;
  cameraXformMatrixLocation: WebGLUniformLocation;

  private camera: Camera | undefined;
  private lights: Light[] = [];
  shaderLightInfoList: ShaderLightInfo[] = [];

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = getGL();

    this.program = this.compileProgram(
      vertexShaderSource,
      fragmentShaderSource.replace(
        "#LIGHT_ARRAY_SIZE",
        getMaxLightSourceNumber().toString()
      )
    );

    this.vertexPositionBuffer = new VertexBuffer(
      this.getAttribLocation("aVertexPosition"),
      3
    );

    this.pixelColorLocation = this.getUniformLocation("uPixelColor");
    this.globalAmbientColorLocation = this.getUniformLocation(
      "uGlobalAmbientColor"
    );
    this.globalAmbientIntensityLocation = this.getUniformLocation(
      "uGlobalAmbientIntensity"
    );

    this.modelMatrixLocation = this.getUniformLocation("uModelXformMatrix");
    this.cameraXformMatrixLocation =
      this.getUniformLocation("uCameraXformMatrix");

    for (let i = 0; i < getMaxLightSourceNumber(); i++) {
      const info = new ShaderLightInfo(this, i);
      this.shaderLightInfoList.push(info);
    }
  }

  setCameraAndLight(camera: Camera, light: Light[]) {
    this.camera = camera;
    this.lights = light;
  }

  drawExtension() {
    //virtual method
  }

  draw(pixelColor: Color, trsMatrix: mat4, cameraMatrix: mat4) {
    this.gl.useProgram(this.program);

    this.gl.uniform4fv(
      this.pixelColorLocation,
      pixelColor.getNormalizedArray()
    );
    this.gl.uniform4fv(
      this.globalAmbientColorLocation,
      getGlobalAmbientColor().getNormalizedArray()
    );
    this.gl.uniform1f(
      this.globalAmbientIntensityLocation,
      getGlobalAmbientIntensity()
    );
    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, trsMatrix);
    this.gl.uniformMatrix4fv(
      this.cameraXformMatrixLocation,
      false,
      cameraMatrix
    );

    if (this.camera !== undefined) {
      for (let i = 0; i < this.lights.length; i++) {
        this.shaderLightInfoList[i].loadToShader(this.camera, this.lights[i]);
      }
      for (
        let i = this.lights.length;
        i < this.shaderLightInfoList.length;
        i++
      ) {
        this.shaderLightInfoList[i].switchOffLight();
      }
    } else {
      // turn off all lights
      for (let i = 0; i < this.shaderLightInfoList.length; i++) {
        this.shaderLightInfoList[i].switchOffLight();
      }
    }

    this.drawExtension();

    this.vertexPositionBuffer.activate();
    this.vertexPositionBuffer.drawSquare();
  }

  public getUniformLocation(parameter: string) {
    const parameterLocation = this.gl.getUniformLocation(
      this.program,
      parameter
    );

    if (parameterLocation === null) {
      throw new EngineError(
        AbstractShader.name,
        `Could not find location for shader ${parameter} parameter`
      );
    }

    return parameterLocation;
  }

  protected getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }

  private compileProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram {
    const program = this.gl.createProgram();

    if (program === null) {
      throw new EngineError(
        AbstractShader.name,
        "Call to createProgram returned null"
      );
    }

    const vertexShader = this.createShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    );

    const fragmentShader = this.createShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new EngineError(AbstractShader.name, "Failed to link shader");
    }

    return program;
  }

  private createShader(shaderSource: string, shaderType: number): WebGLShader {
    const shader: WebGLShader | null = this.gl.createShader(shaderType);

    if (shader === null) {
      throw new EngineError(AbstractShader.name, "Failed to compile shader");
    }

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new EngineError(
        AbstractShader.name,
        "A shader compiling error occurred: " + this.gl.getShaderInfoLog(shader)
      );
    }

    return shader;
  }
}
