precision mediump float;

uniform float uViewportHeight;
uniform float uRadius;

varying float invalid;
varying float nh;
varying float mer;

//varying vec4 vColor;

void main(void) {
	vec2 center = vec2(uViewportHeight/2.);
	vec2 xyFrag = gl_FragCoord.xy-(center);
	
	if(length(xyFrag) > uRadius){
		discard;
	}
	
	if(invalid > 0.0){
		discard;
	}
	
    if (nh >= 0.0) {
        gl_FragColor = vec4(0.502, 0., 0.502, 1.0);//vColor;
    } else {
        gl_FragColor = vec4(1.0, 0., 0.502, 1.0);//vColor;
    }
    
    if (mer >= radians(-1.) && mer <= radians(1.)){
            gl_FragColor = vec4(1.0, 1., 0.502, 1.0);//vColor;
    }
    
   // discard;
    
	
}