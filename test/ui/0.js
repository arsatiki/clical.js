var casper = require('casper').create({verbose: true, logLevel: "error"});

casper.start('index.html', function() {
    this.test.assertTitle("Calculator");
    this.test.assertSelectorExists("#input", "Input field exists");
    this.test.assertSelectorExists("#results", "Results field exists");
});

casper.run(function() {
    this.test.done(3); 
    this.test.renderResults(true);
});
