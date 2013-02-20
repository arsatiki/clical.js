// FIXME not possibly the best location for thi
var parser = require("../grammar").parser;
var lexer = parser.lexer;

exports.testNOP = function(test) {
    lexer.setInput("e123");
    var t = lexer.lex();
    test.equal(t, "ID");
    test.done();
}

