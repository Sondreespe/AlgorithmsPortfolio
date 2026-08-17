import styles from './AlgorithmCard.module.css';

const CATEGORY_CLASS = {
  Graph: 'categoryGraph',
  Greedy: 'categoryGreedy',
  'Divide & Conquer': 'categoryDivide',
  DP: 'categoryDP',
};

export default function AlgorithmCard({ algorithm, onClick }) {
  const { name, category, description, complexity } = algorithm;
  const catClass = CATEGORY_CLASS[category] || 'categoryGraph';
  const timeWorst = complexity?.time?.worst || complexity?.time?.average || '';

  return (
    <button className={styles.card} onClick={onClick} aria-label={`View ${name}`}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[catClass]}`}>{category}</span>
        {timeWorst && (
          <span className={styles.complexityBadge}>{timeWorst}</span>
        )}
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.arrow}>Explore &rarr;</span>
    </button>
  );
}
