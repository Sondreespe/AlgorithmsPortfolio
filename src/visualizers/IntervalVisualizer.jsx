import styles from './IntervalVisualizer.module.css';

const COLOR_SELECTED = '#22c55e';
const COLOR_CURRENT  = '#3b82f6';
const COLOR_REJECTED = '#f87171';
const COLOR_PENDING  = '#475569';
const MACHINE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

function getColor(id, state) {
  const { selected, rejected, current } = state;
  if (id === current) return COLOR_CURRENT;
  if (selected?.has?.(id)) return COLOR_SELECTED;
  if (rejected?.has?.(id)) return COLOR_REJECTED;
  return COLOR_PENDING;
}

function getMachineColor(machineId) {
  return MACHINE_COLORS[machineId % MACHINE_COLORS.length];
}

function buildRows(intervals, machines) {
  if (!machines || machines.length === 0) {
    return [{ label: null, ivs: intervals }];
  }
  const rows = machines.map((machineIntervalIds, mi) => ({
    label: `M${mi + 1}`,
    ivs: machineIntervalIds
      .map(id => intervals.find(iv => iv.id === id))
      .filter(Boolean),
    machineId: mi,
  }));
  // Add unassigned intervals as a pending row at the top
  const assignedIds = new Set(machines.flat());
  const pending = intervals.filter(iv => !assignedIds.has(iv.id));
  if (pending.length > 0) {
    rows.unshift({ label: 'Queue', ivs: pending, pending: true });
  }
  return rows;
}

export default function IntervalVisualizer({ stepState }) {
  if (!stepState?.intervals) return null;

  const { intervals, selected, rejected, current, machines, maxLateness, currentTime } = stepState;

  const maxTime = Math.max(
    ...intervals.map(iv => iv.end),
    ...intervals.map(iv => iv.deadline ?? 0),
    1,
  );

  const rows = buildRows(intervals, machines);

  // Build tick marks (at integer positions, up to ~8 ticks)
  const step = Math.ceil(maxTime / 8);
  const ticks = [];
  for (let t = 0; t <= maxTime; t += step) ticks.push(t);
  if (ticks[ticks.length - 1] < maxTime) ticks.push(maxTime);

  const toPercent = (t) => `${(t / maxTime) * 100}%`;

  const hasDeadlines = intervals.some(iv => iv.deadline !== undefined);

  return (
    <div className={styles.wrapper}>
      <div className={styles.timeline}>
        {/* Ruler */}
        <div className={styles.ruler}>
          {ticks.map(t => (
            <div key={t} className={styles.tick} style={{ left: toPercent(t) }}>
              <div className={styles.tickLine} />
              {t}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, ri) => (
          <div key={ri} className={styles.machineRow}>
            <span className={styles.machineLabel}>{row.label}</span>
            <div className={styles.track}>
              {row.ivs.map(iv => {
                let color;
                if (row.machineId !== undefined && !row.pending) {
                  color = getColor(iv.id, { selected, rejected, current });
                  // override with machine color for assigned intervals
                  if (selected?.has?.(iv.id) && iv.id !== current) {
                    color = getMachineColor(row.machineId);
                  }
                } else {
                  color = getColor(iv.id, { selected, rejected, current });
                }

                const left = toPercent(iv.start);
                const width = `max(4px, ${toPercent(iv.end - iv.start)})`;

                return (
                  <div
                    key={iv.id}
                    className={styles.interval}
                    style={{ left, width, background: color }}
                    title={`${iv.label ?? iv.id} [${iv.start},${iv.end}]${iv.lateness ? ` late=${iv.lateness}` : ''}`}
                  >
                    <span className={styles.intervalLabel}>
                      {iv.label ?? iv.id}
                    </span>
                  </div>
                );
              })}

              {/* Deadline markers */}
              {hasDeadlines && row.ivs.map(iv =>
                iv.deadline !== undefined ? (
                  <div key={`d-${iv.id}`}>
                    <div
                      className={styles.deadlineMark}
                      style={{ left: toPercent(iv.deadline) }}
                    />
                    <div
                      className={styles.deadlineLabel}
                      style={{ left: toPercent(iv.deadline) }}
                    >
                      d{iv.label?.replace('J', '') ?? ''}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {(maxLateness !== undefined || currentTime !== undefined) && (
        <div className={styles.extra}>
          {currentTime !== undefined && (
            <span>
              <span className={styles.extraLabel}>Time: </span>
              <span className={styles.extraVal}>{currentTime}</span>
            </span>
          )}
          {maxLateness !== undefined && (
            <span>
              <span className={styles.extraLabel}>Max Lateness: </span>
              <span className={styles.extraVal}>{maxLateness}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}