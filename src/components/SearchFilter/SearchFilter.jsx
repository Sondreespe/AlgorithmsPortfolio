import styles from './SearchFilter.module.css';

export default function SearchFilter({
  searchValue,
  onSearch,
  courses,
  activeCourse,
  onCourseFilter,
  categories,
  activeCategory,
  onCategoryFilter,
}) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search algorithms..."
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search algorithms"
      />

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Course</span>
        <div className={styles.pills}>
          {courses.map((c) => (
            <button
              key={c}
              className={`${styles.pill} ${styles.coursePill} ${activeCourse === c ? styles.courseActive : ''}`}
              onClick={() => onCourseFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Category</span>
        <div className={styles.pills}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.pill} ${activeCategory === cat ? styles.catActive : ''}`}
              onClick={() => onCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
