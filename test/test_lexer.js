var lexer = require('../js/lexer.js'),
    assert = require('assert');

function flattenTokens(tokens) {
	var out = [];
	var k, t;
	for (k = 0; k < tokens.length; k++) {
		t = tokens[k];
		if (t.value) {
			out.push(t.name + " " + t.value);
		} else {
			out.push(t.name);
		}
	}

	return out.join(", ");
}

exports.testSimple = function(test) {
	var t = lexer.lexer(" foo ");
	assert.equal(flattenTokens(t), "IDENTIFIER foo, EOF");
	test.done();
};

exports.testOps = function(test) {
	var t = lexer.lexer(" foo / (a + b) ");
	var expected = ["IDENTIFIER foo", "OP_DIV /", "OPEN_PAREN (",
	                "IDENTIFIER a", "OP_PLUS +", "IDENTIFIER b",
	                "CLOSE_PAREN )", "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testError = function(test) {
	var t = lexer.lexer("5 + #3");
	var expected = ["NUMBER 5", "OP_PLUS +", "ERROR #3",
	                "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

