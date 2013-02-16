/* Wrap a token generator with a lookahead shim. */
function lookahead(f) {
	var newf = function() {
		var value = newf.peek;
		newf.peek = f();
		return value;
	};
	newf();
	return newf;
}

