// moon
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float circle(in vec2 _st, in float _radius, in vec2 center){
    vec2 dist = _st-center;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	vec3 color = vec3(circle(st,0.6, vec2(0.5)) - circle(st,0.3, vec2(0.62, 0.58)));

	gl_FragColor = vec4( color, 1.0 );
}
