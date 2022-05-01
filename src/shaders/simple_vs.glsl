attribute vec3 aVertexPosition;

uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

// used for line drawing 
uniform float uPointSize;

void main(void) {
    gl_Position = uCameraXformMatrix * 
                    uModelXformMatrix * 
                    vec4(aVertexPosition, 1.0);

    // only use for line drawing
    gl_PointSize = uPointSize;
}
