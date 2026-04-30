import React from 'react';
import { AIFeedback } from '../types';
import { C, F, StatusBar, HomeIndicator, BtnPrimary, Label, Card } from './IOSFrame';

interface Props { feedback: AIFeedback; onContinue: () => void; }

const CompletionScreen: React.FC<Props> = ({ feedback, onContinue }) => {
  const baseXp = Math.round(feedback.overallScore);
  const bonusXp = feedback.challengeWordsUsed.filter(w => w.used).length * 5;
  const totalXp = baseXp + bonusXp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: C.bg }}>
      {/* Completion ring + check */}
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="35" fill="none" stroke={C.divider} strokeWidth="5" />
          <circle cx="55" cy="55" r="35" fill="none" stroke="url(#cg2)" strokeWidth="5"
            strokeLinecap="round" transform="rotate(-90 55 55)" className="comp-ring" />
          <defs>
            <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="0">
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
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
      </div>

      <p className="comp-t1" style={{ marginTop: 28, fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', color: C.text, opacity: 0 }}>
        Session complete!
      </p>
      <p className="comp-t2" style={{ marginTop: 6, fontSize: 15, color: C.textSec, opacity: 0 }}>
        Great work today.
      </p>

      {/* XP breakdown */}
      <Card className="comp-t2" style={{ width: '80%', marginTop: 28, padding: 16, opacity: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Label>Base XP</Label>
          <span style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 700, color: C.text }}>{baseXp}</span>
        </div>
        {bonusXp > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Label style={{ color: C.purple }}>Challenge bonus</Label>
            <span style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 700, color: C.purple }}>+{bonusXp}</span>
          </div>
        )}
        <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label>Total XP</Label>
          <span style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>⭐ {totalXp}</span>
        </div>
      </Card>

      <div className="comp-btn" style={{ width: '80%', marginTop: 24, opacity: 0 }}>
        <BtnPrimary onClick={onContinue}>Done</BtnPrimary>
      </div>
    </div>
  );
};

export default CompletionScreen;
