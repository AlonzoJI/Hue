import React from 'react';
import { ProficiencyLevel } from '../types';

interface ProficiencySelectorProps {
  selectedLevel: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
}

const LEVELS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Expert'];

const ProficiencySelector: React.FC<ProficiencySelectorProps> = ({ selectedLevel, onLevelChange }) => {
  return (
    <div className="flex w-full bg-gray-200 rounded-lg p-1">
      {LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onLevelChange(level)}
          className={`w-full text-center py-2 px-3 rounded-md transition-all text-sm font-bold
            ${selectedLevel === level
              ? 'bg-white text-hue-blue shadow'
              : 'bg-transparent text-hue-text-secondary hover:bg-gray-300/50'
            }
          `}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default ProficiencySelector;