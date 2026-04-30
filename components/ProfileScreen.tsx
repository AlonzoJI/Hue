import React, { useMemo, useState } from 'react';
import { ProficiencyLevel, Recording } from '../types';
import { C, F, StatusBar, HomeIndicator, NavBar, Label, Card, StatRow } from './IOSFrame';
import { clearAllRecordingsFromDB } from '../services/db';

interface Props {
  proficiency: ProficiencyLevel;
  setProficiency: (l: ProficiencyLevel) => void;
  onBack: () => void;
  recordings: Recording[];
  setRecordings: (r: Recording[]) => void;
  userName: string;
}

const ProfileScreen: React.FC<Props> = ({ proficiency, setProficiency, onBack, recordings, setRecordings, userName }) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const totalXp = useMemo(() =>
    recordings.reduce((acc, rec) => acc + Math.round(rec.feedback.overallScore) + rec.feedback.challengeWordsUsed.filter(w => w.used).length * 5, 0)
  , [recordings]);

  const avgScore = useMemo(() => {
    if (recordings.length === 0) return null;
    return Math.round(recordings.reduce((a, r) => a + r.feedback.overallScore, 0) / recordings.length);
  }, [recordings]);

  const streak = useMemo(() => {
    if (recordings.length === 0) return 0;
    const dates = [...new Set(recordings.map(r => {
      const d = new Date(r.id);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }))].sort((a, b) => b - a);
    const today = new Date();
    const todayT = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    let check = dates.includes(todayT) ? todayT : (dates.includes(todayT - 86400000) ? todayT - 86400000 : -1);
    if (check === -1) return 0;
    let s = 0;
    while (dates.includes(check)) { s++; check -= 86400000; }
    return s;
  }, [recordings]);

  // Last 7 days activity
  const weekActivity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });
    return days.map(day => ({
      label: ['S','M','T','W','T','F','S'][new Date(day).getDay()],
      count: recordings.filter(r => {
        const d = new Date(r.id);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === day;
      }).length,
    }));
  }, [recordings]);

  const maxCount = Math.max(1, ...weekActivity.map(d => d.count));

  const handleClear = async () => {
    await clearAllRecordingsFromDB();
    setRecordings([]);
    setConfirmClear(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />
      <NavBar title="My Profile" onBack={onBack} backLabel="Back" />

      <div className="screen-scroll" style={{ flex: 1, padding: '8px 24px 32px' }}>
        {/* Avatar + name */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, marginBottom: 12,
            background: 'linear-gradient(135deg, #2563EB, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, color: '#fff' }}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.6px', color: C.text, marginBottom: 2 }}>{userName}</h1>
          <p style={{ fontSize: 14, color: C.textSec }}>Keep building momentum.</p>
        </div>

        {/* Level */}
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 10 }}>My level</Label>
          <div className="seg">
            {(['Beginner', 'Intermediate', 'Expert'] as ProficiencyLevel[]).map(l => (
              <button key={l} className={`seg-btn ${proficiency === l ? 'active' : ''}`} onClick={() => {
                setProficiency(l);
                localStorage.setItem('hue-proficiency', l);
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 10 }}>Statistics</Label>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.divider}` }}>
              <div style={{ padding: '16px', borderRight: `1px solid ${C.divider}` }}>
                <Label style={{ marginBottom: 6 }}>Day streak</Label>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: F.mono, color: C.text }}>{streak}</p>
              </div>
              <div style={{ padding: '16px' }}>
                <Label style={{ marginBottom: 6 }}>Total XP</Label>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: F.mono, color: C.blue }}>{totalXp}</p>
              </div>
            </div>
            <StatRow label="Total sessions" value={recordings.length} border />
            <StatRow label="Avg. score" value={avgScore !== null ? `${avgScore}%` : '—'} border />
            <StatRow label="Language" value={localStorage.getItem('hue-language') || '—'} border />
          </Card>
        </div>

        {/* Weekly activity */}
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 10 }}>This week</Label>
          <Card style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
              {weekActivity.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', borderRadius: 3,
                    background: d.count > 0 ? C.blue : C.divider,
                    height: d.count > 0 ? Math.max(8, (d.count / maxCount) * 44) : 8,
                    opacity: d.count > 0 ? 1 : 1,
                  }} />
                  <span style={{ fontSize: 10, color: C.textMuted, fontFamily: F.mono }}>{d.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Account */}
        <div>
          <Label style={{ marginBottom: 10 }}>Account</Label>
          <Card>
            {confirmClear ? (
              <div style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: C.text, marginBottom: 12 }}>Delete all practice history? This can't be undone.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setConfirmClear(false)} style={{
                    flex: 1, padding: '10px', border: `1px solid ${C.border}`, borderRadius: 8,
                    background: C.card, fontFamily: F.sans, fontSize: 14, cursor: 'pointer', color: C.textSec,
                  }}>Cancel</button>
                  <button onClick={handleClear} style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: 8,
                    background: C.red, fontFamily: F.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff',
                  }}>Delete</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setConfirmClear(true)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 14, color: C.red }}>Clear practice history</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
            )}
          </Card>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default ProfileScreen;
