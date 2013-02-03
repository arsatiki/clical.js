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

exports.testAssignment = function(test) {
	var t = lexer.lexer("a = sin(pi)");
	var expected = ["IDENTIFIER a", "OP_EQUALS =", "IDENTIFIER sin",
	                "OPEN_PAREN (", "IDENTIFIER pi", "CLOSE_PAREN )",
	                "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testPosition = function(test) {
	var t = lexer.lexer("    a");
	assert.equal(t[0].pos, 4);
	assert.equal(t[0].value, "a");
	assert.equal(t[1].pos, 5);
	assert.equal(t[1].name, "EOF");
	test.done();
}