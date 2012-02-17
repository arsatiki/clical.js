import doctest
from permutations import parity

"""
A simple tool to verify the operations of the GA items.
"""

def e(dim = None):
    """
    >>> print e(123)
    e123

    > >> e(1) ^ e(2)
    e12
    
    >>> print e(12) + e(23)
    e12 + e23

    >>> print e(12) + e(21)
    0
        
    """

    dims = map(int, str(int(dim))) if dim else ()
    
    s, base = parity(dims), E(*sorted(dims))
    return Expr(Term(s, base))

class E(object):
    """
    >>> E(1, 2) == E(1, 2)
    True
    """

    def __init__(self, *dimensions):
        self.dimensions = tuple(dimensions)
    
    @property
    def _strdim(self):
        return map(str, self.dimensions)
    
    def __str__(self):
        return "e" + ''.join(self._strdim)
    
    def __repr__(self):
        return "E(%s)" % ', '.join(self._strdim)
    
    def __xor__(self, other):
        """Outer product for bases"""
        pass
    
    def __eq__(self, other):
        return self.dimensions == other.dimensions
    
    def __hash__(self):
        return hash(self.dimensions)
    
class Term(object):
    """
    >>> print Term(-1, E(1, 2))
    -e12
    >>> print Term(1, E(2, 3)) 
    e23
    >>> print Term(2, E(2, 3))
    2 * e23
    """
    def __init__(self, coefficient, base):
        self.c = coefficient
        self.b = base
    
    def __str__(self):
        if self.c == 1:
            return str(self.b)
        if self.c == -1:
            return "-" + str(self.b)
        return "%d * %s" % (self.c, self.b)
    
    def __nonzero__(self):
        return bool(self.c)
    
class Expr(object):
    def __init__(self, *terms):
        self.terms = filter(None, terms)

    def __str__(self):
        if not self.terms:
            return '0'

        terms = iter(self.terms)
        items = [str(terms.next())]

        for t in terms:
            # TODO: Move t.c outta here
            sign = "+ " if t.c > 0 else ""
            items.append(sign + str(t))

        return " ".join(items)

    def __add__(self, other):
        d = {}
        for t in self.terms:
            d[t.b] = t.c
        for t in other.terms:
            if t.b in d:
                d[t.b] += t.c
            else:
                d[t.b] = t.c
        return Expr(*[Term(c, b) for b, c in d.items()])

if __name__ == "__main__":

    doctest.testmod()