import { FormEvent, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@vinyasa.club');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.title}>Vinyasa Club</div>
        <div className={styles.subtitle}>Attendance & Performance Tracker</div>
        <label>Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className={styles.error}>{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Signing in?' : 'Sign In'}</button>
      </form>
    </div>
  );
}
