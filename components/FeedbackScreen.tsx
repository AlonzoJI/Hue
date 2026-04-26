import React from 'react';
import { AIFeedback } from '../types';
import Header from './Header';
import ScoreCard from './ScoreCard';
import ChallengeWordsCard from './ChallengeWordsCard';
import RadarChart from './RadarChart';

interface FeedbackScreenProps {
  feedback: AIFeedback;
  transcription: string;
  onContinue: () => void;
  onRetry: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ feedback, transcription, onContinue, onRetry }) => {
  return (
    <div className="flex flex-col h-full bg-hue-bg">
      <Header title="Your Feedback" onBack={onRetry}/>
      <div className="flex-grow p-4 overflow-y-auto">
        
        <div className="p-4 bg-white rounded-2xl border border-border-gray">
          <h3 className="text-center font-bold text-lg text-hue-text mb-2">Performance Snapshot</h3>
          <div className="w-full h-64 mx-auto">
            <RadarChart feedback={feedback} />
          </div>
        </div>
        
        <div className="my-4 p-4 bg-hue-card-bg rounded-2xl border border-border-gray">
            <h3 className="font-bold text-hue-text mb-2">Your response:</h3>
            <p className="text-hue-text-secondary italic">"{transcription}"</p>
        </div>

        <ChallengeWordsCard words={feedback.challengeWordsUsed} />

        <ScoreCard 
          title="Grammar" 
          score={feedback.grammar.score} 
          feedback={feedback.grammar.feedback} 
          color="#score-grammar"
        />
        <ScoreCard 
          title="Pronunciation" 
          score={feedback.pronunciation.score} 
          feedback={feedback.pronunciation.feedback} 
          color="#score-pronunciation"
        />
        <ScoreCard 
          title="Fluency" 
          score={feedback.fluency.score} 
          feedback={feedback.fluency.feedback} 
          color="#score-fluency"
        />
        <ScoreCard 
          title="Vocabulary" 
          score={feedback.vocabulary.score} 
          feedback={feedback.vocabulary.feedback} 
          color="#score-vocabulary"
        />
        <ScoreCard 
          title="Clarity" 
          score={feedback.clarity.score} 
          feedback={feedback.clarity.feedback} 
          color="#score-clarity"
        />
      </div>
      <div className="p-4 border-t border-border-gray bg-hue-card-bg">
        <button
          onClick={onContinue}
          className="w-full bg-hue-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-hue-blue-dark transition-colors text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FeedbackScreen;