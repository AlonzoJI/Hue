import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Recording } from '../types';
import { C, F, StatusBar, HomeIndicator, NavBar, Label, Card } from './IOSFrame';
import FeedbackScreen from './FeedbackScreen';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props { recordings: Recording[]; onBack: () => void; }

const DashboardScreen: React.FC<Props> = ({ recordings, onBack }) => {
  const [selected, setSelected] = useState<Recording | null>(null);

  const chartData = useMemo(() => {
    const rev = [...recordings].reverse();
    return {
      labels: rev.map(r => new Date(r.id).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Score',
        data: rev.map(r => r.feedback.overallScore),
        borderColor: C.blue,
        backgroundColor: 'rgba(37,99,235,0.08)',
        fill: true, tension: 0.3,
      }],
    };
  }, [recordings]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { color: C.textMuted, font: { size: 11 } }, grid: { color: C.divider } },
      x: { ticks: { color: C.textMuted, font: { size: 11 } }, grid: { color: 'transparent' } },
    },
  };

  if (selected) return (
    <FeedbackScreen
      feedback={selected.feedback}
      transcription={selected.transcription}
      onContinue={() => setSelected(null)}
      onRetry={() => setSelected(null)}
    />
  );

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <StatusBar />
      <NavBar title="My Progress" onBack={onBack} backLabel="Back" />

      <div className="screen-scroll" style={{ flex: 1, padding: '8px 24px 32px' }}>
        {/* Chart */}
        <Card style={{ padding: '16px', marginBottom: 24 }}>
          <Label style={{ marginBottom: 10 }}>Overall score trend</Label>
          <div style={{ height: 160 }}>
            {recordings.length > 1 ? (
              <Line options={chartOptions} data={chartData} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: C.textMuted }}>Complete more sessions to see your progress chart.</p>
              </div>
            )}
          </div>
        </Card>

        {/* History */}
        <Label style={{ marginBottom: 12 }}>Practice history</Label>
        {recordings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 14, color: C.textMuted }}>No recordings yet. Complete a session to see it here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recordings.map(rec => {
              const score = Math.round(rec.feedback.overallScore);
              const scoreColor = score >= 80 ? C.green : score >= 60 ? C.blue : C.red;
              return (
                <button key={rec.id} onClick={() => setSelected(rec)} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                  fontFamily: F.sans, width: '100%', transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: C.text, flex: 1, lineHeight: 1.4 }}>{rec.prompt}</p>
                    <span style={{
                      fontFamily: F.mono, fontSize: 14, fontWeight: 700, color: scoreColor,
                      background: `${scoreColor}12`, padding: '3px 8px', borderRadius: 4, flexShrink: 0,
                    }}>{score}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>{rec.date} · {rec.targetLanguage}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <HomeIndicator />
    </div>
  );
};

export default DashboardScreen;
