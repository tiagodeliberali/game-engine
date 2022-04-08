attribute vec3 aVertexPosition;

attribute vec2 aTextureCoordinate; 
varying vec2 vTexCoord;

uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

void main(void) {
    gl_Position = uCameraXformMatrix *
                    uModelXformMatrix *
                    vec4(aVertexPosition, 1.0);

    vTexCoord = aTextureCoordinate;
}