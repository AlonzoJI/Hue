
import React, { useState } from 'react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LANGUAGES = [
  { name: "English", flag: "🇺🇸" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "German", flag: "🇩🇪" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Mandarin Chinese", flag: "🇨🇳" },
  { name: "Portuguese", flag: "🇧🇷" },
  { name: "Russian", flag: "🇷🇺" },
  { name: "Hindi", flag: "🇮🇳" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Yoruba", flag: "🇳🇬" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.name === selectedLanguage) || LANGUAGES[0];

  const handleSelect = (langName: string) => {
    onLanguageChange(langName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <p className="block text-sm font-bold text-hue-text-secondary uppercase tracking-wider mb-1">
        I'm practicing
      </p>
      
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-border-gray rounded-xl p-3 flex items-center justify-between hover:border-hue-blue transition-colors shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentLang.flag}</span>
          <span className="font-bold text-hue-text">{currentLang.name}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hue-text-secondary">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-border-gray">
              <h3 className="font-bold text-lg text-hue-text">Select Language</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hue-text"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.name}
                        onClick={() => handleSelect(lang.name)}
                        className={`flex items-center space-x-4 p-3 rounded-xl border transition-all ${
                            selectedLanguage === lang.name 
                            ? 'border-hue-blue bg-hue-blue/5 ring-1 ring-hue-blue' 
                            : 'border-border-gray hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-3xl">{lang.flag}</span>
                        <span className={`font-bold text-lg ${selectedLanguage === lang.name ? 'text-hue-blue' : 'text-hue-text'}`}>
                            {lang.name}
                        </span>
                         {selectedLanguage === lang.name && (
                            <div className="ml-auto text-hue-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                         )}
                    </button>
                ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
