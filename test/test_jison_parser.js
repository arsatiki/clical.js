// FIXME not possibly the best location for thi
var parser = require("../grammar").parser;
var yy = require("../js/yy").yy;

// Just a simple test that the parser recognises the language

exports.testRecognition = function(test) {
	parser.yy = yy;
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

exports.testFuncall = function(test) {
	parser.yy = {
		funcall: function(id, args) {
			test.equal(id, "Pu");
			test.deepEqual(args, ["x", 1]);
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
