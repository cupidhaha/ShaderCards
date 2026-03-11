#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float rectangle(vec2 st, vec2 center, float width, float height){
    float x = 1.0 -step(width/2., abs(st.x - center.x));
    float y = 1.0 - step(height/2., abs(st.y-center.y));
    return x*y;
}
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    // Plot a line
    float baseLine = 1.0 - step(0.01, abs(st.y + st.x-1.0));
    float baseRect = rectangle(st, vec2(0.5), 0.3, 0.5);
    
    float rect = abs(baseRect-baseLine);
    vec3 color = vec3(rect);

	gl_FragColor = vec4(color,1.0);
}
