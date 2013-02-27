casper.start 'index.html', ->
	@test.assertTitle 'Calculator'
	@test.assertSelectorExists '#input', "Input field present"
	@test.assertSelectorExists '#results', "Results present"

casper.run ->
	@test.done(3)
	@test.renderResults yes



