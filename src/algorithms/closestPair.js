function dist(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function generateCPSteps({ points }) {
  const steps = [];
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);

  let globalBest = { dist: Infinity, pair: null };

  function push(partial) {
    steps.push({
      leftSet: [],
      rightSet: [],
      stripSet: [],
      comparing: null,
      divideX: null,
      stripWidth: null,
      bestPair: globalBest.pair,
      bestDist: globalBest.dist === Infinity ? null : globalBest.dist,
      ...partial,
    });
  }

  push({
    type: 'init',
    description: `Sort ${sorted.length} points by x. Starting divide and conquer.`,
  });

  function bruteForce(indices) {
    let best = { dist: Infinity, pair: null };
    for (let i = 0; i < indices.length; i++) {
      for (let j = i + 1; j < indices.length; j++) {
        const d = dist(sorted[indices[i]], sorted[indices[j]]);
        push({
          type: 'brute-force',
          leftSet: indices,
          comparing: [indices[i], indices[j]],
          description: `Base case: dist(${sorted[indices[i]].label}, ${sorted[indices[j]].label}) = ${d.toFixed(2)}${d < best.dist ? ' ← new best' : ''}.`,
        });
        if (d < best.dist) {
          best = { dist: d, pair: [indices[i], indices[j]] };
          if (d < globalBest.dist) globalBest = best;
        }
      }
    }
    return best;
  }

  function solve(indices) {
    if (indices.length <= 3) return bruteForce(indices);

    const mid = Math.floor(indices.length / 2);
    const leftIndices = indices.slice(0, mid);
    const rightIndices = indices.slice(mid);
    const divideX = (sorted[indices[mid - 1]].x + sorted[indices[mid]].x) / 2;

    push({
      type: 'divide',
      leftSet: leftIndices,
      rightSet: rightIndices,
      divideX,
      description: `Divide at x = ${divideX.toFixed(1)}: left [${leftIndices.map(i => sorted[i].label).join(',')}], right [${rightIndices.map(i => sorted[i].label).join(',')}].`,
    });

    const leftResult = solve(leftIndices);
    const rightResult = solve(rightIndices);

    const δ = Math.min(leftResult.dist, rightResult.dist);
    let localBest = leftResult.dist <= rightResult.dist ? leftResult : rightResult;
    if (localBest.dist < globalBest.dist) globalBest = localBest;

    const stripIndices = indices
      .filter(i => Math.abs(sorted[i].x - divideX) < δ)
      .sort((a, b) => sorted[a].y - sorted[b].y);

    push({
      type: 'combine-start',
      leftSet: leftIndices,
      rightSet: rightIndices,
      stripSet: stripIndices,
      divideX,
      stripWidth: δ,
      description: `Combine: δ = ${δ.toFixed(2)}. Strip has ${stripIndices.length} point${stripIndices.length !== 1 ? 's' : ''} within x ± δ of divide line.`,
    });

    for (let i = 0; i < stripIndices.length; i++) {
      for (let j = i + 1; j < stripIndices.length; j++) {
        if (sorted[stripIndices[j]].y - sorted[stripIndices[i]].y >= localBest.dist) break;

        const d = dist(sorted[stripIndices[i]], sorted[stripIndices[j]]);

        push({
          type: 'strip-check',
          leftSet: leftIndices,
          rightSet: rightIndices,
          stripSet: stripIndices,
          divideX,
          stripWidth: localBest.dist,
          comparing: [stripIndices[i], stripIndices[j]],
          description: `Strip: dist(${sorted[stripIndices[i]].label}, ${sorted[stripIndices[j]].label}) = ${d.toFixed(2)} vs δ = ${localBest.dist.toFixed(2)}${d < localBest.dist ? ' ← new best!' : ''}.`,
        });

        if (d < localBest.dist) {
          localBest = { dist: d, pair: [stripIndices[i], stripIndices[j]] };
          globalBest = localBest;
        }
      }
    }

    return localBest;
  }

  const result = solve(sorted.map((_, i) => i));
  globalBest = result;

  push({
    type: 'done',
    description: `Done. Closest pair: ${sorted[result.pair[0]].label}–${sorted[result.pair[1]].label}, distance = ${result.dist.toFixed(2)}.`,
  });

  return steps;
}

export const DEFAULT_CP_INPUT = {
  points: [
    { x: 1, y: 4, label: 'A' },
    { x: 2, y: 2, label: 'B' },
    { x: 3, y: 5, label: 'C' },
    { x: 4, y: 3, label: 'D' },
    { x: 5, y: 7, label: 'E' },
    { x: 6, y: 4, label: 'F' },
    { x: 7, y: 5, label: 'G' },
    { x: 8, y: 8, label: 'H' },
  ],
};

export function randomizeCPInput() {
  const labels = 'ABCDEFGHIJ'.split('');
  const n = 7 + Math.floor(Math.random() * 4);
  const pts = [];
  for (let i = 0; i < n; i++) {
    let x, y, attempts = 0;
    do {
      x = 1 + Math.round(Math.random() * 8);
      y = 1 + Math.round(Math.random() * 8);
      attempts++;
    } while (attempts < 20 && pts.some(p => p.x === x && p.y === y));
    pts.push({ x, y, label: labels[i] });
  }
  return { points: pts };
}