%lex
%%
[0-9]*\.?[0-9]+((E[-+]?|e[-+])[0-9]+)? return "NUMBER";
[_a-zA-Z][_a-zA-Z0-9]*\b          return "ID";
"'"                               return "INVOLUTION";
"~"                               return "CONJUGATE";
// Ignore WS after opening paren and before closing paren
"("\s*                            return "LPAREN";
\s*")"                            return "RPAREN";
// ignore whitespace around binary operators
\s*"**"\s*                        return "POWER";
\s*"^^"\s*                        return "OUTER_POWER";
\s*"+"\s*                         return "PLUS";
\s*"-"\s*                         return "MINUS";
\s*"*"\s*                         return "PRODUCT"
\s*"."\s*                         return "INNER";
\s*"^"\s*                         return "OUTER";
\s*"/"\s*                         return "DIV";
\s*"\\"\s*                        return "BACKDIV";
\s*","\s*                         return "COMMA";
\s*"="\s*                         return "ASSIGN";
// All remaining whitespace is probably semantic
\s+                               return "WS";
<<EOF>>                           return "EOF";
/lex

/* grammar section */
%start statement

%nonassoc WS
%nonassoc ASSIGN
%left PLUS MINUS
%left CONJUGATE INVOLUTION
%left UMINUS

%%
statement
	: exp opt-ws EOF
	| identifier ASSIGN exp opt-ws EOF
        ;

opt-ws
	: WS
	|
	;

// TODO You'd probably want to create some sort of Var object;
// also diffrentiate between run-of-the-mill identifiers and
// basis vectors.
identifier
        : ID -> yytext
	;

number
	: NUMBER -> parseFloat(yytext)
	;

exp
	: number
	| identifier
	| NUMBER ID // E.g. 2e12, but also 2x; TODO
	| exp INVOLUTION // TODO
	| exp CONJUGATE // TODO
	| MINUS exp %prec UMINUS   // TODO
	| exp WS exp // a multiplication; TODO

	| LPAREN exp RPAREN -> $exp
        | exp PLUS exp -> $exp1 + $exp2 // TODO real impl
	;
/*
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
	|
*/