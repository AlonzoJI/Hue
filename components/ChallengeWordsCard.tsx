import React from 'react';
import { ChallengeWordFeedback } from '../types';

interface ChallengeWordsCardProps {
    words: ChallengeWordFeedback[];
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-score-pronunciation flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
);

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-hue-text-secondary/30 flex-shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const ChallengeWordsCard: React.FC<ChallengeWordsCardProps> = ({ words }) => {
    if (!words || words.length === 0) {
        return null;
    }

    return (
        <div className="bg-hue-card-bg p-4 rounded-2xl border border-border-gray mb-4">
            <h3 className="font-bold text-lg text-hue-text mb-3">Challenge Words</h3>
            <ul className="space-y-3">
                {words.map(({ word, used, feedback }) => (
                    <li key={word} className="flex items-start space-x-3">
                        {used ? <CheckIcon /> : <CrossIcon />}
                        <div>
                            <p className="text-hue-text font-semibold">{word}</p>
                            <p className="text-sm text-hue-text-secondary">{feedback}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChallengeWordsCard;