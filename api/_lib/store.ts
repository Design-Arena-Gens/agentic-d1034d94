import type { Role } from './auth';

export type Member = { id: string; name: string; email: string; vinId: string; joinedAt: string };
export type Attendance = { id: string; memberId: string; date: string; status: 'Present'|'Late'|'Absent'|'Excused' };
export type Performance = { id: string; memberId: string; category: string; score: number; createdAt: string };

let memberSeq = 1;
let attendanceSeq = 1;
let performanceSeq = 1;

const members: Member[] = [];
const attendance: Attendance[] = [];
const perf: Performance[] = [];

function makeVin(n: number) { return `VIN-${n.toString().padStart(3, '0')}`; }

// seed a few members
for (let i = 0; i < 6; i++) {
  const id = `m${memberSeq++}`;
  members.push({ id, name: `Member ${i+1}`, email: `member${i+1}@vinyasa.club`, vinId: makeVin(i+1), joinedAt: new Date(Date.now() - i*86400000).toISOString() });
}

export const store = {
  listMembers(query?: string) {
    if (!query) return members;
    const q = query.toLowerCase();
    return members.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.vinId.toLowerCase().includes(q));
  },
  addMember(name: string, email: string) {
    const id = `m${memberSeq++}`;
    const vinId = makeVin(memberSeq-1);
    const joinedAt = new Date().toISOString();
    const item = { id, name, email, vinId, joinedAt };
    members.push(item);
    return item;
  },
  deleteMember(id: string) {
    const idx = members.findIndex(m => m.id === id);
    if (idx >= 0) members.splice(idx, 1);
  },
  getAttendance(date?: string) {
    if (date) return attendance.filter(a => a.date === date);
    return attendance;
  },
  saveAttendance(items: Array<{ memberId: string; status: Attendance['status']; date: string }>) {
    for (const it of items) {
      let a = attendance.find(x => x.memberId === it.memberId && x.date === it.date);
      if (!a) { a = { id: `a${attendanceSeq++}`, memberId: it.memberId, date: it.date, status: it.status }; attendance.push(a); }
      else { a.status = it.status; }
    }
  },
  listPerformance() { return perf; },
  addPerformance(memberId: string, category: string, score: number) {
    const item = { id: `p${performanceSeq++}`, memberId, category, score, createdAt: new Date().toISOString() };
    perf.push(item);
    return item;
  },
  kpi() {
    const today = new Date().toISOString().slice(0,10);
    const presentToday = attendance.filter(a => a.date === today && (a.status === 'Present' || a.status === 'Late')).length;
    const byDay = {} as Record<string, number>;
    attendance.forEach(a => { byDay[a.date] = (byDay[a.date] || 0) + (a.status === 'Absent' ? 0 : 1); });
    const recent = Object.entries(byDay).sort((a,b)=>a[0].localeCompare(b[0])).slice(-10).map(([date, present]) => ({ date, present }));
    const byDayScore = {} as Record<string, { total: number; count: number }>;
    perf.forEach(p => {
      const day = p.createdAt.slice(0,10);
      const e = byDayScore[day] || { total: 0, count: 0 };
      e.total += p.score; e.count += 1; byDayScore[day] = e;
    });
    const scores = Object.entries(byDayScore).sort((a,b)=>a[0].localeCompare(b[0])).slice(-10).map(([date, v]) => ({ date, avg: v.total / v.count }));
    const allAvg = perf.length ? (perf.reduce((s, p) => s + p.score, 0) / perf.length) : 0;
    return { totalMembers: members.length, todayAttendance: presentToday, avgPerformance: allAvg, recent, scores };
  }
};
