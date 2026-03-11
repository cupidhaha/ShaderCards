// 神奈川之浪

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 3.14159265359

void main() {
    // 将 st 范围转换到 [-1.0, 1.0]，且 (0, 0) 是中心
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = st * 2.0 - 1.0; 
    st.x *= u_resolution.x / u_resolution.y; // 修正 X 轴缩放，保持漩涡是圆的

    // 核心算法：极坐标变换和指数螺旋调制
    // a. 获取极坐标：像素到中心的距离 r 和 角度 angle [-PI, PI]
    float r = length(st);
    float angle = -atan(st.y, st.x);
    
    // b. 极坐标调制 (Dipolar Spiral Mapping)
    // 这是还原图形的关键公式：它让波纹宽度随距离指数级增加
    // 参数说明：
    // - 1.5: 控制螺旋的“螺旋密度”（值越大波纹越密）。
    // - log(r): 指数级调制的核心，创造出波纹越远越宽的效果。
    float f = angle - 1.5 * log(r);
    
    // c. 生成周期性的波纹
    // 使用 sin 函数生成 [-1, 1] 的平滑正弦波
    float wave = sin(f + PI * 0.25);

    float antialias = 2.0 / u_resolution.y;
    float pct = smoothstep(-antialias, antialias, wave);
    vec3 color = vec3(pct);

    gl_FragColor = vec4(color, 1.0);
}