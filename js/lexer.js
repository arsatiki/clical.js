var lexer = (function(){
	var makePattern = function(name, regex) {
		var anchored = new RegExp("^" + regex.source);
		return {name: name, regex: anchored};
	};

	var makeToken = function(name, value, pos) {
		return {name: name, value: value, pos: pos};
	};

	var NO_MATCH = {value: null, found: false,
	                length: 0, name: "NO_MATCH"};

	var match = function(pattern, input) {
		var r = pattern.regex;
		var m = r.exec(input);
		if (!m)
			return NO_MATCH;

		return {name: pattern.name, value: m[0],
			found: true, length: m[0].length};
	};

	var patterns = [
		makePattern("WHITESPACE", /\s+/),
		makePattern("IDENTIFIER", /[a-z]\w*/),
		makePattern("OPEN_PAREN", /\(/),
		makePattern("CLOSE_PAREN", /\)/),
		makePattern("NUMBER", /[0-9]*\.?[0-9]+((E[-+]?|e[-+])[0-9]+)?/),
		makePattern("OPERATOR", /(\*\*|\^\^|[-+.*^/\\~''=])/),
		// EOF and ERROR defined below
	];

	var getTokenAt = function(input, pos) {
		var k;
		var longest_match = NO_MATCH;

		if (pos >= input.length)
			return makeToken("EOF", "", pos);

		var input_tail = input.substr(pos);

		for (k = 0; k < patterns.length; k++) {
			m = match(patterns[k], input_tail);
			if (m.found && m.length > longest_match.length)
				longest_match = m;
		}

		if (longest_match == NO_MATCH)
			return makeToken("ERROR", input_tail, pos);

		return makeToken(longest_match.name,
		                 longest_match.value, pos);
	};

	var _lexer_factory = function(input) {
		var pos = 0;
		var getNextToken = function() {
			var t;
			do {
				t = getTokenAt(input, pos);
				pos = pos + t.value.length;

			} while (t.name == "WHITESPACE");
			return t;
		};
		return getNextToken;
	};

	return _lexer_factory;
})();

exports.lexer = lexer;
