var perms = require('../js/permutations.js'),
    assert = require('assert');

function assertSorted(items) {
	var k;
	for (k = 1; k < items.length; k++)
		assert.ok(items[k - 1] < items[k]);
}

exports.testSwapPos = function(test) {
	var items = [1, 2, 3, 4, 5];
	var sign = perms.swaps(items);
	assert.equal(sign, 1)
	assertSorted(items);

	test.done();
}

exports.testSwapNeg = function(test) {
	var items = [1, 2, 5, 4, 3];
	var sign = perms.swaps(items);
	assert.equal(sign, -1)
	assertSorted(items);

	test.done();
}

