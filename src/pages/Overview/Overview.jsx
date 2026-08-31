import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Overview.module.css';
import { ALGORITHMS } from '../../algorithms/registry.js';
import AlgorithmCard from '../../components/AlgorithmCard/AlgorithmCard.jsx';
import SearchFilter from '../../components/SearchFilter/SearchFilter.jsx';

const ALL_COURSES = ['All', 'INF234', 'INF379'];
const ALL_CATEGORIES = ['All', 'Graph', 'Divide & Conquer', 'Greedy', 'DP'];

export default function Overview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCourse, setActiveCourse] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ALGORITHMS.filter((alg) => {
    const matchesSearch =
      alg.name.toLowerCase().includes(search.toLowerCase()) ||
      alg.description.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = activeCourse === 'All' || alg.course === activeCourse;
    const matchesCategory = activeCategory === 'All' || alg.category === activeCategory;
    return matchesSearch && matchesCourse && matchesCategory;
  });

  const subtitle =
    activeCourse === 'All'
      ? `${ALGORITHMS.length} algorithms across INF234 and INF379 — select one to explore.`
      : `${filtered.length} algorithm${filtered.length !== 1 ? 's' : ''} from ${activeCourse} — select one to explore.`;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Algorithms</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <SearchFilter
        searchValue={search}
        onSearch={setSearch}
        courses={ALL_COURSES}
        activeCourse={activeCourse}
        onCourseFilter={setActiveCourse}
        categories={ALL_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryFilter={setActiveCategory}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          No algorithms match &ldquo;{search}&rdquo;
          {activeCategory !== 'All' ? ` in category "${activeCategory}"` : ''}
          {activeCourse !== 'All' ? ` for ${activeCourse}` : ''}.
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((alg) => (
            <AlgorithmCard
              key={alg.id}
              algorithm={alg}
              onClick={() => navigate(`/algorithms/${alg.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
