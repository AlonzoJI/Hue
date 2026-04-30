import React, { useState, useCallback, useEffect } from 'react';
import { Screen, AIFeedback, Recording, ProficiencyLevel } from './types';
import PromptScreen from './components/PromptScreen';
import RecordingScreen from './components/RecordingScreen';
import LoadingScreen from './components/LoadingScreen';
import FeedbackScreen from './components/FeedbackScreen';
import CompletionScreen from './components/CompletionScreen';
import DashboardScreen from './components/DashboardScreen';
import ProfileScreen from './components/ProfileScreen';
import OnboardingScreen from './components/OnboardingScreen';
import { evaluateSpeech, getChallengeWords } from './services/geminiService';
import { initDB, saveRecordingToDB, getRecordingsFromDB, clearAllRecordingsFromDB } from './services/db';
import { IOSDevice } from './components/IOSFrame';

const PROMPTS = [
  "Describe your perfect weekend getaway.",
  "What is your favorite food and why? Describe how to make it.",
  "Talk about a movie you recently watched and whether you would recommend it.",
  "Describe your dream vacation.",
  "What are your career goals for the next five years?",
  "If you could have dinner with anyone, living or dead, who would it be and why?",
  "Describe a challenge you overcame and what you learned from it."
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Loading);
  const [currentPrompt] = useState<string>(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [pastRecordings, setPastRecordings] = useState<Recording[]>([]);
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(() =>
    (localStorage.getItem('hue-proficiency') as ProficiencyLevel) || 'Beginner'
  );
  const [targetLanguage, setTargetLanguage] = useState<string>(() =>
    localStorage.getItem('hue-language') || 'Spanish'
  );
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const storedName = localStorage.getItem('hue-username');
        setUserName(storedName);
        await initDB();
        const recordings = await getRecordingsFromDB();
        setPastRecordings(recordings.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()));
        setScreen(storedName ? Screen.Prompt : Screen.Onboarding);
      } catch {
        setScreen(Screen.Prompt);
      }
    };
    init();
  }, []);

  const fetchWords = useCallback(async () => {
    setIsLoadingWords(true);
    setError(null);
    try {
      const words = await getChallengeWords(currentPrompt, targetLanguage, proficiencyLevel);
      setChallengeWords(words);
    } catch {
      setChallengeWords([]);
    } finally {
      setIsLoadingWords(false);
    }
  }, [currentPrompt, targetLanguage, proficiencyLevel]);

  useEffect(() => {
    if (userName && screen === Screen.Prompt) fetchWords();
  }, [currentPrompt, targetLanguage, proficiencyLevel, userName, screen, fetchWords]);

  const handleOnboardingComplete = (name: string, language: string) => {
    localStorage.setItem('hue-username', name);
    localStorage.setItem('hue-language', language);
    setUserName(name);
    setTargetLanguage(language);
    const savedLevel = localStorage.getItem('hue-proficiency') as ProficiencyLevel;
    if (savedLevel) setProficiencyLevel(savedLevel);
    setScreen(Screen.Prompt);
  };

  const handleRecordingComplete = useCallback(async (audioBlob: Blob) => {
    setScreen(Screen.Loading);
    try {
      const result = await evaluateSpeech(audioBlob, targetLanguage, proficiencyLevel, currentPrompt, challengeWords, userName || 'User');
      if (result.transcription && result.feedback) {
        setFeedback(result.feedback);
        setTranscription(result.transcription);
        const newRecording: Recording = {
          id: new Date().toISOString(),
          prompt: currentPrompt,
          transcription: result.transcription,
          feedback: result.feedback,
          date: new Date().toLocaleString(),
          targetLanguage,
          challengeWords,
          proficiencyLevel,
        };
        await saveRecordingToDB(newRecording);
        setPastRecordings(prev => [newRecording, ...prev]);
        setScreen(Screen.Feedback);
      } else {
        throw new Error("Incomplete AI response.");
      }
    } catch (err) {
      setError(`Failed to evaluate. ${err instanceof Error ? err.message : ''}`);
      setScreen(Screen.Prompt);
    }
  }, [currentPrompt, targetLanguage, proficiencyLevel, challengeWords, userName]);

  const navigate = (s: Screen) => {
    setError(null);
    if (s === Screen.Prompt) { setFeedback(null); setTranscription(''); }
    setScreen(s);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.Onboarding:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case Screen.Recording:
        return <RecordingScreen prompt={currentPrompt} onRecordingComplete={handleRecordingComplete} onCancel={() => navigate(Screen.Prompt)} challengeWords={challengeWords} />;
      case Screen.Loading:
        return <LoadingScreen />;
      case Screen.Feedback:
        return feedback && <FeedbackScreen feedback={feedback} transcription={transcription} onContinue={() => navigate(Screen.Complete)} onRetry={() => navigate(Screen.Prompt)} />;
      case Screen.Complete:
        return feedback && <CompletionScreen feedback={feedback} onContinue={() => navigate(Screen.Prompt)} />;
      case Screen.Dashboard:
        return <DashboardScreen recordings={pastRecordings} onBack={() => navigate(Screen.Prompt)} />;
      case Screen.Profile:
        return <ProfileScreen
          proficiency={proficiencyLevel}
          setProficiency={setProficiencyLevel}
          onBack={() => navigate(Screen.Prompt)}
          recordings={pastRecordings}
          setRecordings={setPastRecordings}
          userName={userName || 'Guest'}
        />;
      case Screen.Prompt:
      default:
        return <PromptScreen
          prompt={currentPrompt}
          onStartRecording={() => { setError(null); setScreen(Screen.Recording); }}
          onNavigate={navigate}
          error={error}
          targetLanguage={targetLanguage}
          onLanguageChange={setTargetLanguage}
          challengeWords={challengeWords}
          isLoadingWords={isLoadingWords}
          proficiencyLevel={proficiencyLevel}
          userName={userName || 'Guest'}
          recordings={pastRecordings}
        />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ECECEC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <IOSDevice width={390} height={844}>
        {renderScreen()}
      </IOSDevice>
    </div>
  );
};

export default App;
