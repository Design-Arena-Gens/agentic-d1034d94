import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface KPI { totalMembers: number; todayAttendance: number; avgPerformance: number; recent: Array<{ date: string; present: number; }>; scores: Array<{ date: string; avg: number; }>; }

export default function DashboardPage() {
  const [kpi, setKpi] = useState<KPI | null>(null);

  useEffect(() => {
    api.get('/analytics').then(setKpi).catch(() => setKpi({ totalMembers: 0, todayAttendance: 0, avgPerformance: 0, recent: [], scores: [] }));
  }, []);

  return (
    <div className="container">
      <div className="sectionTitle">Overview</div>
      <div className="grid grid-3">
        <div className="card"><div>Total Members</div><div style={{fontSize:28,fontWeight:800}}>{kpi?.totalMembers ?? '?'}</div></div>
        <div className="card"><div>Today Present</div><div style={{fontSize:28,fontWeight:800}}>{kpi?.todayAttendance ?? '?'}</div></div>
        <div className="card"><div>Avg Performance</div><div style={{fontSize:28,fontWeight:800}}>{kpi?.avgPerformance?.toFixed?.(1) ?? '?'}</div></div>
      </div>

      <div className="grid grid-2" style={{marginTop:16}}>
        <div className="card">
          <div className="sectionTitle">Recent Attendance</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <LineChart data={kpi?.recent || []}>
                <CartesianGrid stroke="#263052" />
                <XAxis dataKey="date" stroke="#98a6c7" />
                <YAxis stroke="#98a6c7" />
                <Tooltip />
                <Legend />
                <Line dataKey="present" stroke="#60a5fa" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="sectionTitle">Avg Scores</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <AreaChart data={kpi?.scores || []}>
                <defs>
                  <linearGradient id="c" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#263052" />
                <XAxis dataKey="date" stroke="#98a6c7" />
                <YAxis stroke="#98a6c7" />
                <Tooltip />
                <Area dataKey="avg" stroke="#34d399" fill="url(#c)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
