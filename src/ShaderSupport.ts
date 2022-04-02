import { getGL } from "./WebGLContext";
import { getGLVertexBuffer } from "./VertexBuffer";

function loadAndCompileShader(id: string, shaderType: number) {
  // Step A: Get the shader source from index.html
  const shaderText = document.getElementById(id);

  const shaderSource = shaderText?.firstChild!.textContent;

  // Step B: Create shader based on type: vertex or fragment
  const gl = getGL();
  const compiledShader: WebGLShader | null = gl.createShader(shaderType);

  // Step C: Compile the created shader
  gl.shaderSource(compiledShader!, shaderSource!);
  gl.compileShader(compiledShader!);

  // Step D: check for errors and return results (null if error)
  // The log info is how shader compilation errors are displayed.
  // This is useful for debugging the shaders.
  if (!gl.getShaderParameter(compiledShader!, gl.COMPILE_STATUS)) {
    throw new Error(
      "A shader compiling error occurred: " +
        gl.getShaderInfoLog(compiledShader!)
    );
  }
  return compiledShader;
}

let mCompiledShader: WebGLProgram;
let mVertexPositionRef: number;

export function initShader(vertexShaderID: string, fragmentShaderID: string) {
  const gl = getGL();

  // Step A: load and compile vertex and fragment shaders
  const vertexShader = loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER)!;
  const fragmentShader = loadAndCompileShader(
    fragmentShaderID,
    gl.FRAGMENT_SHADER
  )!;

  // Step B: Create and link the shaders into a program.
  mCompiledShader = gl.createProgram()!;
  gl.attachShader(mCompiledShader, vertexShader);
  gl.attachShader(mCompiledShader, fragmentShader);
  gl.linkProgram(mCompiledShader);

  // Step C: check for error
  if (!gl.getProgramParameter(mCompiledShader, gl.LINK_STATUS)) {
    throw new Error("Error linking shader");
    return null;
  }

  // Step D: Gets reference to aVertexPosition attribute in the shader
  mVertexPositionRef = gl.getAttribLocation(mCompiledShader, "aVertexPosition");
}

export function activate() {
  const gl = getGL();

  // Step A: identify the compiled shader to use
  gl.useProgram(mCompiledShader);

  // Step B: bind vertex buffer to attribute defined in vertex shader
  gl.bindBuffer(gl.ARRAY_BUFFER, getGLVertexBuffer());

  gl.vertexAttribPointer(
    mVertexPositionRef,
    3, // each element is a 3-float (x,y.z)
    gl.FLOAT, // data type is FLOAT
    false, // if the content is normalized vectors
    0, // number of bytes to skip in between elements
    0
  ); // offsets to the first element

  gl.enableVertexAttribArray(mVertexPositionRef);
}
