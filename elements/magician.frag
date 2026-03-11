
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

float isOnArc(vec2 st, vec2 center, float radius, float thick, float start, float end) {
    vec2 d = st - center;
    float r = length(d);
    float a = atan(d.y, d.x);
    a = a + step(a, 0.0) * TWO_PI;  // 归一化到 [0, 2PI]
 
    // 角度判断（巧妙处理跨越0点）
    float da = mod(a - start + TWO_PI, TWO_PI);
    float dr = mod(end - start + TWO_PI, TWO_PI);
    float inA = step(da, dr);
    
    return inA;
}

float circle(in vec2 _st, in float _radius, in vec2 center){
    vec2 dist = _st-center;
	return 1.-smoothstep(_radius-(_radius*0.03),
                         _radius+(_radius*0.03),
                         dot(dist,dist)*4.0);
}

float circleFrame(in vec2 _st, in float _radius, in vec2 center, in float thick){
    return circle(_st, _radius, center) - circle(_st, _radius-thick, center);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec2 center1 = vec2(0.35,0.5);
    vec2 center2 = vec2(0.65,0.5);
    float radius = 0.2;
    float thick = 0.04;

    float dis = distance(center1, center2);
    float angle = acos(dis / 2.0 / radius);
    float circle1 = circleFrame(st, radius, center1, thick);
    circle1 -= isOnArc(st, center1, radius, thick, -angle-(7.*TWO_PI/180.), -angle+(3.*TWO_PI/180.));
    float circle2 = circleFrame(st, radius, center2, thick);
    circle2 -= isOnArc(st, center2, radius, thick, (PI-angle)-(6.*TWO_PI/180.), (PI-angle)+(3.*TWO_PI/180.));
    
	  vec3 color = vec3(max(circle1,circle2));

    gl_FragColor = vec4( color, 1.0 );
}
