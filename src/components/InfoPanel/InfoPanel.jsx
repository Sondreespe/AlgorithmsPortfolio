import styles from './InfoPanel.module.css';
import Pseudocode from '../Pseudocode/Pseudocode.jsx';

export default function InfoPanel({ algorithm }) {
  if (!algorithm) return null;

  const { name, complexity, explanation, pseudocode } = algorithm;
  const time = complexity?.time || {};
  const space = complexity?.space;

  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>{name}</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Complexity</h3>
        <table className={styles.table}>
          <tbody>
            {time.best && (
              <tr>
                <td className={styles.tdLabel}>Time (best)</td>
                <td className={styles.tdValue}><code>{time.best}</code></td>
              </tr>
            )}
            {time.average && (
              <tr>
                <td className={styles.tdLabel}>Time (avg)</td>
                <td className={styles.tdValue}><code>{time.average}</code></td>
              </tr>
            )}
            {time.worst && (
              <tr>
                <td className={styles.tdLabel}>Time (worst)</td>
                <td className={styles.tdValue}><code>{time.worst}</code></td>
              </tr>
            )}
            {space && (
              <tr>
                <td className={styles.tdLabel}>Space</td>
                <td className={styles.tdValue}><code>{space}</code></td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {explanation && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>How it works</h3>
          <p className={styles.explanation}>{explanation}</p>
        </section>
      )}

      {pseudocode && (
        <section className={styles.section}>
          <Pseudocode code={pseudocode} />
        </section>
      )}
    </aside>
  );
}
