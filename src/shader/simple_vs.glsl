attribute vec3 aVertexPosition;  // Expects one vertex position
uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;


void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass vertex to the fragment shader
    gl_Position = uCameraXformMatrix * uModelXformMatrix * vec4(aVertexPosition, 1.0);
}
