import React, { useEffect } from 'react';
import Header from './Header';
import { useRecorder } from '../hooks/useRecorder';

interface RecordingScreenProps {
  prompt: string;
  challengeWords: string[];
  onRecordingComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const RecordingScreen: React.FC<RecordingScreenProps> = ({ prompt, challengeWords, onRecordingComplete, onCancel }) => {
  const { isRecording, startRecording, stopRecording, error, volume } = useRecorder({ onRecordingComplete });

  useEffect(() => {
    startRecording();
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = () => {
    if (isRecording) {
      stopRecording();
    }
  };
  
  const handleCancel = () => {
    stopRecording();
    onCancel();
  };

  const ringStyle = {
    transform: `scale(${1 + volume * 1.2})`,
    opacity: 0.2 + volume * 0.5,
  };

  return (
    <div className="flex flex-col h-full bg-hue-bg">
      <Header title="Recording..." onBack={handleCancel} />
      <div className="flex-grow flex flex-col items-center justify-between p-6">
        <div>
            <p className="text-xl text-hue-text text-center mt-8 font-serif">{prompt}</p>
            <div className="mt-4">
                <p className="text-center text-sm text-accent-challenge font-bold uppercase tracking-wider">Try using</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {challengeWords.map(word => (
                        <span key={word} className="bg-accent-challenge/10 text-accent-challenge font-semibold px-3 py-1 rounded-full text-sm">
                            {word}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="relative w-28 h-28 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-hue-red/30 transition-transform duration-100 ease-out"
            style={ringStyle}
            aria-hidden="true"
          ></div>
          <button
            onClick={handleStop}
            className="relative w-24 h-24 bg-hue-red rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-red-700 transition-colors"
            aria-label="Stop recording"
          >
            <div className="w-8 h-8 bg-white rounded-md"></div>
          </button>
        </div>

        <div>
          {error && <p className="text-hue-red text-center mb-4">{error}</p>}
          <p className="text-hue-text-secondary text-center mb-8">Tap button to stop recording</p>
        </div>
      </div>
    </div>
  );
};

export default RecordingScreen;