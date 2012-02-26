var algebra = require('../js/algebra.js'),
    assert = require('assert');


exports.testv = function(test) {
	var v = algebra.v(1, 2, -1);
	assert.ok(v instanceof algebra.Multivector);
	assert.equal(v.terms.length, 3, "correct number of terms");
	test.done();
}

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

