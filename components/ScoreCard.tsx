import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number; // 0-100
  feedback: string;
  color: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, feedback, color }) => {
  const scoreColor = score < 50 ? 'text-hue-red' : score < 80 ? 'text-score-fluency' : 'text-score-pronunciation';

  return (
    <div className="bg-hue-card-bg p-4 rounded-2xl border border-border-gray mb-4">
      <div className="flex items-center space-x-4 mb-2">
        <h3 className="font-bold text-lg text-hue-text flex-grow">{title}</h3>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div className="h-2 rounded-full" style={{ width: `${score}%`, backgroundColor: color }}></div>
      </div>
      <p className="text-hue-text-secondary whitespace-pre-line">{feedback}</p>
    </div>
  );
};

export default ScoreCard;