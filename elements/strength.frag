#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sinCurve(float stx, float sty){
    // 将x坐标映射到[-2, 2]范围，显示多个周期
    float x = (stx - 0.5) * 2.2;
    
    // 计算sin值，并映射到[0, 1]范围显示
    float y = sin(x * PI + PI) * 0.1 + 0.5;
    
    return vec3(step(0.0, sty-y));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 curve = sinCurve(st.y, st.x);
    gl_FragColor = vec4(vec3(curve), 1.0);
}