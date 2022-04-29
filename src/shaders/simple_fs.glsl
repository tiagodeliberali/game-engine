precision mediump float;
uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor;  // this is shared globally
uniform float uGlobalAmbientIntensity;  // this is shared globally

void main(void) {
    gl_FragColor = uPixelColor * uGlobalAmbientIntensity *
                                 uGlobalAmbientColor;
}