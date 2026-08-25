import { useState } from 'react';
import { TabState, PushedScreenState } from './types';
import { Navigation } from './components/Navigation';
import { PreferencesProvider } from './context/PreferencesContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataProvider';

import { Dashboard } from './screens/Dashboard';
import { Projects } from './screens/Projects';
import { Tools } from './screens/Tools';
import { Messages } from './screens/Messages';

import { Tasks } from './screens/Tasks';
import { Calendar } from './screens/Calendar';
import { Finance } from './screens/Finance';
import { TimeTracker } from './screens/TimeTracker';
import { Settings } from './screens/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabState>('dashboard');
  const [pushedScreen, setPushedScreen] = useState<PushedScreenState>('none');

  const handlePush = (screen: PushedScreenState) => setPushedScreen(screen);
  const handleDismiss = () => setPushedScreen('none');

  return (
    <PreferencesProvider>
      <DataProvider>
        <ToastProvider>
          <div className="relative w-full h-[100dvh] bg-canvas overflow-hidden max-w-[430px] mx-auto sm:border-x sm:border-bd-subtle shadow-2xl">
            {/* Main Tabs Container */}
            <div className="w-full h-full relative z-0">
              <div className={activeTab === 'dashboard' ? 'block h-full' : 'hidden'}><Dashboard onPush={handlePush} /></div>
              <div className={activeTab === 'projects' ? 'block h-full' : 'hidden'}><Projects /></div>
              <div className={activeTab === 'tools' ? 'block h-full' : 'hidden'}><Tools onPush={handlePush} /></div>
              <div className={activeTab === 'messages' ? 'block h-full' : 'hidden'}><Messages /></div>
            </div>

            <Navigation activeTab={activeTab} onChange={setActiveTab} />

            {/* Pushed Screens */}
            {pushedScreen === 'tasks' && <Tasks onDismiss={handleDismiss} />}
            {pushedScreen === 'calendar' && <Calendar onDismiss={handleDismiss} />}
            {pushedScreen === 'finance' && <Finance onDismiss={handleDismiss} />}
            {pushedScreen === 'time-tracker' && <TimeTracker onDismiss={handleDismiss} />}
            {pushedScreen === 'settings' && <Settings onDismiss={handleDismiss} />}
          </div>
        </ToastProvider>
      </DataProvider>
    </PreferencesProvider>
  );
}


