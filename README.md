Background
==========

This project a reimplementation of CLICAL. The original CLICAL was created in
Helsinki University of Technology in 1987. From the [original documentation][original]:

> CLICAL is a stand-alone calculator-type computer program for geometric
> algebras of multivectors, called Clifford algebras. CLICAL evaluates
> elementary functions with arguments in complex numbers, and their
> generalizations: quaternions, octonions and multivectors in Clifford
> algebras. CLICAL works directly on intrinsic geometric objects:
> lines, planes and volumes, represented by vectors, bivectors and
> multivectors. Oriented volume elementes, or segments of subspaces,
> are represented by simple multivectors, which are homogeneous and
> decomposable elements in the exterior algebra. CLICAL works on
> Clifford algebras Cl_{p,q} of real non-degenerate quadratic spaces
> R^{p,q}.

> Clifford algebras are used to handle rotations and oriented
> subspaces. Clifford algebra is a user interface, which provides
> geometrical insight. However, the actual numerical computations are
> faster in matrix images of Clifford algebras. CLICAL computer program
> was developed to enable input-output in Clifford algebras (and fast
> internal computation in matrices).

> CLICAL is intended for researchers and teachers of Clifford algebras
> and spinors.

Why re-implement it?
====================

I think Geometric Algebras and Clifford Algebras are the neatest way of
explaining many physical phenomena. For example, replacing the concept of the axis of rotation with a _plane_ of rotation gives you information about the orientation of rotation. This means that even when you switch from right-handed coordinate system to a left-handed system, there will be no unphysical axis reversal.

This project is my attempt at bringing geometric algebra to a wider audience.
CLICAL had a pleasant syntax, but running it in a modern computer can be a bit
underwhelming. On the Web it can be used from anywhere on the world; also the output can be a lot prettier.

Other information
=================

Target environment is HTML5 compatible browser.

Some initial prototyping is done with Python.

[original]: http://users.tkk.fi/ppuska/mirror/Lounesto/CLICAL.htm