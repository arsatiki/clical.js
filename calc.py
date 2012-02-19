import doctest
from permutations import parity
from collections import defaultdict

"""
A simple tool to verify the operations of the GA items.
"""

def e(dim = None):
    """
    e(integer) -> A single-term expression.
    
    The indices of the base are extracted from the base-ten representation.
    This naturally limits the dimensions to less than 10, which is more
    than enough for real-world applications.
    
    >>> print e(123)
    e123

    >>> print e(1) ^ e(2)
    e12

    >>> print e(2) ^ e(1)
    -e12

    >>> print e(12) + e(23)
    e12 + e23

    >>> print e(123) + e(132)
    0

    """

    dims = map(int, str(int(dim))) if dim else ()

    return Expr(Term(1, dims))

def v(*coefficients):
    """
    v(c_1, c_2, c_3, ...) -> a vector expression with coefficients c_k
    
    >>> print v(2, 4, 6)
    2 e1 + 4 e2 + 6 e3
    
    >>> print v(3, -3, 1) ^ v(4, 9, 2)
    39 e12 + 2 e13 -15 e23
    """
    terms = [Term(c, [k + 1]) for k, c in enumerate(coefficients)]
    return Expr(*terms)

class E(object):
    """
    >>> E((1, 2)) == E((1, 2))
    True
    """

    def __init__(self, dimensions):
        self.dimensions = tuple(dimensions)

    def normalized(self):
        sign = parity(self.dimensions)
        dims = sorted(self.dimensions)
        return sign, E(dims)

    def __xor__(self, other):
        """Outer product for bases"""
        if set(self.dimensions) & set(other.dimensions):
            return E0
        return E(self.dimensions + other.dimensions)

    def __eq__(self, other):
        return self.dimensions == other.dimensions

    def __hash__(self):
        return hash(self.dimensions)

class Ezero(object):
    dimensions = ()
    def normalized(self):
        return 0, self
    def __nonzero__(self):
        return False

E0 = Ezero()

class Term(object):
    """
    >>> print Term(-1, (1, 2))
    -e12
    >>> print Term(1, (2, 3))
    e23
    >>> print Term(2, (2, 3))
    2 e23
    """
    def __init__(self, coefficient, dims):
        base = E(dims)
        sign, normbase = base.normalized()
        self.c = coefficient * sign
        self.b = normbase

    def key(self):
        return len(self.b.dimensions), self.b.dimensions

    def scaled(self, coefficient):
        return Term(coefficient * self.c, self.b.dimensions)

    @staticmethod
    def combine(terms):
        reduced = defaultdict(int)
        for term in terms:
            reduced[term.b] += term.c
        terms = [Term(c, b.dimensions) for b, c in reduced.items()]
        return terms

    def __xor__(self, other):
        coef = self.c * other.c
        base = self.b ^ other.b
        if base is E0:
            coef = 0
        return Term(coef, base.dimensions)

    def __mul__(self, other):
        return self

    def __str__(self):
        SIGN = {1: '', -1: '-'}
        
        cs = SIGN.get(self.c, '%d ' % self.c)
        bs = 'e' + ''.join(map(str, self.b.dimensions))
        
        return cs + bs

    def __nonzero__(self):
        return self.c != 0

class Expr(object):
    def __init__(self, *terms):
        """
        >>> print e(21) + e(1)
        e1 -e12
        """
        terms = Term.combine(terms)
        terms = filter(None, terms)
        self.terms = sorted(terms, key=Term.key)

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
        """
        >>> print 2 + e(1)
        2 e + e1
        """
        if not hasattr(other, "terms"):
            return self + Expr(Term(other, ()))
        
        terms = self.terms + other.terms
        return Expr(*terms)

    __radd__ = __add__

    def __xor__(self, other):
        """
        >>> print (e(1) + e(2) + e(3)) ^ e(2)
        e12 -e23
        
        >>> v = e(1) + e(2)
        >>> print v^v
        0
        """
        terms = [s ^ o for s in self.terms for o in other.terms]
        return Expr(*terms)

    def __mul__(self, other):
        """
        >> > print e(1) * e(1)
        1
        >> > print e(12) * e(1)
        -e2
        >> > print e(2) * e(12)
        -e1
        >> > print e(12) * e(12)
        -1
        
        > >> print v(1, 2, 3) v(1, 3, 5))
        22 + e12 + 2 e13 + e23
        """
        terms = [s * o for s in self.terms for o in other.terms]
        return Expr(*terms)

    def __rmul__(self, coefficient):
        """
        >>> print 2 * e(1)
        2 e1
        """
        terms = [t.scaled(coefficient) for t in self.terms]
        return Expr(*terms)

if __name__ == "__main__":

    doctest.testmod()