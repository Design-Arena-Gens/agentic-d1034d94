import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from './styles/App.module.css';
import { useAuth } from './state/AuthContext';

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Vinyasa Club</div>
        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
          <NavLink to="/members" className={({ isActive }) => isActive ? styles.active : ''}>Members</NavLink>
          <NavLink to="/attendance" className={({ isActive }) => isActive ? styles.active : ''}>Attendance</NavLink>
          <NavLink to="/performance" className={({ isActive }) => isActive ? styles.active : ''}>Performance</NavLink>
        </nav>
        <div className={styles.userBox}>
          <div className={styles.userName}>{user?.name} <span className={styles.role}>{user?.role}</span></div>
          <button onClick={() => { logout(); navigate('/login'); }} className={styles.logout}>Logout</button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
