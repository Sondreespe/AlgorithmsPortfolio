function* edfGenerator({ jobs }) {
  // Sort by deadline (Earliest Deadline First)
  const sorted = [...jobs]
    .map((j, i) => ({ ...j, label: `J${i + 1}` }))
    .sort((a, b) => a.deadline - b.deadline);

  // Compute the full schedule (positions are deterministic)
  let t = 0;
  const schedule = sorted.map(j => {
    const start = t;
    const end = t + j.length;
    const lateness = Math.max(0, end - j.deadline);
    t = end;
    return { ...j, start, end, lateness };
  });

  const maxTime = schedule[schedule.length - 1]?.end ?? 0;
  const placed = new Set();
  let maxLateness = 0;
  let currentTime = 0;

  yield {
    intervals: schedule.map(j => ({ ...j })),
    selected: new Set(),
    current: null,
    currentTime: 0,
    maxLateness: 0,
    description: `${schedule.length} jobs sorted by deadline (EDF): ${schedule.map(j => `${j.label}(d=${j.deadline})`).join(', ')}.`,
  };

  for (const job of schedule) {
    yield {
      intervals: schedule.map(j => ({ ...j })),
      selected: new Set(placed),
      current: job.id,
      currentTime,
      maxLateness,
      description: `Schedule ${job.label}: length=${job.length}, deadline=${job.deadline}. Place at [${job.start},${job.end}].`,
    };

    placed.add(job.id);
    currentTime = job.end;
    maxLateness = Math.max(maxLateness, job.lateness);

    yield {
      intervals: schedule.map(j => ({ ...j })),
      selected: new Set(placed),
      current: null,
      currentTime,
      maxLateness,
      description: job.lateness > 0
        ? `${job.label} finishes at ${job.end}, deadline ${job.deadline} → late by ${job.lateness}. Max lateness: ${maxLateness}.`
        : `${job.label} finishes at ${job.end} ≤ deadline ${job.deadline} — on time. Max lateness: ${maxLateness}.`,
    };
  }

  yield {
    intervals: schedule.map(j => ({ ...j })),
    selected: new Set(placed),
    current: null,
    currentTime: maxTime,
    maxLateness,
    description: `Done. All jobs scheduled. Maximum lateness: ${maxLateness}.`,
  };
}

export function generateEDFSteps(input) {
  const steps = [];
  for (const step of edfGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_EDF_INPUT = {
  jobs: [
    { id: 0, length: 3, deadline: 6 },
    { id: 1, length: 2, deadline: 3 },
    { id: 2, length: 1, deadline: 4 },
    { id: 3, length: 4, deadline: 9 },
    { id: 4, length: 2, deadline: 12 },
  ],
};

export function randomizeEDFInput() {
  const n = 4 + Math.floor(Math.random() * 2);
  let totalTime = 0;
  const jobs = Array.from({ length: n }, (_, i) => {
    const length = 1 + Math.floor(Math.random() * 3);
    totalTime += length;
    return { id: i, length };
  });
  // Assign deadlines that sometimes cause lateness
  let t = 0;
  jobs.forEach(j => {
    t += j.length;
    j.deadline = t - Math.floor(Math.random() * j.length * 2);
    if (j.deadline < j.length) j.deadline = j.length;
  });
  return { jobs };
}