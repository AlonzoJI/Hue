import React, { useState, useCallback, useEffect } from 'react';
import { Screen, AIFeedback, Recording, ProficiencyLevel } from './types';
import PromptScreen from './components/PromptScreen';
import RecordingScreen from './components/RecordingScreen';
import LoadingScreen from './components/LoadingScreen';
import FeedbackScreen from './components/FeedbackScreen';
import CompletionScreen from './components/CompletionScreen';
import DashboardScreen from './components/DashboardScreen';
import ProfileScreen from './components/ProfileScreen';
import { evaluateSpeech, getChallengeWords } from './services/geminiService';

const PROMPTS = [
    "Describe your perfect weekend getaway.",
    "What is your favorite food and why? Describe how to make it.",
    "Talk about a movie you recently watched and whether you would recommend it.",
    "Describe your dream vacation.",
    "What are your career goals for the next five years?"
];

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>(Screen.Prompt);
    const [currentPrompt] = useState<string>(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    const [feedback, setFeedback] = useState<AIFeedback | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [pastRecordings, setPastRecordings] = useState<Recording[]>(() => {
        const saved = localStorage.getItem('lingo-recordings');
        return saved ? JSON.parse(saved) : [];
    });
    const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(() => {
        return (localStorage.getItem('lingo-proficiency') as ProficiencyLevel) || 'Beginner';
    });
    
    const [targetLanguage, setTargetLanguage] = useState<string>('English');
    const [challengeWords, setChallengeWords] = useState<string[]>([]);
    const [isLoadingWords, setIsLoadingWords] = useState<boolean>(true);

    useEffect(() => {
        localStorage.setItem('lingo-recordings', JSON.stringify(pastRecordings));
    }, [pastRecordings]);

    useEffect(() => {
        localStorage.setItem('lingo-proficiency', proficiencyLevel);
        // Refetch words when proficiency changes
        fetchWords();
    }, [proficiencyLevel]);

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

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

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
            const result = await evaluateSpeech(audioBlob, targetLanguage, proficiencyLevel, currentPrompt, challengeWords);
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
                setPastRecordings(prev => [newRecording, ...prev]);

                setScreen(Screen.Feedback);
            } else {
                // This case should be less likely with the more robust service
                throw new Error("AI evaluation returned an incomplete format.");
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to evaluate audio. Error: ${errorMessage}`);
            setScreen(Screen.Prompt);
        }
    }, [currentPrompt, targetLanguage, proficiencyLevel, challengeWords]);
    
    const handleNavigation = (targetScreen: Screen) => {
        setError(null);
        // Only clear session state when returning to the prompt screen
        if (targetScreen === Screen.Prompt) {
            setFeedback(null);
            setTranscription('');
        }
        setScreen(targetScreen);
    };

    const renderScreen = () => {
        switch (screen) {
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
                        />;
        }
    };

    return (
        <div className="bg-lingo-card-bg max-w-sm mx-auto h-dvh flex flex-col font-sans">
            {renderScreen()}
        </div>
    );
};

export default App;