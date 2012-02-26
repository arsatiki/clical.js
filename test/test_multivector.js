var algebra = require('../js/algebra.js'),
    assert = require('assert');


exports.testv = function(test) {
	var v = algebra.v(1, 0, -1);
	assert.ok(v instanceof algebra.Multivector);
	assert.equal(v.terms.length, 3, "correct number of terms");
	test.done();
}

exports.testToString = function(test) {
	var s = algebra.v(1, 0, -1).toString();
	assert.equal(s, "(1 e1) + (0 e2) + (-1 e3)");
	test.done();
}

