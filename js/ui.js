function lifmt(value, answer) {
	var input = $('<span class="user_input" />').append(value);
	var ansp = $('<span class="answer">').append("ans = " + answer);
	return $("<li/>").append(input).append(ansp);
	
}

function eval_input(event) {
	var value = event.target.value;
	event.target.value = "";

	var parsed = clicalparser.parse(value);

	$("#results").append(lifmt(value, parsed));
	event.stopPropagation();
}

$(function () {
	$("#input").on("change", eval_input);
});