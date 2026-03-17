// 易经八卦

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float shape(vec2 st, vec2 center, float w, float h){
    return step(abs(st.x-center.x), w/2.) * step(abs(st.y-center.y), h/2.);
}

float shape0(vec2 st, vec2 center, float w, float h){
    return shape(st, center, w, h) - shape(st, center, w/5., h);
}

// bin: 二进制0/1
float shapeBin(vec2 st, vec2 center, float bin){
    if(bin == 0.) return shape0(st, center, 0.7, 0.1);
    else return shape(st, center, 0.7, 0.1);
}

// 显示num对应的卦象
float gua(vec2 st, float num){
    const float count = 4.;	// 横线的个数 
    float color = 0.0;
    for(float i = 0.; i < count; i++){
        num = floor(num/2.);
        float remain = mod(num, 2.);
        color = max(color, shapeBin(st, vec2(0.5, 0.2+(0.8/count)*i), remain));
    }
    return color;
}

void main (void) {
    vec2 baseST = gl_FragCoord.xy/u_resolution.xy;

    float zoom = 4.;
    vec2 st = baseST * zoom;

    // 每个格子的编号，使得八卦错开
    float index = 0.0;
    index = floor(st.x) + floor(st.y)*zoom;
    st = fract(st);
    
    float color = gua(st, mod(floor(u_time*8.), 32.)+index);
    vec3 posColor = vec3(baseST.x, baseST.y, 1.0);
    gl_FragColor = vec4(vec3(color) * posColor,1.0);
}
