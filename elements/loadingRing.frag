#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 toCenter = vec2(0.5)-st;
    float angle = PI-atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    float r = 0.5;
    float thick = 0.1;
    float ring = smoothstep(r-thick/2.-0.01, r-thick/2.+0.01, radius) - smoothstep(r+thick/2.-0.01, r+thick/2.+0.01, radius);

    color += vec3(ring*mod(angle-u_time*5., TWO_PI)/PI);

    gl_FragColor = vec4(color,1.0);
}