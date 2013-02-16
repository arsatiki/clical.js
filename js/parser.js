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

function parseBase(ts) {
	var k, b = [], base ="", sub;
	if (ts.peek.name == "BASISVECTOR")
		base = ts().value;

	for (k=1; k < base.length; k++) {
		sub = base.substring(k, k+1);
		b.push(parseInt(sub));
	}
	return b;
}

function parseCoefficient(ts) {
	if (ts.peek.name == "NUMBER")
		return parseFloat(ts().value);
	if (ts.peek.name == "BASISVECTOR")
		return 1;
	return undefined;
}

function parseFactor(ts) {
	var t, c, b;
	var k;

	c = parseCoefficient(ts);
	b = parseBase(ts);
	
	/* TODO: The API for new Multivectors is shite */
	return new Multivector([new Term(c, b)]);
}

function evalExpression(ts) {
	var left, right;

	left = parseFactor(ts);

	if (ts.peek.name == "EOF")
		return left;
	
	matchToken(ts, "OPERATOR", "+");
	right = evalExpression(ts);
	
	return left.plus(right);
}

