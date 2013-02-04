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

function tokenize(input) {
	var getNextToken = lexer.lexer(input);
	var t;
	var tokens = [];

	do {
		t = getNextToken();
		tokens.push(t);
	} while(t.name != "EOF");

	return tokens;
}

exports.testSimple = function(test) {
	var t = tokenize(" foo ");
	assert.equal(flattenTokens(t), "IDENTIFIER foo, EOF");
	test.done();
};

exports.testNumbers = function(test) {
	var k, t;
	var cases = [["1", "NUMBER 1, EOF"],
	             ["1E2", "NUMBER 1E2, EOF"],
	             ["1E-2", "NUMBER 1E-2, EOF"],
	             ["1e+2", "NUMBER 1e+2, EOF"],
	             ["1e-2", "NUMBER 1e-2, EOF"],
	             ["1e2", "NUMBER 1, IDENTIFIER e2, EOF"],
	             ["1.0", "NUMBER 1.0, EOF"],
	             ["0.1", "NUMBER 0.1, EOF"],
	];
	for (k = 0; k < cases.length; k++) {
		t = flattenTokens(tokenize(cases[k][0]));
		assert.equal(t, cases[k][1]);
	}
	test.done();
};

exports.testOps = function(test) {
	var t = tokenize(" foo / (a + b) ");
	var expected = ["IDENTIFIER foo", "OPERATOR /", "OPEN_PAREN (",
	                "IDENTIFIER a", "OPERATOR +", "IDENTIFIER b",
	                "CLOSE_PAREN )", "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testLongOps = function(test) {
	var t = tokenize(" a ^^ c ** 2 ");
	var expected = ["IDENTIFIER a", "OPERATOR ^^", "IDENTIFIER c",
	                "OPERATOR **", "NUMBER 2", "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testError = function(test) {
	var t = tokenize("5 + #3");
	var expected = ["NUMBER 5", "OPERATOR +", "ERROR #3",
	                "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testAssignment = function(test) {
	var t = tokenize("a = sin(pi)");
	var expected = ["IDENTIFIER a", "OPERATOR =", "IDENTIFIER sin",
	                "OPEN_PAREN (", "IDENTIFIER pi", "CLOSE_PAREN )",
	                "EOF"].join(", ");
	assert.equal(flattenTokens(t), expected);
	test.done();
};

exports.testPosition = function(test) {
	var t = tokenize("    a");
	assert.equal(t[0].pos, 4);
	assert.equal(t[0].value, "a");
	assert.equal(t[1].pos, 5);
	assert.equal(t[1].name, "EOF");
	test.done();
}