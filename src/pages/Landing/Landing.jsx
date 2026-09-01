import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import { ALGORITHMS } from '../../algorithms/registry.js';

const CATEGORY_COLORS = {
  Graph: '#4f8ef7',
  Greedy: '#f7944f',
  'Divide & Conquer': '#7c4ff7',
  DP: '#4fca7a',
  Optimization: '#0d9488',
};

const COURSE_COLORS = {
  INF234: '#6366f1',
  INF379: '#0d9488',
};

export default function Landing() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.badges}>
          <span className={styles.badge}>INF234 &mdash; Algorithm Design</span>
          <span className={styles.badge} style={{ background: '#0d9488' }}>INF379 &mdash; Optimization</span>
        </div>
        <h1 className={styles.title}>Algorithm Visualizer</h1>
        <p className={styles.subtitle}>
          An interactive study tool for INF234 and INF379 — based on Kleinberg &amp; Tardos
          and the optimization curriculum.
        </p>
        <p className={styles.description}>
          Step through classic algorithms one operation at a time. Watch the state evolve,
          read what the algorithm is doing at each step, and randomize the input to explore
          different cases. Each algorithm includes pseudocode, complexity analysis, and a
          clear visualization — built to build intuition, not just memorize steps.
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
              <strong>Choose an algorithm</strong> from the overview page. Filter by course
              (INF234 / INF379) or category.
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
              <strong>Randomize the input</strong> to explore different executions and verify
              that the algorithm always produces a correct result.
            </div>
          </li>
        </ul>
      </section>

      <section className={styles.algorithms}>
        <h2 className={styles.howToTitle}>Covered algorithms</h2>
        <div className={styles.algGrid}>
          {ALGORITHMS.map((alg) => (
            <div key={alg.id} className={styles.algPill}>
              <span
                className={styles.algDot}
                style={{ backgroundColor: CATEGORY_COLORS[alg.category] || '#9ca3af' }}
              />
              <span className={styles.algName}>{alg.name}</span>
              <span className={styles.algCat}>{alg.category}</span>
              <span
                className={styles.algCourse}
                style={{ color: COURSE_COLORS[alg.course] || '#64748b' }}
              >
                {alg.course}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
