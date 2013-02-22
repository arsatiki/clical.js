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
	test.done();
}
