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

void main(){
  	vec2 st = gl_FragCoord.xy/u_resolution.xy;
  	st.x *= u_resolution.x/u_resolution.y;
    float size = 0.6;
    float thick = 0.08;
	
	vec3 color = polygon(st, 3, 0, 0.4, vec2(0.0,-0.15))
        - polygon(st, 3, 0, 0.15, vec2(0.0,0.25))
        - polygon(st, 3, 1, 0.15, vec2(0.0, -0.05));
	
  	gl_FragColor = vec4(color,1.0);
}
