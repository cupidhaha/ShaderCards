// X
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    // Plot a line
    float pct = 1. -step(0.07, abs(st.y - st.x));
    float pct1 = 1. - step(0.07, abs(st.y + st.x-1.));
    vec3 color = vec3(pct+pct1);

	gl_FragColor = vec4(color,1.0);
}
