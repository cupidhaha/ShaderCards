// 井字棋

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

float ring(in vec2 _st, in float _radius, in float thick){
    return circle(_st, _radius+thick/2.)-circle(_st, _radius-thick/2.);
}

float rectangle(in vec2 st, in vec2 center, in vec2 rect){
    float inSquare = step(abs(st.x - center.x), rect.x*0.5) * step(abs(st.y - center.y), rect.y*0.5);
    
    return inSquare;
}

float cross(in vec2 _st, vec2 rect){
    return  rectangle(_st, vec2(.5), rect) +
            rectangle(_st, vec2(.5), vec2(rect.y, rect.x));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    st *= 3.0;      // Scale up the space by 3
    vec2 stFrac = fract(st); // Wrap around 1.0

    // Now we have 9 spaces that go from 0-1
	
    color = 1.-vec3(rectangle(stFrac, vec2(0.5), vec2(0.98)));
    // color = vec3(circle(st,0.5));
	float grid = floor(st.x)+floor(st.y);
    if(mod(grid, 2.) == 0.){
        color += ring(stFrac, 0.3,0.1);
    }
    else{
        stFrac -= vec2(0.5);
        stFrac = rotate2d( PI/4. ) * stFrac;
        stFrac += vec2(0.5);
        color += cross(stFrac, vec2(0.5,0.05));
    }
	gl_FragColor = vec4(color,1.0);
}