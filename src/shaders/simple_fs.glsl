precision mediump float;

uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor;  // this is shared globally
uniform float uGlobalAmbientIntensity;  // this is shared globally

#define kGLSLuLightArraySize #LIGHT_ARRAY_SIZE // Replaced by a config number on TextureShader

struct Light  {
    vec3 Position;   // in pixel space!
    vec4 Color;
    float Near;     // distance in pixel space
    float Far;     // distance in pixel space
    float Intensity;
    bool  IsOn;
};
uniform Light uLights[kGLSLuLightArraySize];  // Maximum array of lights this shader supports

vec4 LightEffect(Light lgt)
{
    vec4 result = vec4(0);
    float atten = 0.0;
    float dist = length(lgt.Position.xyz - gl_FragCoord.xyz);
    if (dist <= lgt.Far) {
        if (dist <= lgt.Near)
            atten = 1.0;  //  no attenuation
        else {
            // simple quadratic drop off
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); // blended attenuation
        }   
    }
    result = atten * lgt.Intensity * lgt.Color;
    return result;
}

void main(void) {
    vec4 lgtResults = uGlobalAmbientIntensity * uGlobalAmbientColor;

    for (int i=0; i<kGLSLuLightArraySize; i++) { 
        if (uLights[i].IsOn) { 
            lgtResults +=  LightEffect(uLights[i]);
        }
    }

    gl_FragColor = uPixelColor * lgtResults;
    
}