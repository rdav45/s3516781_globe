function CubicSpline() {

    /* Knot vector: The values for which to compute an interpolating spline curve.
     * The values are assumed to be equally distant.
     */
    var t = [];
    /**
     * Spline coefficients for each spline segment.
     */
    var abcd = [];

    for(var i = 0; i < arguments.length; i++) {
        t.push(arguments[i]);
    }
    computeCubicSpline();

    /**
     * Evaluates the piecewise cubic spline Y = a+b*t+c*t*t+d*t*t*t at a given position.
     * @param i The segment for which to evaluate the spline, must be in
     * [0..getKnotsCount()-1]. An IndexOutOfBoundsException is thrown otherwise.
     * @t The spline parameter for segment i, must be in [0..1]. Otherwise the
     * result is not defined.
     * @return The value defined by the piecewise cubic spline at position i + t.
     */
    this.evalSplineInterval = function(i, t) {
        var abcd_row = abcd[i];
        return abcd_row[0] + t * (abcd_row[1] + t * (abcd_row[2] + t * abcd_row[3]));
    };

    /**
     * Evaluates a piecewise cubic spline at position x.
     * @param x The position where the spline is evaluated. Must be in
     * [0..getKnotsCount()-1]. An IndexOutOfBoundsException is thrown otherwise.
     * @return The value defined by the piecewise cubic spline at position x.
     */
    this.evalSpline = function(x) {
        var i = Math.floor(x);
        if(i >= abcd.length) {
            i = abcd.length - 1;
        }
        var ti = x - i;
        return this.evalSplineInterval(i, ti);
    };
    
    /**
     * Returns a copy of the spline coefficients. This returns getKnotsCount() * 4
     * coefficients. The first four coefficients are for the first segment, and so on.
     */
    this.getSplineCoefficients = function() {
        var coeffs = [];
        for(var i = 0; i < abcd.length; i++) {
            for(var j = 0; j < 4; j++) {
                coeffs.push(abcd[i][j]);
            }
        }
        return coeffs;
    };
    
    /**
     * Compute the spline coefficients for a cubic spline. Call this after every
     * change to the knots vector t or changes to the start or end slopes.
     * The spline coefficients are computed with a system of linear
     * equations. See http://mathworld.wolfram.com/CubicSpline.html
     * The coefficients are a, b, c, d for Yi(t)=ai+bi*t+ci*t*t+di*t*t*t
     * and stored in this.abcd
     */
    function computeCubicSpline() {
        // solve the system A * D = B
        // see http://mathworld.wolfram.com/CubicSpline.html
        var i, n = t.length;
        if(n < 3) {
            return;
        }
        var n_1 = n - 1;

        // setup matrix A
        var A = Matrix.Zero(n, n);
        A.elements[0][0] = 2;
        A.elements[0][1] = 1;
        for( i = 1; i < n_1; i++) {
            A.elements[i][i - 1] = 1;
            A.elements[i][i] = 4;
            A.elements[i][i + 1] = 1;
        }
        A.elements[n_1][n_1 - 1] = 1;
        A.elements[n_1][n_1] = 2;

        // setup matrix B, which is a vector
        var B = Vector.Zero(n);
        B.elements[0] = 3 * (t[1] - t[0]);

        for( i = 1; i < n_1; i++) {
            B.elements[i] = 3 * (t[i + 1] - t[i - 1]);
        }
        B.elements[n_1] = 3 * (t[n_1] - t[n_1 - 1]);

        // solve for D
        var D = A.inverse().multiply(B);

        // compute the spline coefficients a, b, c, d
        // a = yi
        // b = Di
        // c = 3(yi+1 - yi) - 2dDi - Di+1
        // d = 2(yi - yi+1) + dDi + Di+1 = -2(yi+1 - yi) + dDi + Di+1
        var coefCount = t.length - 1;
        var splineCoeff = Matrix.Zero(coefCount, 4);
        for( i = 0; i < coefCount; i++) {
            var di = D.elements[i];
            var diplus1 = D.elements[i + 1];
            var coeff = splineCoeff.elements[i];
            var valDif = t[i + 1] - t[i];
            coeff[0] = t[i];
            coeff[1] = di;
            coeff[2] = 3 * valDif - 2 * di - diplus1;
            coeff[3] = -2 * valDif + di + diplus1;
        }
        abcd = splineCoeff.elements;
    }

    /**
     * Returns the number of knots, i.e. the number of values that are
     * interpolated by this spline curve.
     * @return The number of knots.
     */
    this.getKnotsCount = function() {
        return t.length;
    };

    /**
     * Set the knot value at position i. An exception is thrown if i is smaller
     * than 0 or equal or larger than getKnotsCount().
     * @param i The position of the knot between 0 and getKnotsCount() - 1.
     * @param v The new value of the knot.
     */
    this.setKnot = function(i, v) {
        //if(i <= v.length && t[i] != v) {
            t[i] = v;
            computeCubicSpline();
       // }
    };

    /**
     * Add a knot to the end of this spline curve.
     */
    this.addKnot = function(v) {
        t.push(v);
        computeCubicSpline();
    };
    
    /**
     * Returns the knot value at position i. An exception is thrown if i is smaller
     * than 0 or equal or larger than getKnotsCount().
     * @param i The position of the knot between 0 and getKnotsCount() - 1.
     * @return The knot value.
     */
    this.getKnot = function(i) {
        return t[i];
    };

}