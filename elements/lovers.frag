#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

vec3 polygon(in vec2 st, in int N, in int rotateCnt, float size, vec2 center){
    st = st *2.-1.-center;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI*(1.0+float(rotateCnt)/float(N));
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  float d = cos(floor(.5+a/r)*r-a)*length(st);
    
  return vec3(1.0-smoothstep(size,size+0.01,d));
}

vec3 polygonFrame(in vec2 st, in int N, in int rotateCnt, in float size, in float thick, vec2 center){
    return polygon(st, N, rotateCnt, size, center) - polygon(st, N, rotateCnt, size-thick, center); 
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 调整坐标到 [-1, 1]
    vec2 p = (st - 0.5) * 2.0;
    p.x *= u_resolution.x / u_resolution.y;
    
    // 爱心公式 (来自网络)
    float x = p.x;
    float y = p.y;
    
    // 简化的爱心方程
    float heart = pow(x*x + y*y - 0.3, 3.0) - x*x * pow(y, 3.0);
    
    // 爱心内部
    // float inside = heart < 0.0 ? 1.0 : 0.0;
    float inside = 1.0 - step(0.0, heart);
    
    vec3 color = vec3(inside)-polygonFrame(st, 3, 0, 0.12, 0.04, vec2(0.0, 0.1));
    
    gl_FragColor = vec4(color, 1.0);
}
