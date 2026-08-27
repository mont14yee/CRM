import React, { createContext, useContext, ReactNode } from 'react';
import { TimeEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils';

interface TimeTrackerContextType {
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  
  // Timer State
  timerState: 'idle' | 'running' | 'paused';
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  
  timerStartedAt: string | null;
  elapsedSeconds: number; // dynamically computed
  
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  activeNote: string;
  setActiveNote: (note: string) => void;
  activeBillable: boolean;
  setActiveBillable: (billable: boolean) => void;
}

const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined);

export function TimeTrackerProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('conneq-time-entries', []);
  const [timerState, setTimerState] = useLocalStorage<'idle' | 'running' | 'paused'>('conneq-timer-state', 'idle');
  const [timerStartedAt, setTimerStartedAt] = useLocalStorage<string | null>('conneq-timer-started-at', null);
  const [timerResumedAt, setTimerResumedAt] = useLocalStorage<number | null>('conneq-timer-resumed-at', null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useLocalStorage<number>('conneq-timer-accumulated', 0);
  
  const [activeProjectId, setActiveProjectId] = useLocalStorage<string>('conneq-timer-project', '');
  const [activeNote, setActiveNote] = useLocalStorage<string>('conneq-timer-note', '');
  const [activeBillable, setActiveBillable] = useLocalStorage<boolean>('conneq-timer-billable', true);

  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (timerState === 'running') {
      const interval = setInterval(() => setTick(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerState]);

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = { ...entry, id: generateId() };
    setTimeEntries((prev) => [...prev, newEntry]);
  };

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const startTimer = () => {
    const now = Date.now();
    if (timerState === 'idle') {
      setTimerStartedAt(new Date(now).toISOString());
      setAccumulatedSeconds(0);
    }
    setTimerResumedAt(now);
    setTimerState('running');
  };

  const pauseTimer = () => {
    if (timerState === 'running' && timerResumedAt) {
      const now = Date.now();
      setAccumulatedSeconds(prev => prev + Math.floor((now - timerResumedAt) / 1000));
      setTimerResumedAt(null);
    }
    setTimerState('paused');
  };

  const stopTimer = () => {
    pauseTimer(); // this updates accumulatedSeconds safely
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimerStartedAt(null);
    setTimerResumedAt(null);
    setAccumulatedSeconds(0);
    setActiveProjectId('');
    setActiveNote('');
    setActiveBillable(true);
  };

  let elapsedSeconds = accumulatedSeconds;
  if (timerState === 'running' && timerResumedAt) {
    elapsedSeconds += Math.floor((Date.now() - timerResumedAt) / 1000);
  }

  return (
    <TimeTrackerContext.Provider value={{ 
      timeEntries, addTimeEntry, updateTimeEntry, deleteTimeEntry,
      timerState, startTimer, pauseTimer, stopTimer, resetTimer,
      timerStartedAt, elapsedSeconds,
      activeProjectId, setActiveProjectId,
      activeNote, setActiveNote,
      activeBillable, setActiveBillable
    }}>
      {children}
    </TimeTrackerContext.Provider>
  );
}

export function useTimeTracker() {
  const context = useContext(TimeTrackerContext);
  if (!context) {
    throw new Error('useTimeTracker must be used within a TimeTrackerProvider');
  }
  return context;
}
