function* intervalSchedulingGenerator({ intervals }) {
  const sorted = [...intervals]
    .map((iv, i) => ({ ...iv, label: `J${i + 1}` }))
    .sort((a, b) => a.end - b.end);

  const selected = new Set();
  const rejected = new Set();
  let lastEnd = 0;

  yield {
    intervals: sorted,
    selected: new Set(),
    rejected: new Set(),
    current: null,
    lastEnd: 0,
    description: `${sorted.length} jobs sorted by finish time: ${sorted.map(j => `${j.label}[${j.start},${j.end}]`).join(', ')}.`,
  };

  for (const job of sorted) {
    yield {
      intervals: sorted,
      selected: new Set(selected),
      rejected: new Set(rejected),
      current: job.id,
      lastEnd,
      description: `Examine ${job.label} [${job.start},${job.end}]. Last end: ${lastEnd}. Start ${job.start} ${job.start >= lastEnd ? '≥' : '<'} lastEnd.`,
    };

    if (job.start >= lastEnd) {
      selected.add(job.id);
      lastEnd = job.end;
      yield {
        intervals: sorted,
        selected: new Set(selected),
        rejected: new Set(rejected),
        current: job.id,
        lastEnd,
        description: `Select ${job.label} [${job.start},${job.end}] — compatible. Last end → ${lastEnd}.`,
      };
    } else {
      rejected.add(job.id);
      yield {
        intervals: sorted,
        selected: new Set(selected),
        rejected: new Set(rejected),
        current: null,
        lastEnd,
        description: `Reject ${job.label} [${job.start},${job.end}] — overlaps (start ${job.start} < lastEnd ${lastEnd}).`,
      };
    }
  }

  yield {
    intervals: sorted,
    selected: new Set(selected),
    rejected: new Set(rejected),
    current: null,
    lastEnd,
    description: `Done. Selected ${selected.size} job${selected.size !== 1 ? 's' : ''}: ${sorted.filter(j => selected.has(j.id)).map(j => j.label).join(', ')}.`,
  };
}

export function generateIntervalSchedulingSteps(input) {
  const steps = [];
  for (const step of intervalSchedulingGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_INTERVAL_SCHEDULING_INPUT = {
  intervals: [
    { id: 0, start: 0, end: 3 },
    { id: 1, start: 2, end: 4 },
    { id: 2, start: 3, end: 5 },
    { id: 3, start: 1, end: 7 },
    { id: 4, start: 5, end: 8 },
    { id: 5, start: 7, end: 9 },
    { id: 6, start: 8, end: 11 },
  ],
};

export function randomizeIntervalSchedulingInput() {
  const n = 5 + Math.floor(Math.random() * 3);
  const intervals = [];
  for (let i = 0; i < n; i++) {
    const start = Math.floor(Math.random() * 10);
    const len = 1 + Math.floor(Math.random() * 4);
    intervals.push({ id: i, start, end: start + len });
  }
  return { intervals };
}