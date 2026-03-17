// 经典苏格兰格子

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

vec4 BaseGrid(vec2 st){
    vec4 red = vec4(0.8, 0.2, 0.2, 1.0);
    vec4 gray1 = vec4(0.465,0.310,0.310,0.7);
    vec4 gray2 = vec4(0.230,0.08,0.08,0.9);
    vec4 dark = vec4(0.144, 0.15, 0.15, 1.0);
    
    // 分割点
    float splits[6];
    splits[0] = 0.0;
    splits[1] = 0.08;
    splits[2] = 0.12;
    splits[3] = 0.2;
    splits[4] = 0.55;
    splits[5] = 1.0;
    for(int i = 0; i < 6; i++){
        splits[i] /= 2.;
    }
    
    // 计算格子索引
    int ix = 0, iy = 0;
    for (int i = 0; i < 6; i++) {
        if (0.5 - abs(0.5-st.x) >= splits[i]) ix = i;
        if (0.5 - abs(0.5-st.y) >= splits[i]) iy = i;
    }
    
    // 选择颜色
    vec4 color = red;
    bool xEven = (mod(float(ix), 2.) == 0.);
    bool yEven = (mod(float(iy), 2.) == 0.);
    
    if(!xEven) color.rgb = mix(color.rgb, gray1.rgb, gray1.a);
    if(!yEven) color.rgb = mix(color.rgb, gray2.rgb, gray2.a);
    if(!xEven && !yEven) color = dark;
    
    return color;
}

vec4 topCorss(vec2 st, vec4 baseColor){
    vec4 gray0 = vec4(0.95, 0.95, 0.95, 0.7);
    vec4 yellow = vec4(0.960,0.904,0.292,0.6);

    // 分割点
    float splits[7];
    splits[0] = 0.0;
    splits[1] = 0.018;
    splits[2] = 0.36;
    splits[3] = 0.39;
    splits[4] = 0.42;
    splits[5] = 0.45;
    splits[6] = 1.0;
    for(int i = 0; i < 7; i++){
        splits[i] /= 2.;
    }
    
    // 计算格子索引
    int ix = 0, iy = 0;
    for (int i = 0; i < 7; i++) {
        if (0.5 - abs(0.5-st.x) >= splits[i]) ix = i;
        if (0.5 - abs(0.5-st.y) >= splits[i]) iy = i;
    }
    
    // 选择颜色
    vec4 color = baseColor;
    
    if(ix == 0 || ix == 2 || iy == 0 || iy == 2) color.rgb = mix(color.rgb, gray0.rgb, gray0.a);
    if(ix == 4 || iy == 4) color.rgb = mix(color.rgb, yellow.rgb, yellow.a);
    
    return color;
}

void main(void){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 4x4网格
    st = fract(st * 4.0);
    vec4 baseColor = BaseGrid(st);
    vec4 color = topCorss(st, baseColor);
    
    gl_FragColor = color;
}