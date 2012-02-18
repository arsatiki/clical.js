import doctest
from permutations import parity
from collections import defaultdict

"""
A simple tool to verify the operations of the GA items.
"""

def e(dim = None):
    """
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

    return Expr(Term(1, E(dims)))

class E(object):
    """
    >>> E((1, 2)) == E((1, 2))
    True
    """

    def __init__(self, dimensions):
        self.sign = parity(dimensions)
        self.dimensions = tuple(sorted(dimensions))

    @property
    def _strdim(self):
        return map(str, self.dimensions)

    def __str__(self):
        return "e" + ''.join(self._strdim)

    def __repr__(self):
        return "E(%s)" % ', '.join(self._strdim)

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
    sign = 0
    def __nonzero__(self):
        return False

E0 = Ezero()

class Term(object):
    """
    >>> print Term(-1, E((1, 2)))
    -e12
    >>> print Term(1, E((2, 3)))
    e23
    >>> print Term(2, E((2, 3)))
    2 * e23
    """
    def __init__(self, coefficient, base):
        self.c = coefficient * base.sign
        self.b = base

    def __str__(self):
        if self.c == 1:
            return str(self.b)
        if self.c == -1:
            return "-" + str(self.b)
        return "%d * %s" % (self.c, self.b)

    def __nonzero__(self):
        return bool(self.c)

def basekey(b):
    return len(b.dimensions), b.dimensions

def termkey(t):
    return basekey(t.b)

class Expr(object):
    def __init__(self, *terms):
        """
        >>> print e(21) + e(1)
        e1 + e21
        """

        terms = filter(None, terms)
        self.terms = sorted(terms, key=termkey)

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
        d = defaultdict(int)
        for t in self.terms + other.terms:
            d[t.b] += t.c

        return Expr(*[Term(c, b) for b, c in d.items()])

    def __xor__(self, other):
        """
        >>> print (e(1) + e(2) + e(3)) ^ e(2)
        e12 -e23
        """
        terms = [Term(s.c * o.c, s.b ^ o.b)
                 for s in self.terms for o in other.terms]
        return Expr(*terms)

    def __mult__(self, other):
        """
        >>> print 2 * e(1)
        2 * e1

        >>> print (e(1) + 2 * e(2)) * e(3)
        e13 + 2 * e23

        """
        if hasattr(other, "terms"):
            return self._multexpr(other)
        return self._multcoeff(other)

    def _multexpr(self, other):
        return self

    def __rmul__(self, coefficient):
        """
        >>> print 2 * e(1)
        2 * e1
        """
        terms = [Term(coefficient * t.c, t.b) for t in self.terms]
        return Expr(*terms)

if __name__ == "__main__":

    doctest.testmod()