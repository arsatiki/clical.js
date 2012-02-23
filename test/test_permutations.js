var clical = require('clical'),
    assert = require('assert');

exports.testParity = function(test) {
	assert.equal(clical.parity([1, 2, 3]), 1);
	assert.equal(clical.parity([2, 1, 3]), -1);
	test.done();
}