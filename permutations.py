import doctest

def parity(p):
    """Returns the parity of the permutation

    >>> parity((3, 4))
    1
    >>> parity((2,1))
    -1
    >>> parity((1, 2, 6, 5))
    -1
    """

    f = dict(zip(sorted(p), p))
    seen, neven = set(), 0

    for x in p:
        if x in seen:
            continue

        c, l = x, 0
        while c not in seen:
            seen.add(c)
            l += 1
            c = f[c]

        neven += (l - 1) % 2

    return 1 if neven % 2 == 0 else -1


def jig(a, b):
    """
    >>> jig('1', '1')
    (1, [])
    >>> jig('12', '1')
    (-1, ['2'])
    >>> jig('12', '2')
    (1, ['1'])
    >>> jig('1', '12')
    (1, ['2'])
    >>> jig('2', '12')
    (-1, ['1'])
    
    """
    # Assumptions:
    # elements are unique per list
    out = list(a)
    sign = 1
    for x in b:
        if x not in out:
            out.append(x)
        else:
            swaps = len(out) - out.index(x) - 1
            sign *= (-1) ** swaps
            out.remove(x)
    return sign, out


if __name__ == '__main__':
    doctest.testmod()