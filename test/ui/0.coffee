casper = require('casper').create({verbose: true})


casper.start 'index.html', ->
	@test.assertTitle 'Calculator'
	@test.assertSelectorExists '#input', "Input field present"
	@test.assertSelectorExists '#results', "Results present"

casper.then ->
	@fill '#input-wrapper', {'input': '1+1'}, no
	@click '#input-wrapper button'
	
casper.waitForSelector '#results li', null, null, 10000

casper.then ->
	@test.assertEvalEquals(->
		e = __utils__.findOne('#results li:last-child')
		e.dataset.ans
	, '(2 e)', 'Simple addition works'	
	)

casper.run ->
	@test.renderResults yes
	@exit()



