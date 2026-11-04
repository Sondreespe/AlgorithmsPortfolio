function* coinChangeGreedyGenerator({ coins, amount }) {
  const sorted = [...coins].sort((a, b) => b - a);
  const taken = [];
  let remaining = amount;

  yield {
    array: sorted,
    currentIdx: null,
    taken: [],
    remaining,
    description: `Coins sorted descending: [${sorted.join(', ')}]. Target: ${amount}.`,
  };

  for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i];

    if (remaining <= 0) break;

    yield {
      array: sorted,
      currentIdx: i,
      taken: [...taken],
      remaining,
      description: `Consider coin ${c}. Remaining: ${remaining}.`,
    };

    while (remaining >= c) {
      taken.push(c);
      remaining -= c;

      yield {
        array: sorted,
        currentIdx: i,
        taken: [...taken],
        remaining,
        description: `Take coin ${c}. Remaining: ${remaining}. Taken so far: [${taken.join(', ')}].`,
      };
    }

    if (remaining > 0 && remaining < c) {
      yield {
        array: sorted,
        currentIdx: i,
        taken: [...taken],
        remaining,
        description: `Coin ${c} is too large (remaining=${remaining}) — skip.`,
      };
    }
  }

  yield {
    array: sorted,
    currentIdx: null,
    taken: [...taken],
    remaining,
    description: remaining === 0
      ? `Done. ${taken.length} coin${taken.length !== 1 ? 's' : ''}: [${taken.join(', ')}].`
      : `Done. No solution — ${remaining} cannot be made with these coins.`,
  };
}

export function generateCoinChangeSteps(input) {
  const steps = [];
  for (const step of coinChangeGreedyGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_COIN_CHANGE_INPUT = {
  coins: [1, 5, 10, 25],
  amount: 41,
};

export function randomizeCoinChangeInput() {
  const coinSets = [
    [1, 5, 10, 25],
    [1, 5, 10, 25, 50],
    [1, 2, 5, 10, 20],
  ];
  const coins = coinSets[Math.floor(Math.random() * coinSets.length)];
  const amount = 10 + Math.floor(Math.random() * 90);
  return { coins, amount };
}