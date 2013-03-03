function createMathElement(name) {
	var MATHML = "http://www.w3.org/1998/Math/MathML";
	return document.createElementNS(MATHML, name);
}
function createMathElementAndText(name, data) {
	var e = createMathElement(name);
	e.appendChild(document.createTextNode(data));
	return e;
}

function mn(n) { return createMathElementAndText("mn", n); }
function mo(op) { return createMathElementAndText("mo", op); }
function mi(id) { return createMathElementAndText("mi", id); }

function appendTerm(parent, sign, magnitude, bases) {
	var coeff, e, b, sub;
	
	var omit_number = (magnitude == 1 && bases.length > 0);
	coeff = omit_number? sign: sign + magnitude;
	
	if (coeff)
		parent.appendChild(mn(coeff));
	
	if (bases.length > 0) {
		e = mi("e");
		b = mn(bases.join(""));
		sub = createMathElement("msub");

		parent.appendChild(sub);
		sub.appendChild(e);
		sub.appendChild(b);
	}
}

function toMathML(variable, mv) {
	var k, t;
	var mvList = mv.outputFormat();

	var out = document.createElement("output");
	var math = createMathElement("math");
	var mrow = createMathElement("mrow");
	out.appendChild(math);
	math.appendChild(mrow);

	mrow.appendChild(mi(variable));
	mrow.appendChild(mo("="));

	t = mvList[0];
	if (t.sign == '+')
		t.sign = "";
	
	appendTerm(mrow, t.sign, t.magnitude, t.dimensions);

	for (k=1; k < mvList.length; k++) {
		t = mvList[k];

		mrow.appendChild(mo(t.sign));
		appendTerm(mrow, "", t.magnitude, t.dimensions);
	}

	return out;
}

function isCommand(entry) {
	return false;
}

function handleCommand(entry) {
	return;
}

function handleStatement(entry, row_el, source) {
	var statement = evaluator(entry);

	row_el.dataset.ans = statement.val;
	
	if (!statement.silent) {
		var result = toMathML(statement.var, statement.val);
		result.setAttribute("form", source);
		return result;
	}
}

function readEntry(event) {
	event.preventDefault();
	var form = event.target;
	var field = form.elements.namedItem("user-entry");
	var value = field.value;
	field.value = "";
	return value;
}

function fmtUserEcho(entry) {
	var kbd = document.createElement("kbd");
	kbd.appendChild(document.createTextNode("> " + entry));
	return kbd;
}

// TODO: Needs refactoring
function handleInput(event) {
	var entry = readEntry(event);
	var results = document.getElementById("results");
	var row = document.createElement("li");
	var output;

	results.appendChild(row);
	row.appendChild(fmtUserEcho(entry));

	if (isCommand(entry))
		output = handleCommand(entry);
	else
		output = handleStatement(entry, row, event.target.id);

	if (output) {
		row.appendChild(output);		
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, output]);
	}
}
document.getElementById("command-line").
	addEventListener("submit", handleInput, false);
