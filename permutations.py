import doctest

# TODO: 
# Give p and p-target, send sorted(p) as an argument?
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
    >>> jig('12', '12')
    (-1, [])
    
    """
    c = list(a+b)
    sign = 1
    d = {} # dim -> idx
    r = {} # dim -> removal count
    removals = 0
    pseudoidx = 0
    for x in c:
        if x not in d:
            d[x] = pseudoidx
            pseudoidx += 1
        else:
            sign *= (-1) ** ((pseudoidx - d[x]) -1)
            del d[x]
            removals += 1
    # Reassemble the pieces
    out = [x for x in c if x in d]
    return int(sign), out

if __name__ == '__main__':
    doctest.testmod()
