function* editDistanceGenerator({ s, t }) {
  const n = s.length;
  const m = t.length;

  const table = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  // Base cases
  for (let i = 0; i <= n; i++) table[i][0] = i;
  for (let j = 0; j <= m; j++) table[0][j] = j;

  const rowLabels = ['', ...s.split('')];
  const colLabels = ['', ...t.split('')];

  yield {
    table: table.map(r => [...r]),
    currentI: null,
    currentJ: null,
    s,
    t,
    rowLabels,
    colLabels,
    description: `Edit distance: "${s}" → "${t}". Initialize base cases (deletions/insertions from empty string).`,
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match = s[i - 1] === t[j - 1];

      let val, opDesc;
      if (match) {
        val = table[i - 1][j - 1];
        opDesc = `s[${i}]="${s[i - 1]}"=t[${j}]="${t[j - 1]}" match → diagonal ${val}.`;
      } else {
        const sub = table[i - 1][j - 1] + 1;
        const del = table[i - 1][j] + 1;
        const ins = table[i][j - 1] + 1;
        val = Math.min(sub, del, ins);
        const best = val === sub ? 'substitute' : val === del ? 'delete' : 'insert';
        opDesc = `"${s[i - 1]}"≠"${t[j - 1]}": sub=${sub}, del=${del}, ins=${ins} → ${best} → ${val}.`;
      }

      table[i][j] = val;

      yield {
        table: table.map(r => [...r]),
        currentI: i,
        currentJ: j,
        s,
        t,
        rowLabels,
        colLabels,
        description: `OPT[${i}][${j}]: ${opDesc}`,
      };
    }
  }

  yield {
    table: table.map(r => [...r]),
    currentI: null,
    currentJ: null,
    s,
    t,
    rowLabels,
    colLabels,
    description: `Done. Edit distance "${s}" → "${t}" = OPT[${n}][${m}] = ${table[n][m]}.`,
  };
}

export function generateEditDistanceSteps(input) {
  const steps = [];
  for (const step of editDistanceGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_EDIT_DISTANCE_INPUT = {
  s: 'edit',
  t: 'diet',
};

export function randomizeEditDistanceInput() {
  const words = ['cat', 'dog', 'code', 'node', 'love', 'live', 'list', 'fist', 'kind', 'find', 'pale', 'tale'];
  const i = Math.floor(Math.random() * words.length);
  let j = Math.floor(Math.random() * (words.length - 1));
  if (j >= i) j++;
  return { s: words[i], t: words[j] };
}