
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    if(mod(u_time, 2.0) < 1.)
    {
        _st.y += step(1., mod(_st.x,2.0))*u_time;
    	_st.y -= (1.-step(1., mod(_st.x,2.0))) * u_time;
    }
    else
    {
        _st.x += step(1., mod(_st.y,2.0))*u_time;
    	_st.x -= (1.-step(1., mod(_st.y,2.0))) * u_time;
    }

    return fract(_st);
}

float circle(vec2 st, float radius){
	float dis = distance(st, vec2(0.5));
    return smoothstep(radius-0.01, radius+0.01, dis);
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Apply the brick tiling
    st = brickTile(st,15.0);

    // color = vec3(box(st,vec2(0.9)));
    color = vec3(circle(st, 0.3));

    gl_FragColor = vec4(color,1.0);
}
