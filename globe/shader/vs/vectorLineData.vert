/* 
Copyright (c) 2017, Johannes Liem
Permission to use, copy, modify, and/or distribute this source code for any purpose without fee is hereby granted, 
provided that the above copyright notice and this permission notice appear in all copies. Not for commercial use or profit

THE SOURCE CODE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOURCE CODE INCLUDING ALL 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, 
OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, 
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOURCE CODE.
*/

attribute vec2 aVertexPosition;
//attribute vec2 aVertexPosition_n1;
//attribute vec2 aVertexPosition_n2;
//attribute vec4 aVertexColor;

varying float invalid;
varying float nh;
varying float mer;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uMeridianRotation;
uniform float uSinLatPole;
uniform float uCosLatPole;
uniform float uViewportHeight;
uniform float uRadius;
uniform float uSplineVals[8];//[16];

varying vec4 vColor;

#define M_PI 3.14159265358979323846
#define M_1_PI 0.31830988618379067154
#define M_2_PI 0.63661977236758134308
#define M_PI_4 0.78539816339744830962


float evalSpline(float x) {
	//x auf 0-2 trimmen
	x = ((x + M_PI/2.)/M_PI) * 2.; //4.
	float i = floor(x);
	i = min(i,1.);
	
	float t = x - i;
	
	int j = int(i);// * 4;
	// return uSplineVals[j] + t * (uSplineVals[j+1] + t * (uSplineVals[j+2] + t * uSplineVals[j+3]));
	
	if (j == 0) {
		return uSplineVals[0] + t * (uSplineVals[1] + t * (uSplineVals[2] + t * uSplineVals[3]));
	} else if (j == 1){
		return uSplineVals[4] + t * (uSplineVals[5] + t * (uSplineVals[6] + t * uSplineVals[7]));  
	} /*else if (j == 2){
	   return uSplineVals[8] + t * (uSplineVals[9] + t * (uSplineVals[10] + t * uSplineVals[11]));  
	   } else if (j == 3){
	   return uSplineVals[12] + t * (uSplineVals[13] + t * (uSplineVals[14] + t * uSplineVals[15]));  
	   } 
	   */
	
}

// return lam in range [-M_PI, M_PI)
float normalizeLam(float lam) {
	return 2.0 * M_PI * (fract(0.5 * M_1_PI * lam + 0.5) - 0.5);
}
vec2 rotate(float  lat, float lon){
	float sinLon = sin(lon);
	float cosLon = cos(lon);
	float sinLat = sin(lat);
	float cosLat = cos(lat);
	float cosLat_x_cosLon = cosLat * cosLon;
	lon = normalizeLam(atan(cosLat * sinLon, uSinLatPole * cosLat_x_cosLon + uCosLatPole * sinLat));
	sinLat = uSinLatPole * sinLat - uCosLatPole * cosLat_x_cosLon;
	lat = asin(sinLat);
	return vec2(lat, lon);
}


vec2 forwardProjection(vec2 latlon){
	//float x = xy.x/1.2; //(uViewportHeight/4.);
	//float y = -xy.y/1.2; //(uViewportHeight /4.);
	//float lat = 2.*asin(sqrt(x*x + y*y)/2.) + M_PI/2.0;
	//float lon = atan(x,y);
	float phi = latlon.x/2. + M_PI_4;
	float x = 2. * sin(phi) * sin(latlon.y);
	float y = -2. * sin(phi) * cos(latlon.y);
	
	return vec2(x, y);
}




void main(void) {
	
	vec3 pos;
	vec2 xy;
	vec2 latlon = vec2(aVertexPosition.x,aVertexPosition.y);
	
    nh = latlon.x;
    mer = latlon.y;
    
    //Rotation
    latlon.y = (latlon.y + radians(180.));
	latlon.y = (latlon.y - uMeridianRotation);
	latlon = rotate(latlon.x,latlon.y);
	
    //correction
	latlon.x = evalSpline(latlon.x);
    //latlon.x -= radians(15.);
    
   
    
	xy = forwardProjection(latlon);
	
	xy.x = xy.x / (1.+sqrt(2.));
	xy.y = -xy.y / (1.+sqrt(2.));
	
	pos.x = xy.x;
	pos.y = xy.y;
	pos.z = 0.;
	invalid = 0.0;
	if (length(pos) > (2./(1.+sqrt(2.))) - 0.001) {
		invalid = 1.0;
	}
	//gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	gl_Position = uPMatrix * uMVMatrix *vec4(pos, 1.0);
	//vColor = aVertexColor;
}