#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 3.14159265359

// --- 五角星有符号距离场函数 (SDF) ---
// 来自极客神人 Inigo Quilez 的经典算法
// p: 像素坐标, r: 外接圆半径, rf: 内外径比 (0.0~1.0)
float sdStar(in vec2 p, in float r, in float rf)
{
    // 定义五角星的几何常数
    const vec2 k1 = vec2(0.809016994375, -0.587785252292); // cos(18*PI/180), sin(18*PI/180)
    const vec2 k2 = vec2(-k1.x, k1.y);
    
    // 利用对称性，将计算限制在1/10个五角星区域
    p.x = abs(p.x);
    p -= 2.0 * max(dot(k1, p), 0.0) * k1;
    p -= 2.0 * max(dot(k2, p), 0.0) * k2;
    p.x = abs(p.x);
    
    // 计算像素到星形边缘的距离
    p.y -= r;
    vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0, 1);
    float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
    return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

// 二维旋转矩阵
mat2 rotate2d(float _angle){
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
}

vec3 star(in vec2 st, float angle, float radius){
    st = st * 2.0 - 1.0; // 范围变成 [-1.0, 1.0]

    // 旋转：让一个角正对着正上方 (36度 = PI / 5.0)
    vec2 pos = rotate2d( angle ) * st;

    // 计算五角星 SDF
    // 半径 0.6，内外径比约为 0.382 (黄金分割比，完美的五角星)
    float d = sdStar(pos, radius, 0.382);

    // 使用 smoothstep 进行抗锯齿处理，使边缘平滑
    float antialias = 2.0 / u_resolution.y; // 根据分辨率确定平滑过渡区域
    float pct = smoothstep(antialias, -antialias, d);
    
    return vec3(pct);
}

vec3 starFrame(in vec2 st, float angle, float radius, float thick){
    return star(st, angle, radius+thick*.5) - star(st, angle, radius-thick*.5);
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
    vec3 circle = circleFrame(st, vec2(0.5), 0.4, 0.03)-star(st, PI/5., 1.15);
	vec3 star = starFrame(st, PI/5., 0.65, 0.16);
    gl_FragColor = vec4(max(circle, star), 1.0);
}