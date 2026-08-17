function* gsMatchingGenerator({ proposers, acceptors, proposerPrefs, acceptorPrefs }) {
  const free = [...proposers];
  const matchP = {};
  const matchA = {};
  const nextPropose = {};

  for (const p of proposers) nextPropose[p] = 0;

  yield {
    free: [...free],
    matchP: { ...matchP },
    matchA: { ...matchA },
    proposing: null,
    rejected: null,
    upgraded: null,
    done: false,
    description: `All ${proposers.length} proposers are free. Each will propose in order of their preference list.`,
  };

  while (free.length > 0) {
    const p = free[0];
    const w = proposerPrefs[p][nextPropose[p]];
    nextPropose[p]++;

    yield {
      free: [...free],
      matchP: { ...matchP },
      matchA: { ...matchA },
      proposing: { from: p, to: w },
      rejected: null,
      upgraded: null,
      done: false,
      description: `${p} proposes to ${w} (rank ${nextPropose[p]} on ${p}'s list).`,
    };

    if (!matchA[w]) {
      matchA[w] = p;
      matchP[p] = w;
      free.shift();

      yield {
        free: [...free],
        matchP: { ...matchP },
        matchA: { ...matchA },
        proposing: null,
        rejected: null,
        upgraded: { p, w },
        done: false,
        description: `${w} is free and accepts ${p}. Tentative match: (${p}, ${w}).`,
      };
    } else {
      const p2 = matchA[w];
      const wPref = acceptorPrefs[w];
      const rankP = wPref.indexOf(p);
      const rankP2 = wPref.indexOf(p2);

      if (rankP < rankP2) {
        matchA[w] = p;
        matchP[p] = w;
        delete matchP[p2];
        free.shift();
        free.push(p2);

        yield {
          free: [...free],
          matchP: { ...matchP },
          matchA: { ...matchA },
          proposing: null,
          rejected: { proposer: p2, by: w },
          upgraded: { p, w },
          done: false,
          description: `${w} prefers ${p} (rank ${rankP + 1}) over current partner ${p2} (rank ${rankP2 + 1}). ${p2} is freed.`,
        };
      } else {
        yield {
          free: [...free],
          matchP: { ...matchP },
          matchA: { ...matchA },
          proposing: null,
          rejected: { proposer: p, by: w },
          upgraded: null,
          done: false,
          description: `${w} rejects ${p} (rank ${rankP + 1}) — prefers current partner ${p2} (rank ${rankP2 + 1}).`,
        };
      }
    }
  }

  yield {
    free: [],
    matchP: { ...matchP },
    matchA: { ...matchA },
    proposing: null,
    rejected: null,
    upgraded: null,
    done: true,
    description: `Stable matching complete! All ${proposers.length} pairs are stably matched.`,
  };
}

export function generateGSSteps(input) {
  const steps = [];
  for (const step of gsMatchingGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_GS_INPUT = {
  proposers: ['m1', 'm2', 'm3', 'm4'],
  acceptors: ['w1', 'w2', 'w3', 'w4'],
  proposerPrefs: {
    m1: ['w1', 'w2', 'w3', 'w4'],
    m2: ['w1', 'w3', 'w2', 'w4'],
    m3: ['w2', 'w1', 'w3', 'w4'],
    m4: ['w3', 'w2', 'w1', 'w4'],
  },
  acceptorPrefs: {
    w1: ['m2', 'm3', 'm1', 'm4'],
    w2: ['m3', 'm1', 'm2', 'm4'],
    w3: ['m4', 'm1', 'm2', 'm3'],
    w4: ['m1', 'm2', 'm3', 'm4'],
  },
};

export function randomizeGSInput(n = 4) {
  const proposers = Array.from({ length: n }, (_, i) => `m${i + 1}`);
  const acceptors = Array.from({ length: n }, (_, i) => `w${i + 1}`);
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const proposerPrefs = Object.fromEntries(proposers.map((p) => [p, shuffle(acceptors)]));
  const acceptorPrefs = Object.fromEntries(acceptors.map((a) => [a, shuffle(proposers)]));
  return { proposers, acceptors, proposerPrefs, acceptorPrefs };
}
