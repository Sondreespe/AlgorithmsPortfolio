import styles from './ColorLegend.module.css';

export default function ColorLegend({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.legend}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <span className={styles.swatch} style={{ backgroundColor: item.color }} />
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
