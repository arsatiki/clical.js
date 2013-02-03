var exports = exports || {};

var lexer = (function(){
	var makePattern = function(name, regex) {
		var anchored = new RegExp("^" + regex.source);
		return {name: name, regex: anchored};
	};
	
	var makeToken = function(name, value) {
		return {name: name, value: value};
	};
	
	var match = function(pattern, input) {
		var r = pattern.regex;
		var m = r.exec(input);
		if (m) return m[0];
		return null;
	};
	
	var patterns = [
		makePattern("IDENTIFIER", /[a-z][a-z0-9]*/),
		makePattern("OPEN_PAREN", /\(/),
		makePattern("CLOSE_PAREN", /\)/),
		makePattern("NUMBER", /\d+/),
		makePattern("OP_HAT", /\^/),
		makePattern("OP_DOT", /\./),
		makePattern("OP_MULT", /\*/),
		makePattern("OP_MINUS", /-/),
		makePattern("OP_PLUS", /\+/),
		makePattern("OP_DIV", /\//),
		makePattern("OP_REVDIV", /\\/),
		makePattern("OP_POWER", /\*\*/),
		makePattern("OP_OUTER_POWER", /\^\^/),
		makePattern("OP_INVOLUTION", new RegExp("'")),
		makePattern("OP_CONJUGATE", /~/),
		// EOF and ERROR defined below
	];
	
	var getNextToken = function(input) {
		var k;
		var longest_match = "";
		var matching_pattern = null;
		var p;
		
		if (!input)
			return makeToken("EOF", "");
		
		for (k = 0; k < patterns.length; k++) {
			p = patterns[k];
			m = match(p, input);
			if (!m)
				continue;
				
			if (m.length > longest_match.length) {
				longest_match = m;
				matching_pattern = p;
			}
			
		}
		
		if (matching_pattern == null)
			return makeToken("ERROR", input);
		
		return makeToken(matching_pattern.name, longest_match);
	};
	
	var _lexer = function(input) {
		var tokens = [];
		var t;
		do {
			input = input.trimLeft();
			t = getNextToken(input);
			tokens.push(t);
			input = input.substr(t.value.length);
		} while (t.name != "EOF");

		return tokens;
	};
	
	return _lexer;
})();

exports.lexer = lexer;
