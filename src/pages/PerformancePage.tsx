import { FormEvent, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PerformancePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [memberId, setMemberId] = useState<string>('');
  const [category, setCategory] = useState<string>('Robotics Basics');
  const [score, setScore] = useState<number>(80);

  const load = async () => {
    const m = await api.get('/members'); setMembers(m.items);
    const s = await api.get('/performance'); setScores(s.items);
  };
  useEffect(() => { load(); }, []);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/performance', { memberId, category, score });
    setScore(80);
    await load();
  };

  const dataset = scores.reduce((acc: Record<string, any>, cur: any) => {
    const key = cur.category;
    acc[key] = acc[key] || { category: key };
    const member = members.find((m: any) => m.id === cur.memberId)?.name || cur.memberId;
    acc[key][member] = cur.score;
    return acc;
  }, {});
  const chartData = Object.values(dataset);

  return (
    <div className="container">
      <div className="sectionTitle">Performance</div>

      <form className="card" onSubmit={onAdd} style={{display:'grid', gap:8}}>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr auto', gap:8}}>
          <select className="select" required value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Select Member</option>
            {members.map((m: any) => <option key={m.id} value={m.id}>{m.name} ({m.vinId})</option>)}
          </select>
          <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className="input" type="number" min={0} max={100} value={score} onChange={(e) => setScore(parseInt(e.target.value, 10))} />
          <button className="btn" type="submit">Add</button>
        </div>
      </form>

      <div className="card" style={{marginTop:16}}>
        <div style={{width:'100%', height:360}}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#263052" />
              <XAxis dataKey="category" stroke="#98a6c7" />
              <YAxis stroke="#98a6c7" />
              <Tooltip />
              <Legend />
              {members.slice(0, 6).map((m: any, idx: number) => (
                <Bar key={m.id} dataKey={m.name} stackId="a" fill={["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#22d3ee"][idx % 6]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
