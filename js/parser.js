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

function matchToken(ts, tokentype, value) {
	var t = ts();
	if (tokentype != t.name)
		return false;
	if (value !== undefined && value !== t.value)
		return false;
	return true;
}

/* Parse e123 string into [1, 2, 3] */
function parseBase(base) {
	var k, b = [], sub;
	for (k=1; k < base.length; k++) {
		sub = base.substring(k, k+1);
		b.push(parseInt(sub));
	}
	return b;
}

function evalFactor(ts) {
	var t, c, b;
	var k;

	t = ts();
	
	if (t.name != "NUMBER") {
		return undefined;
	}

	c = parseFloat(t.value);
	b = [];
	if (ts.peek.name == "BASISVECTOR") {
		t = ts();
		b = parseBase(t.value);
	}
	
	/* TODO: The API for Multivectors is shite */
	return new Multivector([new Term(c, b)]);
}

function evalExpression(ts) {
	var left, right;

	left = evalFactor(ts);
	console.log("Received", left, "Next token is", ts.peek);

	if (ts.peek.name == "EOF")
		return left;
	
	matchToken(ts, "OPERATOR", "+");
	right = evalExpression(ts);
	
	return left.plus(right);
}

