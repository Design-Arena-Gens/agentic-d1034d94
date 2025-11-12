import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../state/AuthContext';

type Member = { id: string; name: string; email: string; vinId: string; joinedAt: string; };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  const canEdit = user?.role === 'admin' || user?.role === 'instructor';

  const load = async () => {
    const res = await api.get('/members', q ? { q } : undefined);
    setMembers(res.items);
  };
  useEffect(() => { load(); }, []);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/members', { name, email });
    setName(''); setEmail('');
    await load();
  };

  const onDelete = async (id: string) => {
    await api.delete(`/members?id=${encodeURIComponent(id)}`);
    await load();
  };

  const filtered = useMemo(() => members, [members]);

  return (
    <div className="container">
      <div className="sectionTitle">Members</div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="input" placeholder="Search by name/email/VIN" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn secondary" onClick={load}>Search</button>
        </div>
      </div>

      {canEdit && (
        <form className="card" onSubmit={onAdd} style={{display:'grid', gap:8}}>
          <div className="sectionTitle">Add Member</div>
          <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn" type="submit">Add</button>
        </form>
      )}

      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr><th>VIN</th><th>Name</th><th>Email</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td>{m.vinId}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{new Date(m.joinedAt).toLocaleDateString()}</td>
                <td>{canEdit && <button className="btn secondary" onClick={() => onDelete(m.id)}>Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
