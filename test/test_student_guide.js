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
exports.testPage2 = function(test) {
	var    z1 = s(1/4).mult(I),
 	    z2inv = (s(3).plus(s(4).mult(I))).inv(),
	    z3inv = s(5).inv();
	
	var ans = z1.plus((z2inv.plus(z3inv)).inv());
	test.equal(ans.toString(),
		"(2.5 e) + (1.5 e12)");
	test.done();
};

// TODO: Need coordinate example.
*/

/*
exports.testPage3 = function(test) {
	// TODO: API still unknown.
	var OP = v(4, 3);
	test.equal(OP.abs(), 5);
	
	var OQ = v(2, 3),
	     A = (OP.wedge(OQ)).abs() / 2;

	test.equal(A, 3);
	
	test.done();
};
*/
/*
exports.page4 = {
	example1: function(test) {
		var a = v(1, -2),
		    b = v(1, 1),
		    r = v(5, -1);
	
		var axb = a.wedge(b);
	
		test.deepEqual(r.wedge(b).div(axb), s(2));
		test.deepEqual(a.wedge(r).div(axb), s(3));
		test.done();
	},
	example2: function(test) {
		var a = v(3, 1),
		    b = v(4, -2),
		    c = a.dot(b),
		    d = a.mult(b).abs();
		
		test.equal(acos(c.div(d)), s(0.785));
		test.done();
	}
};

*/

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