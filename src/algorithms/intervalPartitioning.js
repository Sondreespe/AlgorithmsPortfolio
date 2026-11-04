function* intervalPartitioningGenerator({ intervals }) {
  const sorted = [...intervals]
    .map((iv, i) => ({ ...iv, label: `J${i + 1}`, machineId: null }))
    .sort((a, b) => a.start - b.start);

  // machines: each entry is { finish: last end time }
  const machines = [];
  const selected = new Set();

  yield {
    intervals: sorted.map(iv => ({ ...iv })),
    machines: [],
    current: null,
    selected: new Set(),
    description: `${sorted.length} jobs sorted by start time: ${sorted.map(j => `${j.label}[${j.start},${j.end}]`).join(', ')}.`,
  };

  for (let k = 0; k < sorted.length; k++) {
    const job = sorted[k];

    yield {
      intervals: sorted.map(iv => ({ ...iv })),
      machines: machines.map(m => [...m]),
      current: job.id,
      selected: new Set(selected),
      description: `Assign ${job.label} [${job.start},${job.end}]. ${machines.length} machine${machines.length !== 1 ? 's' : ''} open.`,
    };

    // Find a machine whose last job ends <= job.start (smallest finish <= start)
    let bestMachine = -1;
    let bestFinish = Infinity;
    for (let m = 0; m < machines.length; m++) {
      const finish = machines[m].finish;
      if (finish <= job.start && finish < bestFinish) {
        bestFinish = finish;
        bestMachine = m;
      }
    }

    if (bestMachine >= 0) {
      machines[bestMachine].finish = job.end;
      machines[bestMachine].intervals.push(job.id);
      sorted[k].machineId = bestMachine;
    } else {
      machines.push({ finish: job.end, intervals: [job.id] });
      sorted[k].machineId = machines.length - 1;
      bestMachine = machines.length - 1;
    }

    selected.add(job.id);

    const machineLabel = `M${bestMachine + 1}`;
    const action = bestMachine === machines.length - 1 && machines[bestMachine].intervals.length === 1
      ? `No free machine — open ${machineLabel}.`
      : `Assign to ${machineLabel} (freed at ${bestFinish}).`;

    yield {
      intervals: sorted.map(iv => ({ ...iv })),
      machines: machines.map(m => [...m.intervals]),
      current: null,
      selected: new Set(selected),
      description: `${job.label} → ${machineLabel}. ${action} Machines used: ${machines.length}.`,
    };
  }

  yield {
    intervals: sorted.map(iv => ({ ...iv })),
    machines: machines.map(m => [...m.intervals]),
    current: null,
    selected: new Set(selected),
    description: `Done. ${machines.length} machine${machines.length !== 1 ? 's' : ''} needed (= max depth = max simultaneous jobs).`,
  };
}

export function generateIntervalPartitioningSteps(input) {
  const steps = [];
  for (const step of intervalPartitioningGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_INTERVAL_PARTITIONING_INPUT = {
  intervals: [
    { id: 0, start: 0, end: 3 },
    { id: 1, start: 1, end: 4 },
    { id: 2, start: 2, end: 5 },
    { id: 3, start: 3, end: 7 },
    { id: 4, start: 4, end: 8 },
    { id: 5, start: 6, end: 9 },
  ],
};

export function randomizeIntervalPartitioningInput() {
  const n = 5 + Math.floor(Math.random() * 3);
  const intervals = [];
  for (let i = 0; i < n; i++) {
    const start = Math.floor(Math.random() * 8);
    const len = 1 + Math.floor(Math.random() * 4);
    intervals.push({ id: i, start, end: start + len });
  }
  return { intervals };
}