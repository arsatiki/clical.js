#!/bin/sh

export PATH=$PATH:$(npm bin)

pegjs clical.pegjs js/dev-parser.js
pegjs -e clicalparser clical.pegjs js/parser.js
