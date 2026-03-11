// star with lights

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

vec3 polygon(in vec2 st, in int N, in float angle, float size, vec2 center){
    st = st *2.-1.-center;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI+angle;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  float d = cos(floor(.5+a/r)*r-a)*length(st);
    
  return vec3(1.0-smoothstep(size,size+0.01,d));
}

vec3 polygon(in vec2 st, in int N, in int rotateCnt, float size, vec2 center){
    return polygon(st, N, PI*float(rotateCnt)/float(N), size, center);
}

vec3 star6(vec2 st, float size, vec2 center, float angle){
    return max(polygon(st, 3, angle, size, center), polygon(st, 3, PI/3.+angle, size, center));
}

vec3 str6Frame(vec2 st, float size, vec2 center, float thick, float angle){
    return star6(st, size+thick/2., center, angle) - star6(st, size-thick/2., center, angle);
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
    
    // 在旋转后的坐标系中，三角形是标准朝向（顶点在原点，底边在下方）
    // 顶点在 (0, 0)，底边中点在 (0, -height)
    
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
    float inX = step(leftX, pRot.x) * step(pRot.x, rightX);
    
    // 在三角形内部
    float inside = inY * inX;
    return vec3(inside);
}

void main(){
  	vec2 st = gl_FragCoord.xy/u_resolution.xy;
  	st.x *= u_resolution.x/u_resolution.y;
    vec3 baseStar = star6(st, 0.25, vec2(0.0), 0.)
        - str6Frame(st, 0.22, vec2(0.0), 0.02, 0.)
        - str6Frame(st, 0.11, vec2(0.0), 0.02, PI/6.);
	
    vec3 light = min(triangle(st, PI/8., vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*3./8.,  vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*5./8.,  vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*7./8.,  vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*9./8.,  vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*11./8., vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*13./8., vec2(0.5), 0.12, 1.0)
        + triangle(st, PI*15./8., vec2(0.5), 0.12, 1.0), 1.);
    
    vec3 color = max(light - star6(st, 0.28, vec2(0.0), 0.), baseStar);
  	gl_FragColor = vec4(color,1.0);
}
