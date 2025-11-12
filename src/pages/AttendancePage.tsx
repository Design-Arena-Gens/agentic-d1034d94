import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../state/AuthContext';

type Member = { id: string; name: string; vinId: string };

type Mark = 'Present' | 'Late' | 'Absent' | 'Excused';

export default function AttendancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => { (async () => {
    const res = await api.get('/members'); setMembers(res.items);
    const existing = await api.get('/attendance', { date });
    const m: Record<string, Mark> = {}; (existing.items || []).forEach((r: any) => { m[r.memberId] = r.status; });
    setMarks(m);
  })(); }, [date]);

  const bulkSave = async () => {
    const items = Object.entries(marks).map(([memberId, status]) => ({ memberId, status, date }));
    await api.post('/attendance', { items });
    alert('Attendance saved');
  };

  return (
    <div className="container">
      <div className="sectionTitle">Attendance</div>
      <div className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
        <label>Date</label>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        {canEdit && <button className="btn" onClick={bulkSave}>Save</button>}
      </div>

      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr><th>VIN</th><th>Name</th><th>Status</th></tr></thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>{m.vinId}</td>
                <td>{m.name}</td>
                <td>
                  <select className="select" disabled={!canEdit} value={marks[m.id] || ''} onChange={(e) => setMarks(s => ({...s, [m.id]: e.target.value as Mark}))}>
                    <option value="">?</option>
                    <option>Present</option>
                    <option>Late</option>
                    <option>Absent</option>
                    <option>Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
