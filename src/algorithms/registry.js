import { generateGSSteps, DEFAULT_GS_INPUT, randomizeGSInput } from './gsMatching.js';

export { DEFAULT_GS_INPUT, randomizeGSInput };

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
  },
];
