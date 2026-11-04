function* knapsackGenerator({ items, capacity }) {
  const n = items.length;
  const W = capacity;

  // Initialize table with zeros
  const table = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  const rowLabels = ['∅', ...items.map((it, i) => `${i + 1}: w${it.weight} v${it.value}`)];
  const colLabels = Array.from({ length: W + 1 }, (_, w) => String(w));

  yield {
    table: table.map(r => [...r]),
    currentI: null,
    currentJ: null,
    items,
    capacity: W,
    rowLabels,
    colLabels,
    description: `Knapsack: ${n} items, capacity ${W}. Build OPT[i][w] = max value using items 1..i with capacity w.`,
  };

  for (let i = 1; i <= n; i++) {
    const { weight: wi, value: vi } = items[i - 1];

    yield {
      table: table.map(r => [...r]),
      currentI: i,
      currentJ: null,
      items,
      capacity: W,
      rowLabels,
      colLabels,
      description: `Item ${i}: weight=${wi}, value=${vi}. Fill row ${i}.`,
    };

    for (let w = 0; w <= W; w++) {
      const skip = table[i - 1][w];
      let take = -Infinity;
      if (wi <= w) take = vi + table[i - 1][w - wi];

      table[i][w] = wi <= w ? Math.max(skip, take) : skip;

      const chosen = wi <= w && take > skip ? 'take' : 'skip';
      const desc = wi > w
        ? `OPT[${i}][${w}]: item too heavy (w=${wi}>cap=${w}) → skip → ${table[i][w]}.`
        : `OPT[${i}][${w}]: skip=${skip}, take=${vi}+OPT[${i - 1}][${w - wi}]=${take} → ${chosen} → ${table[i][w]}.`;

      yield {
        table: table.map(r => [...r]),
        currentI: i,
        currentJ: w,
        items,
        capacity: W,
        rowLabels,
        colLabels,
        description: desc,
      };
    }
  }

  yield {
    table: table.map(r => [...r]),
    currentI: null,
    currentJ: null,
    items,
    capacity: W,
    rowLabels,
    colLabels,
    description: `Done. Maximum value: OPT[${n}][${W}] = ${table[n][W]}.`,
  };
}

export function generateKnapsackSteps(input) {
  const steps = [];
  for (const step of knapsackGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_KNAPSACK_INPUT = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 7 },
  ],
  capacity: 6,
};

export function randomizeKnapsackInput() {
  const n = 3 + Math.floor(Math.random() * 2);
  const capacity = 6 + Math.floor(Math.random() * 4);
  const items = Array.from({ length: n }, () => ({
    weight: 1 + Math.floor(Math.random() * 5),
    value: 1 + Math.floor(Math.random() * 9),
  }));
  return { items, capacity };
}