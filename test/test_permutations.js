var perms = require('../js/permutations.js');

function assertSorted(test, items) {
	var k;
	for (k = 1; k < items.length; k++)
		test.ok(items[k - 1] < items[k]);
}

exports.testSwapPos = function(test) {
	var items = [1, 2, 3, 4, 5];
	var sign = perms.swaps(items);
	test.equal(sign, 1)
	assertSorted(test, items);

	test.done();
}

exports.testSwapNeg = function(test) {
	var items = [1, 2, 5, 4, 3];
	var sign = perms.swaps(items);
	test.equal(sign, -1)
	assertSorted(test, items);

	test.done();
}

