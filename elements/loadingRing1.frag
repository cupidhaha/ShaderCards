
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

// 切换极坐标
vec2 switchPolar(vec2 from, vec2 to){
	float a = from.x;
    float r = from.y;
    
    float a1 = to.x;
    float r1 = to.y;

    // 1. 将原始极坐标转换为笛卡尔坐标（相对于屏幕中心）
    float x = r * cos(a);
    float y = r * sin(a);

    // 2. 将新中心点也转换为笛卡尔坐标
    float x1 = r1 * cos(a1);
    float y1 = r1 * sin(a1);

    // 3. 平移到新中心：计算相对于新中心的笛卡尔坐标
    float dx = x - x1;
    float dy = y - y1;

    // 4. 转换回极坐标（相对于新中心）
    float newR = length(vec2(dx, dy));
    float newA = atan(dy, dx);

    // 现在 (newA, newR) 就是在新极坐标系中的坐标
    return vec2(newA, newR);
}

float circleInPolar(vec2 st, vec2 center, float radius){
    st = switchPolar(st, center);
    
    return 1.-smoothstep(radius-0.01, radius+0.01, st.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;
    st = vec2(angle, radius);
    
    float bigR = 0.5;
    const int count = 12;
    for(int i = 1; i <= count; i++){
        float splitAngle = TWO_PI - float(i) / float(count) * TWO_PI;
        vec2 circleCenter = vec2(splitAngle-u_time*2., bigR);
        color+=vec3(circleInPolar(st, circleCenter, 0.07) * (float(i) / float(count)));
    }
    
    gl_FragColor = vec4(color,1.0);
}
