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

// TODO: Needs refactoring
function handle_input(event) {
	event.preventDefault();
	var form = event.target;
	var field = form.elements.namedItem("user-entry");
	var value = field.value;
	field.value = "";

	var statement = evaluator(value);
	
	var row = $("<li/>");
	var entry = $("<kbd/>").append("> " + value);

	row.append(entry);
	row.get(0).dataset.ans = statement.val;
	
	if (!statement.silent) {
		var result = toMathML(statement.var, statement.val);
		result.setAttribute("form", form.id);
		row.append(result);
	}

	$("#results").append(row);
	MathJax.Hub.Queue(["Typeset", MathJax.Hub, row.get(0)]);
}

$(function () {
	$("#command-line").on("submit", handle_input);
	
});