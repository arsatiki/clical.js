var algebra = require('../js/algebra.js');

exports.testv = function(test) {
	var v = algebra.v(1, 2, -1);
	test.equal(v.toString(), "(1 e1) + (2 e2) + (-1 e3)");
	test.equal(v.terms.length, 3, "correct number of terms");
	test.done();
};

exports.internalConsistency = {
	testConstructorFiltering: function(test) {
		var v = algebra.v(1, 0, 1);
		test.equal(v.terms.length, 2, "remove zeroes");
		test.done();
	},

	testZeroValue: function(test) {
		var a = algebra.v(1),
		    b = algebra.v(-1),
		    c = a.plus(b);
		test.deepEqual(c.terms, [{
			coefficient: 0,
			dimensions: []
		}]);

		test.done();
	},

	testSort: function(test) {
		// TODO: This can be improved once we can build 2-vectors
		var mv = algebra.v(2, 3, 4).plus(algebra.s(1)),
			expected = [1, 2, 3, 4],
			k;

		for (k = 0; k < 4; k++)
			test.equal(mv.terms[k].coefficient, expected[k]);

		test.expect(4);
		test.done();
	}
};

exports.output = {
	testToString: function(test) {
		var s = algebra.v(1, 5, -1).toString();
		test.equal(s, "(1 e1) + (5 e2) + (-1 e3)");
		test.done();
	},

	testOutputFormat: function(test) {
		var s = algebra.v(1, 5, -1).outputFormat();
		test.equal(s.length, 3);
		test.deepEqual(s, [
			{coefficient: 1, magnitude: 1, sign: '+',
				dimensions: [1]},
			{coefficient: 5, magnitude: 5, sign: '+',
				dimensions: [2]},
			{coefficient: -1, magnitude: 1, sign: '-',
				dimensions: [3]},
			]);	
		test.done();
	}
};

exports.sums = {
	testSum: function(test) {
		var v1 = algebra.v(1, 2, 3),
		    v2 = algebra.v(2, 3, -3),
		    vs = v1.plus(v2);

		test.deepEqual(vs, algebra.v(3, 5, 0));
		test.equal(vs.terms.length, 2, 'combine terms');

		test.done();
	},

	testScalarSum: function(test) {
		var s1 = algebra.s(1),
		    s2 = algebra.s(2),
		    ss = s1.plus(s2);
		test.equal(ss.terms[0].coefficient, 3, '1 + 2 = 3');
		test.done();
	},

	testNeg: function(test) {
		var v = algebra.v(1, 2, 3).neg();
		test.deepEqual(v, algebra.v(-1, -2, -3));
		test.done();
	}
};


exports.products = {
	testDot: function(test) {
		var v = algebra.v(1, 2, 3);
		var ans = v.dot(v);
		test.equal(ans.toString(), "(14 e)");
		test.done();
	},

	testWedge: function(test) {
		// Student guide, page 8.
		var x = algebra.v(4, 0, 1),
		    y = algebra.v(3, 1, 0);

		test.equal(x.wedge(y).toString(),
			"(4 e12) + (-3 e13) + (-1 e23)");
		test.done();
	},

	testProduct: function(test) {
		var x = algebra.v(4, 0, 1),
		    y = algebra.v(3, 1, 0);
		test.equal(x.mult(y).toString(),
			"(12 e) + (4 e12) + (-3 e13) + (-1 e23)");
		test.done();
	},

	testDiv: function(test) {
		var x = algebra.v(4, 6, 8),
		    y = algebra.v(1, 0, 1);

		test.equal(x.div(x).toString(), "(1 e)");
		test.equal(y.div(y).toString(), "(1 e)");
		test.equal(x.div(y).toString(),
			"(6 e) + (-3 e12) + (-2 e13) + (3 e23)");
		test.done();
	}

};

exports.testSimplifyProduct = function(test) {
	var k, exp, act, tests = [
		[[1,1], []],
		[[1,1,2], [2]],
		[[1,2,2], [1]],
		[[1,1,1,2,2,3,4,4], [1,3]],

	];
	for (k = 0; k < tests.length; k++) {
		exp = tests[k][1];
		act = algebra._private.simplifyProduct(tests[k][0]);
		test.deepEqual(act, exp);
	}
	test.expect(tests.length);
	test.done();
}
