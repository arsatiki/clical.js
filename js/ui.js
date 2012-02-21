function eval_input(event) {
	var value = event.target.value;
	event.target.value = "";

	$("#results").append('<li>' + value + '</li>');
	event.stopPropagation();
}

$(function () {
	$("#input").on("change", eval_input);
});