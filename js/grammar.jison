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

%nonassoc ASSIGN
%left PLUS MINUS
%left PRODUCT OUTER DIV BACKDIV
%nonassoc WS
%nonassoc INNER
%right POWER OUTER_POWER
%left CONJUGATE INVOLUTION
%left UMINUS

%%
statement
	: exp opt-ws EOF -> $exp
	| identifier ASSIGN exp opt-ws EOF
	   -> yy.assignment($identifier, $exp)
        ;

opt-ws
	: WS
	|
	;

// TODO You'd probably want to create some sort of Var object;
// also diffrentiate between run-of-the-mill identifiers and
// basis vectors.
identifier
        : ID -> yy.identifier(yytext)
	;

number
	: NUMBER -> parseFloat(yytext)
	;

// NOTE collected in reverse order, flipped in exp
explist
	: exp -> [$exp]
	| exp COMMA explist
	  { $explist.push($exp); $$ = $explist; }
	;

exp
	: number
	| identifier
	| number identifier
	  -> yy.multiply($number, $identifier)
	| exp INVOLUTION
	  -> yy.involute($exp)
	| exp CONJUGATE
	  -> yy.conjugate($exp)
	| MINUS exp %prec UMINUS
	  -> yy.negate($exp)
	| exp WS exp // a multiplication; TODO
	  -> yy.multiply($exp1, $exp2);
	| LPAREN exp RPAREN -> $exp

	| exp PLUS exp
	   -> yy.add($exp1,$exp2)
	| exp MINUS exp
	   -> yy.subtract($exp1,$exp2)
	| exp POWER exp
	   -> yy.power($exp1,$exp2)
	| exp OUTER_POWER exp
	   -> yy.outerPower($exp1,$exp2)
	| exp PRODUCT exp
	   -> yy.multiply($exp1,$exp2)
	| exp INNER exp
	   -> yy.innerProduct($exp1,$exp2)
	| exp OUTER exp
	   -> yy.outerProduct($exp1,$exp2)
	| exp DIV exp
	   -> yy.div($exp1,$exp2)
	| exp BACKDIV exp
	   -> yy.backdiv($exp1,$exp2)

	| identifier LPAREN explist RPAREN
	  -> yy.funcall($identifier, $explist.reverse())
	;
