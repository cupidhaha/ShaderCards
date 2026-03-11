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
void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = polygon(st, 4, 0, 0.8, vec2(0.0))
      - polygonFrame(st, 4, 0, 0.77, 0.07, vec2(0.0))
      - polygonFrame(st, 4, 0, 0.64, 0.12, vec2(0.0))
      - polygonFrame(st, 4, 0, 0.24, 0.12, vec2(-0.4, 0.4))
      - polygonFrame(st, 4, 0, 0.12, 0.03, vec2(-0.43, 0.43))
      - polygonFrame(st, 4, 0, 0.09, 0.03, vec2(-0.46, 0.46))
      - polygonFrame(st, 4, 0, 0.06, 0.03, vec2(-0.49, 0.49))
      - polygonFrame(st, 4, 0, 0.24, 0.12, vec2(0.4, 0.4))
      - polygonFrame(st, 4, 0, 0.12, 0.03, vec2(0.43, 0.43))
      - polygonFrame(st, 4, 0, 0.09, 0.03, vec2(0.46, 0.46))
      - polygonFrame(st, 4, 0, 0.06, 0.03, vec2(0.49, 0.49))
      - polygonFrame(st, 4, 0, 0.24, 0.12, vec2(-0.4, -0.4))
      - polygonFrame(st, 4, 0, 0.12, 0.03, vec2(-0.43, -0.43))
      - polygonFrame(st, 4, 0, 0.09, 0.03, vec2(-0.46, -0.46))
      - polygonFrame(st, 4, 0, 0.06, 0.03, vec2(-0.49, -0.49))
      - polygonFrame(st, 4, 0, 0.24, 0.12, vec2(0.4, -0.4))
      - polygonFrame(st, 4, 0, 0.12, 0.03, vec2(0.43, -0.43))
      - polygonFrame(st, 4, 0, 0.09, 0.03, vec2(0.46, -0.46))
      - polygonFrame(st, 4, 0, 0.06, 0.03, vec2(0.49, -0.49));

  gl_FragColor = vec4(color,1.0);
}
