
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
    const [screen, setScreen] = useState<Screen>(Screen.Loading); // Start loading to check DB/Localstorage
    const [currentPrompt] = useState<string>(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    const [feedback, setFeedback] = useState<AIFeedback | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    
    const [userName, setUserName] = useState<string | null>(null);
    
    // Initialize with empty array, load from DB on mount
    const [pastRecordings, setPastRecordings] = useState<Recording[]>([]);
    const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(() => {
        return (localStorage.getItem('lingo-proficiency') as ProficiencyLevel) || 'Beginner';
    });
    
    const [targetLanguage, setTargetLanguage] = useState<string>(() => {
        return localStorage.getItem('lingo-language') || 'English';
    });
    
    const [challengeWords, setChallengeWords] = useState<string[]>([]);
    const [isLoadingWords, setIsLoadingWords] = useState<boolean>(false);

    // Initialization Effect
    useEffect(() => {
        const init = async () => {
            try {
                // Load Name
                const storedName = localStorage.getItem('lingo-username');
                setUserName(storedName);

                // Load DB
                await initDB();
                const recordings = await getRecordingsFromDB();
                const sorted = recordings.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
                setPastRecordings(sorted);

                // Decide initial screen
                if (!storedName) {
                    setScreen(Screen.Onboarding);
                } else {
                    setScreen(Screen.Prompt);
                }
            } catch (err) {
                console.error("Initialization error", err);
                // Fallback
                setScreen(Screen.Prompt);
            }
        };
        init();
    }, []);

    useEffect(() => {
        localStorage.setItem('lingo-proficiency', proficiencyLevel);
        localStorage.setItem('lingo-language', targetLanguage);
        
        // Fetch words only if we are past onboarding
        if (screen !== Screen.Onboarding && screen !== Screen.Loading) {
            fetchWords();
        }
    }, [proficiencyLevel, targetLanguage, screen]);

    const handleOnboardingComplete = (name: string, language: string) => {
        localStorage.setItem('lingo-username', name);
        localStorage.setItem('lingo-language', language);
        setUserName(name);
        setTargetLanguage(language);
        setScreen(Screen.Prompt);
    };

    const fetchWords = useCallback(async () => {
        setIsLoadingWords(true);
        setError(null);
        try {
            const words = await getChallengeWords(currentPrompt, targetLanguage, proficiencyLevel);
            setChallengeWords(words);
        } catch (err) {
            console.error(err);
            setError("Could not load challenge words. Please try again.");
            setChallengeWords([]);
        } finally {
            setIsLoadingWords(false);
        }
    }, [currentPrompt, targetLanguage, proficiencyLevel]);

    // Trigger fetch when dependencies change, but ensure we don't fetch during onboarding
    useEffect(() => {
        if (userName && screen === Screen.Prompt) {
            fetchWords();
        }
    }, [currentPrompt, targetLanguage, proficiencyLevel, userName, screen, fetchWords]);

    const handleStartRecording = () => {
        setError(null);
        setScreen(Screen.Recording);
    };

    const handleCancelRecording = () => {
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
                    targetLanguage: targetLanguage,
                    challengeWords: challengeWords,
                    proficiencyLevel: proficiencyLevel,
                };
                
                // Save to DB
                await saveRecordingToDB(newRecording);
                setPastRecordings(prev => [newRecording, ...prev]);

                setScreen(Screen.Feedback);
            } else {
                throw new Error("AI evaluation returned an incomplete format.");
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to evaluate audio. Error: ${errorMessage}`);
            setScreen(Screen.Prompt);
        }
    }, [currentPrompt, targetLanguage, proficiencyLevel, challengeWords, userName]);
    
    const handleNavigation = (targetScreen: Screen) => {
        setError(null);
        if (targetScreen === Screen.Prompt) {
            setFeedback(null);
            setTranscription('');
        }
        setScreen(targetScreen);
    };

    const renderScreen = () => {
        switch (screen) {
            case Screen.Onboarding:
                return <OnboardingScreen onComplete={handleOnboardingComplete} />;
            case Screen.Recording:
                return <RecordingScreen prompt={currentPrompt} onRecordingComplete={handleRecordingComplete} onCancel={handleCancelRecording} challengeWords={challengeWords} />;
            case Screen.Loading:
                return <LoadingScreen />;
            case Screen.Feedback:
                return feedback && <FeedbackScreen feedback={feedback} transcription={transcription} onContinue={() => handleNavigation(Screen.Complete)} onRetry={() => handleNavigation(Screen.Prompt)} />;
            case Screen.Complete:
                return feedback && <CompletionScreen feedback={feedback} onContinue={() => handleNavigation(Screen.Prompt)} />;
            case Screen.Dashboard:
                return <DashboardScreen recordings={pastRecordings} onBack={() => handleNavigation(Screen.Prompt)} />;
            case Screen.Profile:
                return <ProfileScreen 
                            proficiency={proficiencyLevel} 
                            setProficiency={setProficiencyLevel}
                            onBack={() => handleNavigation(Screen.Prompt)}
                            recordings={pastRecordings}
                            setRecordings={setPastRecordings}
                            userName={userName || 'Guest'}
                        />
            case Screen.Prompt:
            default:
                return <PromptScreen 
                            prompt={currentPrompt} 
                            onStartRecording={handleStartRecording} 
                            onNavigate={handleNavigation}
                            error={error}
                            targetLanguage={targetLanguage}
                            onLanguageChange={setTargetLanguage}
                            challengeWords={challengeWords}
                            isLoadingWords={isLoadingWords}
                            proficiencyLevel={proficiencyLevel}
                            userName={userName || 'Guest'}
                        />;
        }
    };

    return (
        <div className="bg-lingo-card-bg max-w-sm mx-auto h-dvh flex flex-col font-sans shadow-2xl sm:rounded-xl sm:my-8 sm:h-[90vh] sm:overflow-hidden">
            {renderScreen()}
        </div>
    );
};

export default App;
