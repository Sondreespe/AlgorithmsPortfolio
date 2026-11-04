import styles from './DPTableVisualizer.module.css';

export default function DPTableVisualizer({ stepState }) {
  if (!stepState?.table) return null;

  const { table, currentI, currentJ, rowLabels, colLabels } = stepState;
  const n = table.length;
  const m = table[0]?.length ?? 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rowHeader} />
              {colLabels.map((label, j) => (
                <th key={j} className={styles.colHeader}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                <td className={styles.rowLabelCell}>
                  {rowLabels?.[i] ?? i}
                </td>
                {row.map((val, j) => {
                  const isActive = i === currentI && j === currentJ;
                  const isCurrentRow = i === currentI && currentJ === null;
                  const cls = [
                    styles.cell,
                    isActive ? styles.cellActive : '',
                    isCurrentRow ? styles.cellRow : '',
                    val === 0 && !isActive ? styles.cellZero : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <td key={j} className={cls}>
                      {val === Infinity ? '∞' : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}