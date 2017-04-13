    function initGLContext(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl", { antialias: true});
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL");
        }
    }
	
	
//from: http://webreflection.blogspot.com/2010/09/fragment-and-vertex-shaders-my-way-to.html

// our shaders base path
loadShaders.base = "shader/";

// our shaders loader (getShader)
function loadShaders(gl, shaders, callback) {
	// (C) WebReflection - Mit Style License
	function onreadystatechange() {
		var xhr = this, i = xhr.i;
		if (xhr.readyState == 4) {
			shaders[i] = gl.createShader(shaders[i].slice(0, 2) == "fs" ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);
			gl.shaderSource(shaders[i], xhr.responseText);
			gl.compileShader(shaders[i]);
			if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS))
				throw gl.getShaderInfoLog(shaders[i]);
			!--length && typeof callback == "function" && callback(shaders);
		}
	}

	for (var shaders = [].concat(shaders), asynchronous = !!callback, i = shaders.length, length = i, xhr; i--; ) {
		( xhr = new XMLHttpRequest).i = i;
		xhr.open("get", loadShaders.base + shaders[i], asynchronous);
		if (asynchronous) {
			xhr.onreadystatechange = onreadystatechange;
		}
		xhr.send(null);
		onreadystatechange.call(xhr);
	}
	return shaders;
}


function setupProgram(program){
	gl.useProgram(program);
	if (program === rasterProgram) {
        // texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
		
		program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);

        //shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        //console.log("info: "+ shaderProgram.vertexPositionAttribute);

        program.samplerUniform = gl.getUniformLocation(program, "uSampler");
        program.shiftUniform = gl.getUniformLocation(program, "uShift");
		
    } else if (program === vectorProgram) {
        // color
        program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);
		/*
		program.vertexPositionAttribute_n1 = gl.getAttribLocation(program, "aVertexPosition_n1");
        gl.enableVertexAttribArray(program.vertexPositionAttribute_n1);
		
		program.vertexPositionAttribute_n2 = gl.getAttribLocation(program, "aVertexPosition_n2");
        gl.enableVertexAttribArray(program.vertexPositionAttribute_n2);*/

       // program.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
        //gl.enableVertexAttribArray(program.vertexColorAttribute);
    }
	
	program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
	program.meridianRotationUniform = gl.getUniformLocation(program, "uMeridianRotation");
    program.sinLatPoleUniform = gl.getUniformLocation(program, "uSinLatPole");        
    program.cosLatPoleUniform = gl.getUniformLocation(program, "uCosLatPole");
    program.viewportHeightUniform = gl.getUniformLocation(program, "uViewportHeight");
    program.radiusUniform = gl.getUniformLocation(program, "uRadius");
    program.splineValsUniform = gl.getUniformLocation(program, "uSplineVals")
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

