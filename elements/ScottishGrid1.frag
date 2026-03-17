
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main(void){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 4x4网格
    st = fract(st * 4.0);
    
    // 颜色定义
    vec4 gray0 = vec4(0.99, 0.99, 0.99, 1.0);
    vec4 gray1 = vec4(0.9, 0.9, 0.9, 1.0);
    vec4 gray2 = vec4(0.7, 0.7, 0.7, 1.0);
    vec4 gray3 = vec4(0.4, 0.4, 0.4, 1.0);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 red = vec4(0.8, 0.2, 0.2, 0.8);
    
    // 分割点
    float splits[8];
    splits[0] = 0.0;
    splits[1] = 0.25;
    splits[2] = 0.35;
    splits[3] = 0.45;
    splits[4] = 0.55;
    splits[5] = 0.65;
    splits[6] = 0.75;
    splits[7] = 1.0;
    
    // 计算格子索引
    int ix = 0, iy = 0;
    for (int i = 0; i < 7; i++) {
        if (st.x >= splits[i]) ix = i;
        if (st.y >= splits[i]) iy = i;
    }
    
    // 选择颜色
    vec4 color = black;
    bool xEven = (mod(float(ix), 2.) == 0.);
    bool yEven = (mod(float(iy), 2.) == 0.);
    
    if (xEven && yEven) {
        color = (iy >= 2 && iy <= 4) ? gray0 : gray1;
    } else if (!xEven && yEven) {
        color = gray2;
    } else if (xEven && !yEven) {
        color = gray3;
    }
    
    // 红色边框
    if (abs(st.x - 0.5) > 0.47 || abs(st.y - 0.5) > 0.47) {
        color.rgb = mix(color.rgb, red.rgb, red.a);
    }
    
    gl_FragColor = color;
}