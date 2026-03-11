#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

vec3 polygon(in vec2 st, in int N, in int rotateCnt, float size){
    st = st *2.-1.;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI*(1.0+float(rotateCnt)/float(N));
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  float d = cos(floor(.5+a/r)*r-a)*length(st);
    
  return vec3(1.0-smoothstep(size,size+0.01,d));
}

vec3 polygonFrame(in vec2 st, in int N, in int rotateCnt, in float size, in float thick){
    return polygon(st, N, rotateCnt, size) - polygon(st, N, rotateCnt, size-thick); 
}
void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = polygon(st, 5, 0, 0.6)
      - polygonFrame(st, 5, 0, 0.55, 0.08)
      - polygonFrame(st, 5, 1, 0.44, 0.08)
      - polygonFrame(st, 5, 2, 0.34, 0.08)
      - polygonFrame(st, 5, 1, 0.24, 0.08)
      - polygonFrame(st, 5, 2, 0.15, 0.07)
      - polygonFrame(st, 5, 1, 0.07, 0.08);
  // vec3 color = polygonFrame(st, 4, 0, 0.55, 0.1) + polygon(st, 4, 0, 0.1);

  gl_FragColor = vec4(color,1.0);
}
