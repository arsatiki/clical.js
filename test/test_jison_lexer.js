var parser = require("../js/grammar").parser;
var lexer = parser.lexer;

exports.testSimple = function(test) {
	lexer.setInput("e123 (   ) ** * x~ blerp 2e+12 2e12 1E10 a,b");
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "WS");
	test.equal(lexer.lex(), "LPAREN");
	test.equal(lexer.lex(), "RPAREN");
	test.equal(lexer.lex(), "POWER");
	test.equal(lexer.lex(), "PRODUCT");
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "CONJUGATE");
	test.equal(lexer.lex(), "WS");
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "WS");
	// 2e+12
	test.equal(lexer.lex(), "NUMBER");
	test.equal(lexer.lex(), "WS");
	// 2
	test.equal(lexer.lex(), "NUMBER");
	// e12
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "WS");
	test.equal(lexer.lex(), "NUMBER");
	test.equal(lexer.lex(), "WS");
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "COMMA");
	test.equal(lexer.lex(), "ID");
	test.equal(lexer.lex(), "EOF");

	test.done();
}

