var algebra = require('../js/algebra.js'),
    assert = require('assert');


exports.testv = function(test) {
	var v = algebra.v(1, 2, -1);
	assert.ok(v instanceof algebra.Multivector);
	assert.equal(v.terms.length, 3, "correct number of terms");
	test.done();
};

exports.testConstructorFiltering = function(test) {
	var v = algebra.v(1, 0, 1);
	assert.equal(v.terms.length, 2, "remove zeroes");
	test.done();
};

exports.testToString = function(test) {
	var s = algebra.v(1, 5, -1).toString();
	assert.equal(s, "(1 e1) + (5 e2) + (-1 e3)");
	test.done();
}

exports.testSum = function(test) {
	var v1 = algebra.v(1, 2, 3),
	    v2 = algebra.v(2, 3, -3),
		vs = v1.plus(v2);
	
	assert.equal(vs.terms.length, 2, 'combine terms');
	assert.equal(vs.terms[0].coefficient, 3, 'first coeff correct');
	assert.equal(vs.terms[1].coefficient, 5, 'second coeff correct');
	
	test.done();
};

exports.testScalarSum = function(test) {
	var s1 = algebra.s(1),
	    s2 = algebra.s(2),
	    ss = s1.plus(s2);
	assert.equal(ss.terms[0].coefficient, 3, '1 + 2 = 3');
	test.done();
};
