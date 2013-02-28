casper = require('casper').create({verbose: true})


casper.start 'index.html', ->
	@test.assertTitle 'Calculator'
	@test.assertSelectorExists '#command-line input[name=user-entry]',
		                   "Input field present"
	@test.assertSelectorExists '#results', "Results present"

casper.then ->
	@fill '#command-line', {'user-entry': '1+1'}, no
	@click '#command-line button'
	
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



