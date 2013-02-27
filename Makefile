ARTEFACTS=js/grammar.js
BIN=node_modules/.bin

# TODO: Add npm bootstrapping here
# Depends on node_modules or package.json, probably
all: ${ARTEFACTS}
clean:
	rm ${ARTEFACTS}

js/grammar.js:
	${BIN}/jison --outfile $@ $(@:js=jison)

test: unittest uitest

unittest: ${ARTEFACTS} js/*.js test/*.js
	${BIN}/nodeunit --reporter minimal test

uitest: ${ARTEFACTS}
	casperjs test test/ui

.PHONY: all clean test unittest uitest