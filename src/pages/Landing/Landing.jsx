import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.badge}>INF234 &mdash; Algorithm Design</div>
        <h1 className={styles.title}>Algorithm Visualizer</h1>
        <p className={styles.subtitle}>
          An interactive study tool for Algorithm Design (INF234) &mdash; based on Kleinberg &amp; Tardos
        </p>
        <p className={styles.description}>
          Step through classic algorithms one operation at a time. Watch BFS explore a graph
          level by level, see Merge Sort divide and conquer, or trace Dijkstra&apos;s shortest paths.
          Each visualization includes pseudocode, complexity analysis, and a step-by-step description
          of what&apos;s happening &mdash; making it easier to build intuition, not just memorize steps.
        </p>
        <Link to="/algorithms" className={styles.ctaButton}>
          Explore Algorithms &rarr;
        </Link>
      </div>

      <section className={styles.howTo}>
        <h2 className={styles.howToTitle}>How to use</h2>
        <ul className={styles.howToList}>
          <li>
            <span className={styles.bullet}>01</span>
            <div>
              <strong>Choose an algorithm</strong> from the overview page. Algorithms are grouped
              by category: Graph, Divide &amp; Conquer, and Greedy.
            </div>
          </li>
          <li>
            <span className={styles.bullet}>02</span>
            <div>
              <strong>Step through the execution</strong> using the playback controls. Use Prev/Next
              for manual control, or hit Play to auto-advance at 0.8s per step.
            </div>
          </li>
          <li>
            <span className={styles.bullet}>03</span>
            <div>
              <strong>Read the step description</strong> below the visualizer to understand exactly
              what the algorithm is doing at each moment.
            </div>
          </li>
          <li>
            <span className={styles.bullet}>04</span>
            <div>
              <strong>Randomize the input</strong> to explore different cases. For arrays you can
              also edit values manually to test specific scenarios.
            </div>
          </li>
        </ul>
      </section>

      <section className={styles.algorithms}>
        <h2 className={styles.howToTitle}>Covered algorithms</h2>
        <div className={styles.algGrid}>
          {[
            { name: 'Gale-Shapley Algorithm', cat: '', color: '#4f8ef7' },

          ].map((alg) => (
            <div key={alg.name} className={styles.algPill}>
              <span className={styles.algDot} style={{ backgroundColor: alg.color }} />
              <span className={styles.algName}>{alg.name}</span>
              <span className={styles.algCat}>{alg.cat}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
