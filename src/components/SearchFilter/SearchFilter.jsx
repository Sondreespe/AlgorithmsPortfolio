import styles from './SearchFilter.module.css';

export default function SearchFilter({ onSearch, onCategoryFilter, categories, activeCategory, searchValue }) {
  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search algorithms..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search algorithms"
        />
      </div>
      <div className={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => onCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
