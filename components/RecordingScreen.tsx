import React, { useEffect, useState } from 'react';
import { C, F, StatusBar, HomeIndicator, NavBar, Label, Chip, Card } from './IOSFrame';
import { useRecorder } from '../hooks/useRecorder';

interface Props {
  prompt: string;
  challengeWords: string[];
  onRecordingComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const BARS = ['bar1','bar2','bar3','bar4','bar5','bar6','bar7','bar8','bar9','bar10','bar11','bar12'];

const RecordingScreen: React.FC<Props> = ({ prompt, challengeWords, onRecordingComplete, onCancel }) => {
  const { isRecording, startRecording, stopRecording, error } = useRecorder({ onRecordingComplete });
  const [seconds, setSeconds] = useState(0);

  useEffect(() => { startRecording(); }, []);

  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleStop = () => { if (isRecording) stopRecording(); };
  const handleCancel = () => { if (isRecording) stopRecording(); onCancel(); };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />
      <NavBar title="Recording" onBack={handleCancel} backLabel="Back" />

      <div className="screen-scroll" style={{ flex: 1, padding: '16px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* Topic card */}
        <Card style={{ padding: '18px 16px', marginBottom: 20 }}>
          <Label style={{ marginBottom: 8 }}>Topic</Label>
          <p style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.4px', color: C.text, lineHeight: 1.35 }}>{prompt}</p>
        </Card>

        {/* Challenge words */}
        <div style={{ marginBottom: 28 }}>
          <Label style={{ marginBottom: 10 }}>Try using</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {challengeWords.map(w => <Chip key={w}>{w}</Chip>)}
          </div>
        </div>

        {/* Visualizer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          {/* Timer */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: F.mono, fontSize: 42, fontWeight: 700, letterSpacing: 2, color: C.text }}>
              {fmt(seconds)}
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              {isRecording ? 'Recording in progress' : 'Processing...'}
            </p>
          </div>

          {/* Waveform */}
          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 40 }}>
              {BARS.map((b, i) => (
                <div key={i} className={b} style={{
                  width: 4, borderRadius: 2, minHeight: 4,
                  background: i % 3 === 0 ? C.blue : i % 3 === 1 ? C.purple : C.border,
                }} />
              ))}
            </div>
          )}

          {/* Stop button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isRecording && (
              <div className="pulse-ring" style={{
                position: 'absolute', width: 72, height: 72, borderRadius: '50%',
                background: 'transparent', border: `2px solid ${C.red}`, opacity: 0.4,
                pointerEvents: 'none',
              }} />
            )}
            <button
              onClick={handleStop}
              style={{
                width: 72, height: 72, borderRadius: '50%', background: C.red,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', transition: 'transform 0.1s',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <rect x="5" y="5" width="14" height="14" rx="2"/>
              </svg>
            </button>
          </div>

          {error && <p style={{ fontSize: 13, color: C.red, textAlign: 'center' }}>{error}</p>}
          <p style={{ fontSize: 13, color: C.textMuted }}>Tap to stop recording</p>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default RecordingScreen;
