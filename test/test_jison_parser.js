var parser = require("../js/grammar").parser;

var nop_yy = {
	assignment: function (identifier, exp) {},
	identifier: function (name) {},
	number: parseFloat,

	negate: function (exp) {},
	conjugate: function (exp) {},
	involute: function (exp) {},

	add: function(exp1, exp2) {},
	subtract: function(exp1, exp2) {},
	power: function(exp1, exp2) {},
	outerPower: function(exp1, exp2) {},
	multiply: function(exp1, exp2) {},
	innerProduct: function(exp1, exp2) {},
	outerProduct: function(exp1, exp2) {},
	div: function(exp1, exp2) {},
	backdiv: function(exp1, exp2) {},

	funcall: function(name, args) {}
};

// Just a simple test that the parser recognises the language
exports.testRecognition = function(test) {
	parser.yy = nop_yy;

	parser.parse("a");
	parser.parse("e123");
	parser.parse("x + y");
	parser.parse("x~");
	parser.parse("x' + 1");
	parser.parse("x y")
	parser.parse("(x)");
	parser.parse("( x )");
	parser.parse("x ");
	parser.parse("x / y + 1");
	parser.parse("Pu(x,1)");
	test.done();
}

exports.testImplicitMultiplication = function(test) {
	parser.yy = nop_yy;

	parser.parse("a = 2e1 (e2 + e3)");
	parser.parse("a = 2e1 (e2 + e3) ");
	parser.parse("a = (2e1+e2)(e2 + e3)");
	parser.parse("e1 2");
	parser.parse("e1 2x");
	parser.parse("1 2");
	parser.parse("5(e1+e2)");
	parser.parse("x y");
	parser.parse("(e1+e2)x");
	test.done();
}

exports.testFuncall = function(test) {
	parser.yy = {
		number: parseFloat,
		funcall: function(id, args) {
			test.equal(id, "Pu");
			test.deepEqual(args, ["x", 1]);
		},
		assignment: function(id, exp) {
			test.equal(id, "ans");
		},
		identifier: function(name) {
			return name;
		}
        }
	parser.parse("Pu(x,1)");
	test.done();
}

exports.testTrivialPredecence = function(test) {
	parser.yy = {
		assignment: function(id, exp) {
			test.equal(id, "ans");
		},
		number: parseFloat,
		negate: function(exp) {
			return -exp;
		},
		add: function(exp1, exp2) {
			var result = exp1 + exp2;
			test.equal(result, -4);
		},
		multiply: function(exp1, exp2) {
			return exp1 * exp2;
		}
	}
	parser.parse("5 * -1 + 1");
	parser.parse("1 + -1 * 5");
	test.done();
}

exports.testWhitespaceMultiplication = function(test) {
	parser.yy = {
		number: parseFloat,
		assignment: function() {},
		add: function(exp1, exp2) {
			var result = exp1 + exp2;
			test.equal(result, 7);
			return result;
		},
		multiply: function(exp1, exp2) {
			return exp1 * exp2;
		}
	}
	parser.parse("2 3 + 1");
	test.done();

}
