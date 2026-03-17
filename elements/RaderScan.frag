// scan rader

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

float circleInPolar(vec2 st, vec2 center, float r){
    st = switchPolar(st, center);
    
    return 1.-smoothstep(r-0.01, r+0.01, st.y);
}

float ringInPolar(vec2 st, vec2 center, float r, float thick){
    return circleInPolar(st, center, r+thick/2.) - circleInPolar(st, center, r-thick/2.);
}

float arcInPolar(vec2 st, vec2 center, float radius, float thick, float startA, float endA){
    st = switchPolar(st, center);
    float a = st.x;
    float r = st.y;
    a = mod(a+TWO_PI, TWO_PI);
    
    float aRange = step(startA, a)-step(endA, a);
    float rRange = smoothstep(radius-thick/2.-0.01, radius-thick/2.+0.01, r) - smoothstep(radius+thick/2.-0.01, radius+thick/2.+0.01, r);
    return aRange * rRange;
}

// 等腰三角形,apex是顶点，baseLength是底边长度，height是垂线高度
vec3 triangle(in vec2 st, in float angle, vec2 apex, float baseLength, float height){
    // 将坐标平移到以顶点为原点的坐标系
    vec2 p = st - apex;
    
    // 围绕顶点旋转坐标（逆时针旋转angle弧度）
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec2 pRot;
    pRot.x = p.x * cosA - p.y * sinA;
    pRot.y = p.x * sinA + p.y * cosA;
    
    // 三角形范围：y从 -height 到 0
    float yMin = -height;
    float yMax = 0.0;
    
    // 判断是否在y范围内
    float inY = step(yMin, pRot.y) * step(pRot.y, yMax);
    
    // 计算插值系数 t (0在顶点，1在底边)
    float t = -pRot.y / height;  // pRot.y为负，所以取负号使其在0-1之间
    
    // 左右边界x坐标（在旋转后的坐标系中）
    // 顶点处宽度为0，底边处宽度为baseLength
    float halfBaseAtY = (baseLength / 2.0) * t;
    float leftX = -halfBaseAtY;
    float rightX = halfBaseAtY;
    
    // 判断是否在x范围内
    float inX = smoothstep(leftX-0.01, leftX+0.01, pRot.x) * smoothstep(pRot.x-0.01, pRot.x+0.01, rightX);
    
    // 在三角形内部
    float inside = inY * inX;
    return vec3(inside);
}

// st和center都是笛卡尔坐标系，将st转换为以center为圆心的极坐标下的表示方式
vec2 xyToPolar(vec2 st, vec2 center){
    vec2 toCenter = center-st;
    // 0~2PI
    float a = atan(toCenter.y,toCenter.x)+PI;
    float r = length(toCenter)*2.0;
    
    return vec2(a, r);
}

vec2 polarToXY(vec2 stPolar){
    float a = stPolar.x;
    float r = stPolar.y;
    return vec2(r*cos(a), r*sin(a));
}

float rotatingLine(vec2 st, vec2 center, float len, float thickness, float speed) {
    // 1. 计算当前的旋转方向向量
    float angle = u_time * speed;
    vec2 dir = vec2(cos(angle), sin(angle));
    
    // 2. 计算像素点相对于中心的偏移
    vec2 pa = st - center;
    
    // 3. 计算投影长度，并限制在线段长度范围内 [0, len]
    // h 是像素点在线段方向上的投影比例
    float h = clamp(dot(pa, dir), 0.0, len);
    
    // 4. 计算像素点到线段的垂直距离
    // 距离 = || 向量PA - 投影向量 ||
    float dist = length(pa - dir * h);
    
    float smoothing = 0.002; 
    return 1.0 - smoothstep(thickness / 2.0 - smoothing, thickness / 2.0 + smoothing, dist);
}

float scanPolar(vec2 st, vec2 center, float angle, float radius){
    float a = st.x;
    float r = st.y;
    angle = mod(angle, TWO_PI);
    float rFlag = 1. - step(radius, r);
    if(angle+PI/2. > TWO_PI && a <PI/2.) a += TWO_PI;
    float aFlag = 1.-smoothstep(angle, angle+PI/2., a);
    if(aFlag == 1.) aFlag = 0.;
    aFlag /= 2.;
    if(a == angle) aFlag = 1.;
    return rFlag*aFlag;
}

float lensInPolar(vec2 st, vec2 center, float r, float thick){
    st = switchPolar(st, center);
    return smoothstep(thick, 0., abs(st.y-r)) - smoothstep(-0.01, +0.01, st.y-r+0.02);
}

vec2 random() {
    // 使用不同频率和相位的正弦波组合产生随机感
    float t = u_time * 0.1;
    
    float x = 0.5;
    x += 0.15 * sin(t * 1.3);
    x += 0.1 * sin(t * 2.7 + 1.0);
    x += 0.07 * sin(t * 5.1 + 2.0);
    
    float y = 0.5;
    y += 0.15 * sin(t * 1.7 + 3.0);
    y += 0.1 * sin(t * 3.1 + 4.0);
    y += 0.07 * sin(t * 6.3 + 5.0);
    
    x *= TWO_PI;
    return vec2(clamp(x, 0., TWO_PI), clamp(y, 0., 0.5));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 toCenter = vec2(0.5)-st;
    // 0~2PI
    float a = atan(toCenter.y,toCenter.x)+PI;
    float r = length(toCenter)*2.0;
    vec2 stPolar = vec2(a, r);
    
    vec3 darkcyan = vec3(0.6, 0.7, 0.7);
    vec3 lightcyan = vec3(0.8, 0.99, 0.99);
    vec3 orange = vec3(0.95,0.447,0.15);
    
    // Out Ring With Gap
    float outRadius = 0.8;
    float outRing = ringInPolar(stPolar, vec2(0.), outRadius, 0.015);
    const float N = 8.;
    for(float i = 0.; i < N; i += 1.){
        float angle = i / N * TWO_PI;
        float gap = 1.0 - step(15./180., abs(stPolar.x - angle));
        if(i == 0.) gap = max(gap, 1.0 - step(10./180., abs(stPolar.x - TWO_PI)));
        outRing = max(outRing - gap, 0.);
    }
    vec3 outRingColor = vec3(outRing);
    if((stPolar.x > 1./8.*TWO_PI && stPolar.x < 3./8.*TWO_PI) || (stPolar.x > 5./8.*TWO_PI && stPolar.x < 7./8.*TWO_PI)) {
        outRingColor *= darkcyan;
    }
    else{
        outRingColor *= lightcyan;
    }
    color += outRingColor;
    
    // bouncing triangles
    float tWidth = 0.05;
    float tHeight = 0.03;
    float triBounce = sin(u_time*1.2)*0.06;
    color += triangle(st, 0., vec2(0.5, 0.1-triBounce), tWidth, tHeight);
    color += (triangle(st, TWO_PI*1./4., vec2(0.1-triBounce, 0.5), tWidth, tHeight));
    color += (triangle(st, TWO_PI*2./4., vec2(0.5, 0.9+triBounce), tWidth, tHeight));
    color += (triangle(st, TWO_PI*3./4., vec2(0.9+triBounce, 0.5), tWidth, tHeight));
    
    // bouncing arc
    float arcBounce = abs(sin(u_time/2.)/2.);
    color += arcInPolar(stPolar, vec2(0.), 0.65, 0.005, PI/4.-arcBounce, PI*3./4.+arcBounce);
    color += arcInPolar(stPolar, vec2(0.), 0.65, 0.005, PI*5./4.-arcBounce, PI*7./4.+arcBounce);
    
    // scan line
    color += rotatingLine(st, vec2(0.5), 0.3, 0.005, -1.)*lightcyan;
    color += scanPolar(stPolar, vec2(0.), -u_time, 0.6)*lightcyan;
    
    // orange moving point
    float radius = mod(u_time/4., 0.34)+0.07;
    // 闪烁逻辑：使用 sin 函数产生周期性变化
    // u_time * 5.0 控制频率（闪烁速度）
    // abs(...) 确保值在 0 到 1 之间
    // + 0.2 确保圆不会完全消失，保留一点底色
    float twinkle = abs(sin(u_time * 8.0)) * 0.8 + 0.2;
    float movingPoint = circleInPolar(stPolar, random(), 0.025)*twinkle
        + ringInPolar(stPolar, random(), 0.04, 0.01) 
        + lensInPolar(stPolar, random(), radius, radius/2.5);
    color = max(color, movingPoint*orange);
    
    color += ringInPolar(stPolar, vec2(0.), 0.6, 0.012)
        + ringInPolar(stPolar, vec2(0.), 0.4, 0.012)*darkcyan
        + ringInPolar(stPolar, vec2(0.), 0.2, 0.012)*darkcyan
        + ringInPolar(stPolar, vec2(0.), 0.03, 0.01) * lightcyan;
    
    gl_FragColor = vec4(color,1.0);
}
