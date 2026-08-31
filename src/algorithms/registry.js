import { generateGSSteps, DEFAULT_GS_INPUT, randomizeGSInput } from './gsMatching.js';
import { generateCSSteps, DEFAULT_CS_INPUT, randomizeCSInput } from './coordinateSearch.js';

export const ALGORITHMS = [
  {
    id: 'gale-shapley',
    name: 'Gale-Shapley (Stable Matching)',
    course: 'INF234',
    category: 'Greedy',
    description: 'Finds a stable matching between two equal-sized groups using a propose-and-reject strategy.',
    complexity: {
      time: { worst: 'O(n²)' },
      space: 'O(n²)',
    },
    pseudocode: `GaleShapley(proposers, acceptors):
  free ← all proposers
  next ← {p: 0 for each proposer p}   // next proposal index

  while free is not empty:
    p ← first free proposer
    w ← proposerPrefs[p][next[p]]
    next[p]++

    if w is free:
      match(p, w)
      remove p from free

    else if w prefers p over current(w):
      free p's current partner
      match(p, w)
      remove p from free

    // else w rejects p, p stays free

  return matching`,
    explanation: `The Gale-Shapley algorithm solves the Stable Matching problem: given n proposers and n acceptors, each with a complete preference ranking, find a matching with no "blocking pair" — a pair (p, w) who both prefer each other over their assigned partners. GS always terminates in O(n²) proposals and always produces a stable matching that is optimal for the proposing side.`,
    visualizerType: 'bipartite',
    defaultInput: DEFAULT_GS_INPUT,
    generateSteps: (input) => generateGSSteps(input || DEFAULT_GS_INPUT),
    randomize: () => randomizeGSInput(4),
  },
  {
    id: 'coordinate-search',
    name: 'Coordinate Search',
    course: 'INF379',
    category: 'Optimization',
    description: 'Minimizes a function by probing axis-aligned moves and halving the step size when no improvement is found.',
    complexity: {
      time: { worst: 'O(d · iterations)' },
      space: 'O(iterations)',
    },
    pseudocode: `CoordinateSearch(f, x₀, step):
  x ← x₀

  while step ≥ ε:
    best ← x
    bestVal ← f(x)

    for each axis direction d:
      candidate ← x + step · d
      if f(candidate) < bestVal:
        bestVal ← f(candidate)
        best ← candidate

    if best ≠ x:
      x ← best        // move to best neighbor
    else:
      step ← step / 2  // no improvement: reduce step

  return x`,
    explanation: `Coordinate Search (also called Pattern Search) minimizes a function by testing small moves along each coordinate axis. At each iteration it picks the best neighboring point; if no neighbor improves the objective it halves the step size. The algorithm converges when the step size falls below a threshold. It requires no gradient information, making it suitable for non-differentiable or black-box functions.`,
    visualizerType: 'contour',
    defaultInput: DEFAULT_CS_INPUT,
    generateSteps: (input) => generateCSSteps(input || DEFAULT_CS_INPUT),
    randomize: () => randomizeCSInput(),
  },
];
