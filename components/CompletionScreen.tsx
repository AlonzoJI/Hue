import React from 'react';
import { AIFeedback } from '../types';
import Header from './Header';

interface CompletionScreenProps {
  feedback: AIFeedback;
  onContinue: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ feedback, onContinue }) => {
  const baseScore = Math.round(feedback.overallScore);
  const bonusXp = feedback.challengeWordsUsed.filter(w => w.used).length * 5; // 5 XP per word
  const totalXp = baseScore + bonusXp;

  return (
    <div className="flex flex-col h-full bg-hue-card-bg">
      <Header title="Hue" />
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-score-pronunciation/20 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 className="text-3xl font-bold text-hue-text mb-2">Session Complete!</h2>
        <p className="text-hue-text-secondary">Great work today.</p>
        
        <div className="w-full max-w-xs mt-12 bg-hue-bg p-4 rounded-2xl">
            <div className="flex justify-between items-end">
                <p className="text-hue-text-secondary font-bold text-sm">BASE XP</p>
                <p className="text-xl font-bold text-hue-text">{baseScore}</p>
            </div>
            <div className="flex justify-between items-end mt-2">
                <p className="text-accent-challenge font-bold text-sm">CHALLENGE BONUS</p>
                <p className="text-xl font-bold text-accent-challenge">+{bonusXp}</p>
            </div>
            <div className="border-t border-border-gray my-3"></div>
            <div className="flex justify-between items-end">
                <p className="text-hue-text-secondary font-bold text-sm">TOTAL XP</p>
                <p className="text-3xl font-bold text-accent-xp">
                    <span role="img" aria-label="star">⭐</span> {totalXp}
                </p>
            </div>
        </div>
      </div>
      <div className="p-6 border-t border-border-gray">
        <button
          onClick={onContinue}
          className="w-full bg-hue-blue text-white font-bold py-4 px-4 rounded-xl hover:bg-hue-blue-dark transition-colors text-lg"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;