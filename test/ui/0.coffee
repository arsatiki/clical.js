casper = require('casper').create({verbose: true})


casper.start 'index.html', ->
	@test.assertTitle 'Calculator'
	@test.assertSelectorExists '#input', "Input field present"
	@test.assertSelectorExists '#results', "Results present"

casper.then ->
	@fill('#input-wrapper', {'input': '1+1'}, yes)
	
casper.waitForSelector '#results li'

casper.then ->
	@capture 'wut.png'

casper.run ->
	@test.done(4)
	@test.renderResults yes
	@exit()



