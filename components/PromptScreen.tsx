import React, { useState, useMemo } from 'react';
import { Screen, ProficiencyLevel, Recording } from '../types';
import { C, F, StatusBar, HomeIndicator, NavBar, Label, Chip, Card, BtnPrimary, BtnSecondary } from './IOSFrame';
import { LANGUAGES } from './LanguageSelector';

interface Props {
  prompt: string;
  onStartRecording: () => void;
  onNavigate: (screen: Screen) => void;
  error: string | null;
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
  challengeWords: string[];
  isLoadingWords: boolean;
  proficiencyLevel: ProficiencyLevel;
  userName: string;
  recordings?: Recording[];
}

const PromptScreen: React.FC<Props> = ({
  prompt, onStartRecording, onNavigate, error,
  targetLanguage, onLanguageChange, challengeWords,
  isLoadingWords, proficiencyLevel, userName, recordings = [],
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.name === targetLanguage) || LANGUAGES[1];

  const totalXp = useMemo(() =>
    recordings.reduce((acc, rec) => {
      const bonus = rec.feedback.challengeWordsUsed.filter(w => w.used).length * 5;
      return acc + Math.round(rec.feedback.overallScore) + bonus;
    }, 0)
  , [recordings]);

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

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 8px' }}>
        <span style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 700, letterSpacing: 1, color: C.text }}>HUE</span>
        <button onClick={() => onNavigate(Screen.Profile)} style={{
          width: 36, height: 36, borderRadius: 8, background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSec,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: '8px 24px 24px' }}>
        {/* Lang + level row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <Label style={{ marginBottom: 8 }}>Practicing</Label>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
                cursor: 'pointer', fontFamily: F.sans, fontSize: 15, fontWeight: 500, color: C.text,
              }}>
                <span style={{ fontSize: 18 }}>{currentLang.flag}</span>
                {currentLang.name}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>
              {langOpen && (
                <div className="fade-in" style={{
                  position: 'absolute', top: '110%', left: 0, background: C.card,
                  border: `1px solid ${C.border}`, borderRadius: 10, width: 200,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden',
                }}>
                  {LANGUAGES.map(l => (
                    <button key={l.name} onClick={() => { onLanguageChange(l.name); setLangOpen(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px',
                      border: 'none', background: targetLanguage === l.name ? '#f5f8ff' : C.card,
                      cursor: 'pointer', fontFamily: F.sans, fontSize: 14, color: C.text,
                      fontWeight: targetLanguage === l.name ? 600 : 400,
                    }}>
                      <span style={{ fontSize: 16 }}>{l.flag}</span>
                      {l.name}
                      {targetLanguage === l.name && (
                        <span style={{ marginLeft: 'auto' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Label style={{ marginBottom: 4 }}>Level</Label>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.blue }}>{proficiencyLevel}</span>
          </div>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.6px', color: C.text, marginBottom: 4 }}>
            Hi, {userName.split(' ')[0]}.
          </h2>
          <p style={{ fontSize: 15, color: C.textSec }}>Ready for your daily session?</p>
        </div>

        {/* Today's topic */}
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 10 }}>Today's topic</Label>
          <Card style={{ padding: '18px 16px' }}>
            <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: C.text, lineHeight: 1.35 }}>{prompt}</p>
          </Card>
        </div>

        {/* Challenge words */}
        <div style={{ marginBottom: 32 }}>
          <Label style={{ marginBottom: 10 }}>Challenge words</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {isLoadingWords ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  height: 32, width: [64, 80, 56, 72][i - 1], borderRadius: 4,
                  background: '#7c3aed0a', border: '1px solid #7c3aed22',
                  animation: 'wave1 1.2s ease-in-out infinite',
                }} />
              ))
            ) : challengeWords.length > 0 ? (
              challengeWords.map(w => <Chip key={w}>{w}</Chip>)
            ) : (
              <span style={{ fontSize: 14, color: C.textMuted }}>Could not load words.</span>
            )}
          </div>
        </div>

        {/* Mini stats */}
        <Card style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex' }}>
            {[
              { label: 'Streak', val: `${streak}`, unit: 'days' },
              { label: 'Total XP', val: `${totalXp}`, unit: '' },
              { label: 'Sessions', val: `${recordings.length}`, unit: '' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '14px 16px', borderRight: i < 2 ? `1px solid ${C.divider}` : 'none' }}>
                <Label style={{ marginBottom: 4 }}>{s.label}</Label>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: F.mono }}>
                  {s.val} <span style={{ fontSize: 12, fontWeight: 400, color: C.textSec }}>{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
            padding: '12px 16px', marginBottom: 16, fontSize: 14, color: C.red,
          }}>{error}</div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BtnPrimary onClick={onStartRecording} disabled={isLoadingWords}>Start recording</BtnPrimary>
          <BtnSecondary onClick={() => onNavigate(Screen.Dashboard)}>View progress</BtnSecondary>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default PromptScreen;
