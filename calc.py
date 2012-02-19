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
    39 e12 + 2 e13 - 15 e23
    """
    terms = [Term(c, [k + 1]) for k, c in enumerate(coefficients)]
    return Expr(*terms)

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
        self.coefficient = coefficient * parity(dims)
        self.dimensions = tuple(sorted(dims))

    def key(self):
        return len(self.dimensions), self.dimensions

    def scaled(self, coefficient):
        return Term(coefficient * self.coefficient, self.dimensions)

    @property
    def isscalar(self):
        return self.dimensions == ()

    @staticmethod
    def combine(terms):
        reduced = defaultdict(int)
        for term in terms:
            reduced[term.dimensions] += term.coefficient
        terms = [Term(c, d) for d, c in reduced.items()]
        return terms

    def __xor__(self, other):
        """Outer product"""
        if set(self.dimensions) & set(other.dimensions):
            return Term(0, ())

        coef = self.coefficient * other.coefficient
        dims = self.dimensions + other.dimensions

        return Term(coef, dims)

    def __mul__(self, other):
        return self

    def __str__(self):
        """
        Scalars: coeff always shown, plus omitted, minus next to digit
        First component and stand-alone printing:
            1: sign and coeff omitted: e1 ...
            -1: sign next to base, coeff omitted: -e2
            other: plus omitted:  2 e3    -4 e1

        Rest:
            1: sign space base, coeff omitted: ... + e12
            -1: sign space base, coeff omitted: ... - e12
            +k: ... + 2 e12 ...
            -k: ... - 2 e12 ...
        """

        if self.isscalar:
            return str(self.coefficient)

        SIGN = {1: '', -1: '-'}

        cs = SIGN.get(self.coefficient, '%s ' % self.coefficient)
        bs = 'e' + ''.join(map(str, self.dimensions))

        return cs + bs

    def __repr__(self):
        """
        >>> Term(1, (1, 2))
        Term(1, (1, 2))

        """
        return "Term(%r, %r)" % (self.coefficient, self.dimensions)

    def __nonzero__(self):
        return self.coefficient != 0

class Expr(object):
    def __init__(self, *terms):
        """
        >>> print e(21) + e(1)
        e1 - e12
        """
        terms = Term.combine(terms)
        terms = filter(None, terms)
        self.terms = sorted(terms, key=Term.key)

    @staticmethod
    def _mangle(termstrings):
        termstrings = iter(termstrings)
        yield termstrings.next()
        for t in termstrings:
            yield '- ' + t[1:] if t.startswith('-') else '+ ' + t

    def __str__(self):
        if not self.terms:
            return '0'

        termstrings = map(str, self.terms)
        return " ".join(Expr._mangle(termstrings))

    def __add__(self, other):
        """
        >>> print 1 + e(1)
        1 + e1
        """
        if not hasattr(other, "terms"):
            return self + Expr(Term(other, ()))

        terms = self.terms + other.terms
        return Expr(*terms)

    __radd__ = __add__

    def __xor__(self, other):
        """
        >>> print (e(1) + e(2) + e(3)) ^ e(2)
        e12 - e23

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

        > >> print v(1, 2, 3) * v(1, 3, 5))
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