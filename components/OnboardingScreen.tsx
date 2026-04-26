
import React, { useState } from 'react';
import { LANGUAGES } from './LanguageSelector';

interface OnboardingScreenProps {
  onComplete: (name: string, language: string) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [error, setError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid name.');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = () => {
    onComplete(name.trim(), selectedLang);
  };

  return (
    <div className="flex flex-col h-full bg-white sm:rounded-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100">
        <div 
            className="h-full bg-hue-blue transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
        ></div>
      </div>

      <div className="flex-grow flex flex-col p-8 overflow-y-auto">
        
        {step === 1 && (
            <div className="flex-grow flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-20 h-20 bg-hue-bg rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm">
                    👋
                </div>
                <h1 className="text-3xl font-bold text-hue-text text-center mb-2">Welcome to Hue</h1>
                <p className="text-hue-text-secondary text-center mb-8">Let's get to know each other.</p>

                <form onSubmit={handleNameSubmit} className="w-full max-w-xs space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-hue-text-secondary uppercase tracking-wider mb-2 text-center">What's your name?</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="Type your name..."
                            className="w-full p-4 bg-hue-bg rounded-xl border-2 border-transparent focus:border-hue-blue focus:bg-white outline-none transition-all text-xl text-center font-bold text-hue-text placeholder:text-gray-400 placeholder:font-normal"
                            autoFocus
                        />
                        {error && <p className="text-hue-red text-sm mt-2 text-center font-medium">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-hue-text text-white font-bold py-4 px-4 rounded-xl hover:bg-black transition-colors text-lg shadow-lg shadow-gray-200 mt-4"
                    >
                        Continue
                    </button>
                </form>
            </div>
        )}

        {step === 2 && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-6 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-hue-text">Target Language</h1>
                    <p className="text-hue-text-secondary">Which language are you learning?</p>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 pr-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.name}
                            onClick={() => setSelectedLang(lang.name)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                                selectedLang === lang.name 
                                ? 'border-hue-blue bg-hue-blue/5' 
                                : 'border-border-gray hover:border-gray-300'
                            }`}
                        >
                            <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                            <span className={`font-bold text-sm ${selectedLang === lang.name ? 'text-hue-blue' : 'text-hue-text'}`}>
                                {lang.name}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="pt-4 mt-auto border-t border-gray-100 flex-shrink-0">
                     <button
                        onClick={handleFinalSubmit}
                        className="w-full bg-hue-blue text-white font-bold py-4 px-4 rounded-xl hover:bg-hue-blue-dark transition-colors text-lg shadow-lg shadow-hue-blue/20"
                    >
                        Start Practicing
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
