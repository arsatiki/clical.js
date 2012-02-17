import doctest

def parity(p):
    """A stub for two element lists
    
    >>> parity((3, 4))
    1
    >>> parity((2,1))
    -1
    """
    if len(p) < 2:
        return 1
    return 1 if p[0] < p[1] else -1 

if __name__ == '__main__':
    doctest.testmod()