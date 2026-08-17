import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Overview.module.css';
import { ALGORITHMS } from '../../algorithms/registry.js';
import AlgorithmCard from '../../components/AlgorithmCard/AlgorithmCard.jsx';
import SearchFilter from '../../components/SearchFilter/SearchFilter.jsx';

const ALL_CATEGORIES = ['All', 'Graph', 'Divide & Conquer', 'Greedy', 'DP'];

export default function Overview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ALGORITHMS.filter((alg) => {
    const matchesSearch =
      alg.name.toLowerCase().includes(search.toLowerCase()) ||
      alg.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || alg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Algorithms</h1>
        <p className={styles.subtitle}>
          {ALGORITHMS.length} algorithms from the INF234 curriculum &mdash; select one to explore.
        </p>
      </div>

      <SearchFilter
        onSearch={setSearch}
        onCategoryFilter={setActiveCategory}
        categories={ALL_CATEGORIES}
        activeCategory={activeCategory}
        searchValue={search}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          No algorithms match &ldquo;{search}&rdquo;
          {activeCategory !== 'All' ? ` in category "${activeCategory}"` : ''}.
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
