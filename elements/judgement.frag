// judgement
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

float angleBetween(vec2 vector1, vec2 vector2){
    float angleSigned = atan(vector1.y, vector1.x) - atan(vector2.y, vector2.x);
    
    // 归一化到 [-PI, PI]
    if (angleSigned > PI) angleSigned -= TWO_PI;
    if (angleSigned < -PI) angleSigned += TWO_PI;
    
    return degrees(angleSigned+PI);
}

vec3 ray(vec2 st, float angle){
    angle = mod(angle, 360.);
    vec2 center = vec2(0.);
    vec2 a = vec2(0, 0.1);
    float tAngle = 2.;

    float angleBetween = angleBetween(st-center, a - center);
    float pct = smoothstep(angle-0.5, angle+0.5, angleBetween)
        -smoothstep(angle+tAngle-0.5, angle+tAngle+0.5, angleBetween);
    
    return vec3(pct);
}

vec3 square(vec2 st, float size){
    float a = max(step(size/2., abs(st.x)), step(size/2., abs(st.y)));
    return vec3(1.-a);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = st * 2.0 - 1.0;

    vec3 rayColor = vec3(0.);
    const int segCnt = 30;
    for(int i = 0; i < segCnt; i++){
        rayColor += ray(st, float(360/segCnt*i));
    }
    
    if(st.y<0.) rayColor = 1.0-rayColor;
    
    vec3 color = max(rayColor - square(st, 0.5), square(st, 0.4));
    gl_FragColor = vec4(color, 1.0);
}