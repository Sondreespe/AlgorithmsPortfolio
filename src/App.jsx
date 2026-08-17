import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import Landing from './pages/Landing/Landing.jsx';
import Overview from './pages/Overview/Overview.jsx';
import AlgorithmDetail from './pages/AlgorithmDetail/AlgorithmDetail.jsx';

function NavBar() {
  const location = useLocation();

  return (
    <header className={styles.navbar}>
      <nav className={styles.navInner}>
        <Link to="/" className={styles.navBrand}>
          <span className={styles.navLogo}>&#10022;</span>
          Algorithm Visualizer
        </Link>
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/algorithms"
            className={`${styles.navLink} ${location.pathname.startsWith('/algorithms') ? styles.active : ''}`}
          >
            Algorithms
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <NavBar />
        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/algorithms" element={<Overview />} />
            <Route path="/algorithms/:id" element={<AlgorithmDetail />} />
            <Route path="*" element={<Navigate404 />} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <span>Algorithm Visualizer &mdash; INF234 Study Tool</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function Navigate404() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748b' }}>
      <h2>404 &mdash; Page not found</h2>
      <Link to="/" style={{ color: '#4f8ef7' }}>Go home</Link>
    </div>
  );
}
