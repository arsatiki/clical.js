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
\s*";"\s*                         return "SEMICOLON";
// All remaining whitespace is probably semantic
\s+                               return "WS";
<<EOF>>                           return "EOF";
/lex

/* grammar section */
%start statement

%nonassoc ASSIGN
%left PLUS MINUS
%left WS PRODUCT OUTER DIV BACKDIV
%nonassoc INNER
%right POWER OUTER_POWER
%left CONJUGATE INVOLUTION
%left UMINUS

%%
statement
	: exp opt_sc EOF
	   { return yy.assignment("ans", $exp, $opt_sc); }
	| $ID ASSIGN exp opt_sc EOF
	   { return yy.assignment($ID, $exp, $opt_sc); }
        ;

opt-ws
	: WS
	|
	;

// semicolon eats whitespace around it, so no need to check for WS
// if it is present
opt_sc
	: SEMICOLON -> true
	| opt-ws -> false
	;

// TODO You'd probably want to create some sort of Var object;
// also diffrentiate between run-of-the-mill identifiers and
// basis vectors.
identifier
        : ID -> yy.identifier(yytext)
	;

number
	: NUMBER -> yy.number(yytext)
	;

// NOTE collected in reverse order, flipped in exp
explist
	: exp -> [$exp]
	| exp COMMA explist
	  { $explist.push($exp); $$ = $explist; }
	;

concat_mult
	: number identifier
	  -> yy.multiply($number, $identifier)
	| number number
	  -> yy.multiply($number1, $number2)
	| number paren_exp
	  -> yy.multiply($number, $paren_exp)
	| identifier number
	  -> yy.multiply($number, $identifier)
	| identifier identifier
	  -> yy.multiply($identifier1, $identifier2)
	// No identifier paren_exp; can be a function call
	| paren_exp identifier
	  -> yy.multiply($paren_exp, $identifier)
	| paren_exp number
	  -> yy.multiply($paren_exp, $number)
	| paren_exp paren_exp
	  -> yy.multiply($paren_exp1, $paren_exp2)
	;

paren_exp
	: LPAREN exp RPAREN -> $exp
	;

exp
	: number
	| identifier
	| concat_mult
	| paren_exp
	| exp INVOLUTION
	  -> yy.involute($exp)
	| exp CONJUGATE
	  -> yy.conjugate($exp)
	| MINUS exp %prec UMINUS
	  -> yy.negate($exp)
	| exp WS exp // a multiplication; TODO
	  -> yy.multiply($exp1, $exp2);

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
