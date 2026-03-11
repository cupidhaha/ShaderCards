// sakura
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sakura(vec2 st){
    // 极坐标
    float r = length(st);
    float a = atan(st.y, st.x);
    float n = 5.;
        
    // |cos| 形式会产生更饱满的花瓣
    float shape = 0.35 * (0.55 + 0.6 * abs(cos(n * a * 0.5)));
    // float shape = 0.25 * (1.0 + 0.5 * cos(5.0 * a));
    
    float petalCenter = floor(a * n / TWO_PI + 0.5) * (TWO_PI / n);
    float angleToCenter = abs(a - petalCenter);
    
    // 在花瓣中间添加凹陷（缺口）
    float notchDepth = 0.08; // 缺口深度
    float notchWidth = 0.3;   // 缺口宽度
    
    // 缺口影响范围：只在花瓣中心附近
    float notchFactor = 1.0 - notchDepth * exp(-angleToCenter * angleToCenter * 20.0 / (notchWidth * notchWidth));
    
    // 应用缺口
    shape = shape * notchFactor;
    
    return smoothstep(r-0.005, r+0.005, shape);
}

vec3 circle(in vec2 st, in vec2 center, float radius){
    float dis = distance(st, center);
    float pct = 1. - smoothstep(radius,radius+0.01, dis);
    return vec3(pct);
}

vec3 circleFrame(in vec2 st, in vec2 center, float radius, float thick){
    return circle(st, center, radius+thick*.5)-circle(st, center, radius-thick*.5);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 坐标变换
    st = st - vec2(0.5);
    st.x *= u_resolution.x / u_resolution.y;
    
    float sakura = sakura(st);
    vec3 color = vec3(sakura) - circleFrame(st, vec2(0.), 0.055, 0.028) + circleFrame(st, vec2(0.), 0.47, 0.03);
    gl_FragColor = vec4(color, 1.0);
}