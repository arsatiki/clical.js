%lex
%%
// Whitespace is handled within the grammar
\s+                               return "_";
[0-9]*\.?[0-9]+((E[-+]?|e[-+])[0-9]+)? return "NUMBER";
[_a-zA-Z][_a-zA-Z0-9]*\b          return "ID";
"("                               return "LPAREN";
")"                               return "RPAREN";
<<EOF>>                           return "EOF";
"**"                              return "POWER";
"^^"                              return "OUTER_POWER";
"'"                               return "INVOLUTION";
"~"                               return "CONJUGATE";
"+"                               return "PLUS";
"-"                               return "MINUS";
"*"                               return "PRODUCT"
"."                               return "INNER";
"^"                               return "OUTER";
"/"                               return "DIV";
"\\"                              return "BACKDIV";
","                               return "COMMA";
/lex

/* grammar section */
%start identifier

%%
identifier
	: ID
        ;
