import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import type { Task, TimeSession } from '../lib/database.types';

interface TimerProps {
  task: Task | null;
  activeSession: TimeSession | null;
  onStart: (taskId: string) => void;
  onPause: () => void;
  onStop: (duration: number) => void;
}

export default function Timer({ task, activeSession, onStart, onPause, onStop }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeSession && !activeSession.end_time) {
      const startTime = new Date(activeSession.start_time).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
      setIsRunning(true);
    } else {
      setElapsedTime(0);
      setIsRunning(false);
    }
  }, [activeSession]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (task) {
      onStart(task.id);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause();
  };

  const handleStop = () => {
    setIsRunning(false);
    onStop(elapsedTime);
    setElapsedTime(0);
  };

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-6">
        <div className="text-center text-gray-400">
          <p className="text-sm">No task selected</p>
          <p className="text-xs mt-1">Start a timer from a task card</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-blue-100 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
        <p className="text-xs text-gray-500">
          {task.category} • {task.priority} Priority
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-900 mb-2 font-mono">
          {formatTime(elapsedTime)}
        </div>
        <div className="text-sm text-gray-500">
          Estimated: {task.estimated_duration} minutes
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <Pause size={20} />
              Pause
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Square size={20} />
              Stop
            </button>
          </>
        )}
      </div>

      {elapsedTime > task.estimated_duration * 60 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            Time exceeded estimated duration by {Math.floor((elapsedTime - task.estimated_duration * 60) / 60)} minutes
          </p>
        </div>
      )}
    </div>
  );
}
