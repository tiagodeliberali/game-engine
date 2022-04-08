attribute vec3 aVertexPosition;

uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

void main(void) {
    gl_Position = uCameraXformMatrix * 
                    uModelXformMatrix * 
                    vec4(aVertexPosition, 1.0);
}
