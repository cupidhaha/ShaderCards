#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;

vec3 sinCurve(float stx, float sty){
    // 将x坐标映射到[-2, 2]范围，显示多个周期
    float x = (stx - 0.5) * 2.2;
    
    // 计算sin值，并映射到[0, 1]范围显示
    float y = sin(x * PI + PI) * 0.1 + 0.5;
    
    return vec3(step(0.0, sty-y));
}

vec3 sinSlim(float stx, float sty, float posy, float thick){
    // 将x坐标映射到[-2, 2]范围，显示多个周期
    float x = (stx - 0.5) * 2.2;
    
    // 计算sin值，并映射到[0, 1]范围显示
    float y = sin(x * PI + PI) * 0.1 + posy;
    
    return 1.0 - vec3(step(thick, abs(sty-y)));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float thick = 0.04;
    vec3 curve = sinSlim(st.y, st.x, 0.5, thick)
        + sinSlim(st.y, st.x, 0.35, thick)
        + sinSlim(st.y, st.x, 0.65, thick);
    gl_FragColor = vec4(vec3(curve), 1.0);
}