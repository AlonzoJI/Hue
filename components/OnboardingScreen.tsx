import React, { useState, useEffect } from 'react';
import { C, F, StatusBar, HomeIndicator, BtnPrimary, Label, Card } from './IOSFrame';
import { LANGUAGES } from './LanguageSelector';
import { ProficiencyLevel } from '../types';

interface Props { onComplete: (name: string, language: string) => void; }

const TOTAL = 4;

// ─── Splash ───────────────────────────────────────────────────────────────────
const Splash: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setExiting(true); setTimeout(onDone, 400); }, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      onClick={() => { if (!exiting) { setExiting(true); setTimeout(onDone, 400); } }}
      style={{
        position: 'absolute', inset: 0, background: '#080810',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 50,
        opacity: exiting ? 0 : 1, transform: exiting ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="orb1" style={{ position: 'absolute', top: '18%', left: '10%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #2563eb28 0%, transparent 70%)' }} />
        <div className="orb2" style={{ position: 'absolute', bottom: '20%', right: '8%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed22 0%, transparent 70%)' }} />
        <div className="orb3" style={{ position: 'absolute', top: '55%', left: '50%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, #2563eb18 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div className="splash-logo" style={{ marginBottom: 28, position: 'relative' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: -8, left: -8 }}>
          <circle cx="40" cy="40" r="38" fill="none" stroke="url(#sRing)" strokeWidth="1" opacity="0.4" />
          <defs>
            <linearGradient id="sRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px #2563eb40, 0 0 80px #7c3aed20',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>H</span>
        </div>
      </div>

      <div className="splash-l1" style={{ opacity: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 6, textTransform: 'uppercase' }}>HUE</span>
      </div>
      <div className="splash-l2" style={{ opacity: 0, marginTop: 10 }}>
        <span style={{ fontSize: 14, color: '#ffffff50', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500 }}>AI Language Coach</span>
      </div>
      <div className="splash-hint" style={{ position: 'absolute', bottom: 60, opacity: 0 }}>
        <span style={{ fontSize: 12, color: '#ffffff50', letterSpacing: 1 }}>tap to continue</span>
      </div>
    </div>
  );
};

// ─── Main Onboarding ──────────────────────────────────────────────────────────
const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [lang, setLang] = useState('Spanish');
  const [level, setLevel] = useState<ProficiencyLevel>('Beginner');
  const [goal, setGoal] = useState('regular');
  const [showDone, setShowDone] = useState(false);

  const titles = [
    ["What should we\ncall you?", "Let's get started."],
    ["What are you\nlearning?", "Choose your target language."],
    ["What's your\ncurrent level?", "Hue will adapt to you."],
    ["Set your\nlearning goal.", "How much time can you commit?"],
  ];

  const canContinue = [name.trim().length > 0, !!lang, !!level, !!goal][step];

  const next = () => {
    if (step < TOTAL - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('hue-proficiency', level);
      localStorage.setItem('hue-goal', goal);
      setShowDone(true);
      setTimeout(() => onComplete(name.trim(), lang), 2200);
    }
  };

  const goals = [
    { id: 'casual', label: 'Casual', desc: '5 min / day — light & flexible' },
    { id: 'regular', label: 'Regular', desc: '10 min / day — steady progress' },
    { id: 'serious', label: 'Serious', desc: '20 min / day — accelerated' },
    { id: 'intensive', label: 'Intensive', desc: '30+ min / day — full immersion' },
  ];

  const levels: { id: ProficiencyLevel; desc: string }[] = [
    { id: 'Beginner', desc: 'Just starting out — guided prompts, simple vocabulary.' },
    { id: 'Intermediate', desc: 'Conversational foundation — richer topics and feedback.' },
    { id: 'Expert', desc: 'Near-fluent — idioms, nuance, advanced grammar.' },
  ];

  if (showSplash) return <Splash onDone={() => setShowSplash(false)} />;

  if (showDone) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: C.bg }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="35" fill="none" stroke={C.divider} strokeWidth="5" />
          <circle cx="55" cy="55" r="35" fill="none" stroke="url(#cg)" strokeWidth="5"
            strokeLinecap="round" transform="rotate(-90 55 55)" className="comp-ring" />
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.blue} /><stop offset="100%" stopColor={C.purple} />
            </linearGradient>
          </defs>
        </svg>
        <div className="comp-check" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
      </div>
      <p className="comp-t1" style={{ marginTop: 28, fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', color: C.text, opacity: 0, textAlign: 'center' }}>
        You're all set, {name.split(' ')[0]}.
      </p>
      <p className="comp-t2" style={{ marginTop: 8, fontSize: 15, color: C.textSec, opacity: 0, textAlign: 'center' }}>
        Your learning plan is ready.
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />

      {/* Progress row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 0', gap: 12, height: 44 }}>
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} style={{
            display: 'flex', alignItems: 'center', background: 'none', border: 'none',
            cursor: 'pointer', color: C.textSec, padding: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
        ) : <div style={{ width: 20 }} />}
        <div style={{ flex: 1 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
          </div>
        </div>
        <Label>{step + 1} / {TOTAL}</Label>
      </div>

      {/* Scrollable content */}
      <div className="screen-scroll" style={{ flex: 1, padding: '24px 24px 32px' }}>
        <div style={{ marginBottom: 28 }} key={step}>
          <h1 className="fade-in" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.7px', color: C.text, lineHeight: 1.25, marginBottom: 6, whiteSpace: 'pre-line' }}>
            {titles[step][0]}
          </h1>
          <p className="fade-in" style={{ fontSize: 15, color: C.textMuted }}>{titles[step][1]}</p>
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="fade-in">
            <Label style={{ marginBottom: 8 }}>Full name</Label>
            <input
              className="hue-input"
              type="text"
              placeholder="e.g. Jared Kim"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canContinue && next()}
              autoFocus
              style={{ marginTop: 8 }}
            />
          </div>
        )}

        {/* Step 1: Language */}
        {step === 1 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {LANGUAGES.map(l => (
              <button key={l.name} onClick={() => setLang(l.name)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                border: `1px solid ${lang === l.name ? C.blue : C.border}`,
                background: lang === l.name ? '#2563eb08' : C.card,
                borderRadius: 10, cursor: 'pointer', fontFamily: F.sans, fontSize: 15, fontWeight: 500, color: C.text,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 20 }}>{l.flag}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{l.name}</span>
                {lang === l.name && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Level */}
        {step === 2 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {levels.map(l => (
              <button key={l.id} className={`sel-row ${level === l.id ? 'active' : ''}`} onClick={() => setLevel(l.id)}>
                <div className="sel-dot">
                  {level === l.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>{l.id}</p>
                  <p style={{ fontSize: 13, color: C.textMuted }}>{l.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {goals.map(g => (
              <button key={g.id} className={`sel-row ${goal === g.id ? 'active' : ''}`} onClick={() => setGoal(g.id)}>
                <div className="sel-dot">
                  {goal === g.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>{g.label}</p>
                  <p style={{ fontSize: 13, color: C.textMuted }}>{g.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <BtnPrimary onClick={next} disabled={!canContinue}>
            {step === TOTAL - 1 ? 'Create my plan' : 'Continue'}
          </BtnPrimary>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default OnboardingScreen;
