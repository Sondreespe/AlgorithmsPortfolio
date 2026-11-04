import styles from './ArrayVisualizer.module.css';

const COLORS = {
  found:   '#22c55e',
  sorted:  '#4ade80',
  left:    '#3b82f6',
  right:   '#f97316',
  mid:     '#7c4ff7',
  active:  '#fbbf24',
  dim:     '#cbd5e1',
  default: '#94a3b8',
};

function cellColor(idx, state) {
  const { lo, hi, mid, left, right, pA, pB, found, mergeL, mergeR, mergeMid,
          sorted, active, currentIdx, fixedIdx } = state || {};

  if (found !== null && found !== undefined && idx === found) return COLORS.found;
  if (sorted?.has?.(idx)) return COLORS.sorted;

  // Merge-sort range coloring
  if (mergeL !== undefined && mergeR !== undefined && mergeMid !== undefined) {
    if (idx >= mergeL && idx <= mergeMid) return COLORS.left;
    if (idx > mergeMid && idx <= mergeR) return COLORS.right;
  }

  if (active?.has?.(idx)) return COLORS.active;
  if (idx === mid || idx === mergeMid || idx === fixedIdx) return COLORS.mid;
  if (idx === lo || idx === left || idx === pA || idx === currentIdx) return COLORS.left;
  if (idx === hi || idx === right || idx === pB) return COLORS.right;

  // Binary search: dim elements outside [lo..hi]
  if (lo !== null && lo !== undefined && hi !== null && hi !== undefined) {
    if (idx < lo || idx > hi) return COLORS.dim;
  }

  return COLORS.default;
}

function ArrayRow({ arr, state, label, secondaryState }) {
  const colorState = secondaryState || state;
  return (
    <div className={styles.rowGroup}>
      {label && <span className={styles.rowLabel}>{label}</span>}
      <div className={styles.row}>
        {arr.map((val, i) => (
          <div key={i} className={styles.cell} style={{ background: cellColor(i, colorState) }}>
            <span className={styles.val}>{val === Infinity ? '∞' : val === -Infinity ? '-∞' : val}</span>
            <span className={styles.idx}>{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArrayVisualizer({ stepState }) {
  if (!stepState?.array) return null;
  const { array, arrayB, result, remaining, taken, inversions } = stepState;

  const bState = arrayB ? { pA: null, pB: null, left: stepState.pB, right: null } : null;

  return (
    <div className={styles.wrapper}>
      <ArrayRow arr={array} state={stepState} label={arrayB ? 'A' : null} />
      {arrayB && <ArrayRow arr={arrayB} state={bState} label="B" />}
      {result !== undefined && result !== null && (
        <ArrayRow
          arr={result}
          state={{ sorted: new Set(result.map((_, i) => i)) }}
          label="Result"
        />
      )}
      {(remaining !== undefined || inversions !== undefined || taken !== undefined) && (
        <div className={styles.extra}>
          {remaining !== undefined && (
            <span><span className={styles.extraLabel}>Remaining: </span>{remaining}</span>
          )}
          {taken !== undefined && taken.length > 0 && (
            <span><span className={styles.extraLabel}>Taken: </span>[{taken.join(', ')}]</span>
          )}
          {inversions !== undefined && (
            <span><span className={styles.extraLabel}>Inversions: </span>{inversions}</span>
          )}
        </div>
      )}
    </div>
  );
}