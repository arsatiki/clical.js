var algebra = require('../js/algebra.js');

var v = algebra.v,
    s = algebra.s;
var I = v(1, 0).mult(v(0, 1));

exports.testPage1 = function(test) {
	var a = s(2).plus(I);
	var b = s(3).plus(s(2).mult(I));
	
	test.equal(a.mult(b).toString(),
		"(4 e) + (7 e12)");
	
	test.done();
};

/*

exports.testPage8 = function(test) {
	var v = algebra.v(-5, 7, 0),
	    x = algebra.v(4, 0, 1),
	    y = algebra.v(3, 1, 0)
	    A = x.wedge(y),
	    p = (v.dot(A)).div(A),
	    r = (v.wedge(A)).div(A);

	test.equal(p.toString(), "(-4 e1) + (4 e2) + (-4 e3)");
	test.equal(r.toString(), "(-1 e1) + (3 e2) + (4 e3)");

	test.done();
};
*/