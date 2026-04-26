
import React, { useMemo } from 'react';
import Header from './Header';
import ProficiencySelector from './ProficiencySelector';
import { ProficiencyLevel, Recording } from '../types';
import { clearAllRecordingsFromDB } from '../services/db';

interface ProfileScreenProps {
  proficiency: ProficiencyLevel;
  setProficiency: (level: ProficiencyLevel) => void;
  onBack: () => void;
  recordings: Recording[];
  setRecordings: (recordings: Recording[]) => void; 
  userName: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ proficiency, setProficiency, onBack, recordings, setRecordings, userName }) => {

  const totalSessions = recordings.length;
  
  const totalXp = useMemo(() => recordings.reduce((acc, rec) => {
      const base = Math.round(rec.feedback.overallScore);
      const bonus = rec.feedback.challengeWordsUsed.filter(w => w.used).length * 5;
      return acc + base + bonus;
  }, 0), [recordings]);

  const dailyStreak = useMemo(() => {
    if (recordings.length === 0) return 0;

    // Get unique dates (midnight timestamp)
    const sortedDates = [...new Set(recordings.map(r => {
        const d = new Date(r.id);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }))].sort((a, b) => b - a);

    if (sortedDates.length === 0) return 0;

    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const yesterdayTime = todayTime - 86400000;

    let streak = 0;
    let currentCheck = todayTime;

    // If no recording today, check if there was one yesterday to keep streak alive.
    // If neither, streak is broken (0), unless the most recent one IS today.
    if (!sortedDates.includes(todayTime)) {
        if (sortedDates.includes(yesterdayTime)) {
            currentCheck = yesterdayTime;
        } else {
            return 0;
        }
    }

    // Count backwards
    while (sortedDates.includes(currentCheck)) {
        streak++;
        currentCheck -= 86400000; // Subtract one day in milliseconds
    }

    return streak;
  }, [recordings]);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to delete all your practice history? This action cannot be undone.")) {
        await clearAllRecordingsFromDB();
        setRecordings([]);
    }
  }

  return (
    <div className="flex flex-col h-full bg-hue-bg">
      <Header title="My Profile" onBack={onBack} />
      <div className="flex-grow flex flex-col p-6 overflow-y-auto">
        
        <div className="mb-8">
             <h1 className="text-3xl font-bold text-hue-text">{userName}</h1>
             <p className="text-hue-text-secondary mt-1">Keep up the great work!</p>
        </div>

        <div className="mb-8">
            <h2 className="text-sm font-bold text-hue-text-secondary uppercase tracking-wider mb-2">My Level</h2>
            <ProficiencySelector selectedLevel={proficiency} onLevelChange={setProficiency} />
        </div>

        <div className="mb-8">
            <h2 className="text-sm font-bold text-hue-text-secondary uppercase tracking-wider mb-2">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-border-gray text-center flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-hue-red mb-1">🔥 {dailyStreak}</p>
                    <p className="text-xs font-bold text-hue-text-secondary uppercase tracking-wider">Day Streak</p>
                </div>
                 <div className="bg-white p-4 rounded-xl border border-border-gray text-center flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-accent-xp mb-1">⭐ {totalXp}</p>
                    <p className="text-xs font-bold text-hue-text-secondary uppercase tracking-wider">Total XP</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-border-gray text-center col-span-2 flex items-center justify-between px-8">
                    <span className="text-sm font-bold text-hue-text-secondary uppercase tracking-wider">Total Sessions</span>
                    <span className="text-2xl font-bold text-hue-blue">{totalSessions}</span>
                </div>
            </div>
        </div>

        <div className="flex-grow"></div>

        <div>
             <h2 className="text-sm font-bold text-hue-text-secondary uppercase tracking-wider mb-2">Account</h2>
            <button
                onClick={handleClearHistory}
                className="w-full text-center py-3 px-4 text-hue-red bg-hue-red/10 rounded-xl hover:bg-hue-red/20 transition-colors font-semibold"
            >
                Clear Practice History
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;
