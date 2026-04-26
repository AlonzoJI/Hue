import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Recording, AIFeedback } from '../types';
import Header from './Header';
import FeedbackScreen from './FeedbackScreen';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface DashboardScreenProps {
  recordings: Recording[];
  onBack: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ recordings, onBack }) => {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  const chartData = useMemo(() => {
    const reversedRecordings = [...recordings].reverse();
    const labels = reversedRecordings.map(rec => new Date(rec.id).toLocaleDateString());
    
    const datasets = [
        {
            label: 'Overall Score',
            data: reversedRecordings.map(rec => rec.feedback.overallScore),
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.2)',
            fill: true,
            tension: 0.3,
            yAxisID: 'y',
        }
    ];

    return { labels, datasets };
  }, [recordings]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#6B7280' }
      },
      x: {
        ticks: { color: '#6B7280' }
      }
    }
  };

  if (selectedRecording) {
    return (
      <FeedbackScreen
        feedback={selectedRecording.feedback}
        transcription={selectedRecording.transcription}
        onContinue={() => setSelectedRecording(null)}
        onRetry={() => setSelectedRecording(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-hue-bg">
      <Header title="My Progress" onBack={onBack} />
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl border border-border-gray mb-6">
            <h2 className="text-lg font-bold text-hue-text mb-2">Overall Score Trend</h2>
            <div className="h-64">
                {recordings.length > 1 ? (
                    <Line options={chartOptions} data={chartData} />
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-hue-text-secondary">
                        <p>Complete more sessions to see your progress chart.</p>
                    </div>
                )}
            </div>
        </div>

        <h2 className="text-lg font-bold text-hue-text mb-2">Practice History</h2>
        {recordings.length === 0 ? (
          <p className="text-center text-hue-text-secondary mt-8">No recordings yet. Complete a prompt to see it here!</p>
        ) : (
          <ul className="space-y-3">
            {recordings.map((rec) => (
              <li key={rec.id}>
                <button
                  onClick={() => setSelectedRecording(rec)}
                  className="w-full text-left p-4 bg-hue-card-bg rounded-xl border border-border-gray hover:border-hue-blue transition-all"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-hue-text truncate flex-1 pr-4">{rec.prompt}</p>
                    <span className="text-sm font-semibold bg-hue-blue/10 text-hue-blue px-2 py-1 rounded-full">{rec.feedback.overallScore}%</span>
                  </div>
                  <p className="text-sm text-hue-text-secondary mt-1">{rec.date}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;