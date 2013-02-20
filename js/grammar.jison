%lex
%%
"e"[0-9]+  return "ID";
/lex

/* grammar section */
%start identifier

%%
identifier
	: ID
        ;
