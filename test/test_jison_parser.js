// FIXME not possibly the best location for thi
var parser = require("../grammar").parser;

exports.testSimple = function(test) {
	parser.parse("a");
	parser.parse("e123");
	parser.parse("x + y");
	parser.parse("x~");
	parser.parse("x' + 1");
	parser.parse("x y")
	parser.parse("(x)");
	parser.parse("( x )");
	parser.parse("x ");
	test.done();
}