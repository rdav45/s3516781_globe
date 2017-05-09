precision highp float;

#define M_PI 3.14159265358979323846
#define M_1_PI 0.31830988618379067154
#define M_2_PI 0.63661977236758134308
#define M_PI_4 0.78539816339744830962

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
//uniform sampler2D uShift;
uniform float uMeridianRotation;
uniform float uSinLatPole;
uniform float uCosLatPole;
uniform float uViewportHeight;
uniform float uRadius;
uniform float uSplineVals[8];//[16];

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

float evalSplineINV(float lat) {
    
    //solution only for two spline segments!!!
    float t;
    float pol, polD;
    float delta, x1;
    float eps = 0.0001;
    float x0 = lat;
    if (lat < uSplineVals[4]) {
        for(int i = 0; i < 100; i++){
            pol = uSplineVals[0] + x0 * (uSplineVals[1] + x0 * (uSplineVals[2] + x0 * uSplineVals[3]));
            polD = uSplineVals[1] + x0 * (uSplineVals[2] + x0 * uSplineVals[3]);
            x1 = x0 - ((pol - lat) / polD);
            delta = x1 - x0;
            x0 = x1;
            if (delta > eps) {
                break;
            }
      
        }
        t = x0;
    } else {
        for(int i = 0; i < 100; i++){
            pol = uSplineVals[4] + x0 * (uSplineVals[5] + x0 * (uSplineVals[6] + x0 * uSplineVals[7]));
            polD = uSplineVals[5] + x0 * (uSplineVals[6] + x0 * uSplineVals[7]);
            x1 = x0 - ((pol - lat) / polD);
            delta = x1 - x0;
            x0 = x1;
            if (delta > eps) {
                break;
            }
            
        }
        t = x0 + 1.;
        
    }
    return (t/2.) * M_PI - (M_PI/2.);
    /*
	//x auf 0-4 trimmen
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
	} else if (j == 2){
	   return  cv[8] + t * (uSplineVals[9] + t * (uSplineVals[10] + t * uSplineVals[11]));
	   } else if (j == 3){
	   return uSplineVals[12] + t * (uSplineVals[13] + t * (uSplineVals[14] + t * uSplineVals[15]));  
	   } 
	   
	*/
}

// return lam in range [-M_PI, M_PI)
float normalizeLam(float lam) {
	return 2.0 * M_PI * (fract(0.5 * M_1_PI * lam + 0.5) - 0.5);
}

vec2 rotate(float  lon, float lat){
	float sinLon = sin(lon);
	float cosLon = cos(lon);
	float sinLat = sin(lat);
	float cosLat = cos(lat);
	float cosLat_x_cosLon = cosLat * cosLon;
	lon = normalizeLam(atan(cosLat * sinLon, uSinLatPole * cosLat_x_cosLon + uCosLatPole * sinLat));
	sinLat = uSinLatPole * sinLat - uCosLatPole * cosLat_x_cosLon;
	lat = asin(sinLat);
	return vec2(lon, lat);
}

//inv_proj
vec2 inverseProjection(vec2 xy){
	float lat = 2.*asin(length(xy)/2.) + M_PI/2.0;
	float lon = atan(xy.x,-xy.y);
	return vec2(lon, lat);
}

//inv_proj
/*
vec2 inverseProjection2(vec2 xy){
	float x = xy.x;///1.2; //(uViewportHeight/4.);
	float y = xy.y;///1.2; //(uViewportHeight /4.);
	float lat = 2.*length(xy) + M_PI/2.;
	float lon = atan(-xy.y,xy.x);
	//float lat = 2.*asin(sqrt(x*x + y*y)/2.) + M_PI/2.0;
	//float lon = atan(x,y);
	return vec2(lon, lat);
}
*/

void main(void) {
	vec2 center = vec2(uViewportHeight/2.);
	vec2 xyFrag = gl_FragCoord.xy-(center);
	vec2 xy = vTextureCoord;//-(center);
	if(length(xyFrag) > uRadius)
		discard;
	//gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	else{ 
		//Projection
		vec2 lonlat = inverseProjection(xy);
        
        //LatCorrection (splines)
		lonlat.y = evalSpline(lonlat.y);
		//lonlat.y += radians(15.);
        
        //shift
        //float shift = texture2D(uShift, lonlat.y);
        //lonlat.y += shift;
        
        //Rotation
		lonlat = rotate(lonlat.x, lonlat.y);
		lonlat.x = (lonlat.x - uMeridianRotation);
		

		
		
		//0-1
		lonlat.x = lonlat.x / 2. / M_PI ;
		lonlat.y = -lonlat.y / M_PI + 0.5;
		
		gl_FragColor = texture2D(uSampler, lonlat);
	}
    
	
}