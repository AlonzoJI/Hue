import React, { useState } from 'react';
import { AIFeedback } from '../types';
import { C, F, StatusBar, HomeIndicator, NavBar, Label, Card, BtnPrimary, BtnSecondary, StatRow } from './IOSFrame';

interface Props {
  feedback: AIFeedback;
  transcription: string;
  onContinue: () => void;
  onRetry: () => void;
}

const MetricBar: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: `1px solid ${C.divider}` }}>
    <span style={{ fontSize: 14, color: C.textSec }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 80, height: 3, background: C.divider, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.purple})`, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: F.mono, color: C.text, width: 30, textAlign: 'right' }}>{score}</span>
    </div>
  </div>
);

const FeedbackScreen: React.FC<Props> = ({ feedback, transcription, onContinue, onRetry }) => {
  const [tab, setTab] = useState<'summary' | 'transcript' | 'tips'>('summary');

  const score = Math.round(feedback.overallScore);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - score / 100);

  const scoreLabel = score >= 85 ? 'Excellent.' : score >= 70 ? 'Good effort.' : score >= 55 ? 'Keep going.' : 'Room to grow.';

  const wordsUsed = feedback.challengeWordsUsed.filter(w => w.used);
  const wordsMissed = feedback.challengeWordsUsed.filter(w => !w.used);

  const baseXp = score;
  const bonusXp = wordsUsed.length * 5;
  const totalXp = baseXp + bonusXp;

  const tips = [
    feedback.grammar.score < 80 && { title: 'Work on grammar', body: feedback.grammar.feedback },
    feedback.fluency.score < 80 && { title: 'Build fluency', body: feedback.fluency.feedback },
    feedback.vocabulary.score < 80 && { title: 'Expand vocabulary', body: feedback.vocabulary.feedback },
    wordsMissed.length > 0 && { title: 'Missed challenge words', body: `Try using: ${wordsMissed.map(w => `"${w.word}"`).join(', ')} next time.` },
  ].filter(Boolean) as { title: string; body: string }[];

  if (tips.length === 0) tips.push({ title: 'Great work!', body: 'Your speech was fluent and accurate. Keep challenging yourself with harder topics.' });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />
      <NavBar title="Session Review" onBack={onRetry} backLabel="Home" />

      <div className="screen-scroll" style={{ flex: 1, padding: '8px 24px 32px' }}>

        {/* Score card */}
        <Card style={{ padding: '24px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
            <circle cx="44" cy="44" r="36" fill="none" stroke={C.divider} strokeWidth="6" />
            <circle cx="44" cy="44" r="36" fill="none" stroke="url(#sg)" strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 44 44)" className="score-ring" />
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.blue} /><stop offset="100%" stopColor={C.purple} />
              </linearGradient>
            </defs>
            <text x="44" y="49" textAnchor="middle" fontFamily={F.mono} fontSize="20" fontWeight="700" fill={C.text}>{score}</text>
          </svg>
          <div>
            <Label style={{ marginBottom: 4 }}>Overall score</Label>
            <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: C.text, marginBottom: 4 }}>{scoreLabel}</p>
            <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.4 }}>
              Keep building fluency in {feedback.challengeWordsUsed.length > 0 ? 'this' : 'your target'} language.
            </p>
          </div>
        </Card>

        {/* Tabs */}
        <div className="seg" style={{ marginBottom: 16 }}>
          {(['summary', 'transcript', 'tips'] as const).map(t => (
            <button key={t} className={`seg-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {tab === 'summary' && (
          <div className="fade-in">
            <Card style={{ marginBottom: 16 }}>
              <MetricBar label="Fluency" score={feedback.fluency.score} />
              <MetricBar label="Vocabulary" score={feedback.vocabulary.score} />
              <MetricBar label="Grammar" score={feedback.grammar.score} />
              <MetricBar label="Pronunciation" score={feedback.pronunciation.score} />
              <MetricBar label="Clarity" score={feedback.clarity.score} />
            </Card>

            {feedback.challengeWordsUsed.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Label style={{ marginBottom: 10 }}>Challenge words</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {wordsUsed.map(w => (
                    <span key={w.word} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                      background: '#dcfce7', border: '1px solid #86efac', color: C.green,
                      fontSize: 13, fontWeight: 500, borderRadius: 4,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                      {w.word}
                    </span>
                  ))}
                  {wordsMissed.map(w => (
                    <span key={w.word} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                      background: '#f5f5f5', border: `1px solid ${C.border}`, color: C.textMuted,
                      fontSize: 13, fontWeight: 500, borderRadius: 4, textDecoration: 'line-through',
                    }}>{w.word}</span>
                  ))}
                </div>
              </div>
            )}

            <Card style={{ padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Label style={{ marginBottom: 2 }}>XP earned</Label>
                <p style={{ fontSize: 22, fontWeight: 700, fontFamily: F.mono, color: C.blue }}>+{totalXp}</p>
              </div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </Card>
          </div>
        )}

        {/* Transcript tab */}
        {tab === 'transcript' && (
          <Card className="fade-in" style={{ padding: 16 }}>
            <Label style={{ marginBottom: 10 }}>What you said</Label>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
              "{transcription}"
            </p>
          </Card>
        )}

        {/* Tips tab */}
        {tab === 'tips' && (
          <div className="fade-in">
            {tips.map((tip, i) => (
              <Card key={i} style={{ padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{tip.title}</p>
                <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{tip.body}</p>
              </Card>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <BtnPrimary onClick={onContinue}>Continue</BtnPrimary>
          <BtnSecondary onClick={onRetry}>Practice again</BtnSecondary>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default FeedbackScreen;
