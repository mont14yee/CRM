import { Navigation } from './components/Navigation';
import { PreferencesProvider } from './context/PreferencesContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataProvider';
import { useNavigation } from './context/NavigationContext';

import { Dashboard } from './screens/Dashboard';
import { Projects } from './screens/Projects';
import { Tools } from './screens/Tools';
import { Clients } from './screens/Clients';

import { Tasks } from './screens/Tasks';
import { Calendar } from './screens/Calendar';
import { Finance } from './screens/Finance';
import { TimeTracker } from './screens/TimeTracker';
import { Settings } from './screens/Settings';

function MainApp() {
  const { activeTab, pushedScreen, push, dismiss, goToTab, navigationOptions } = useNavigation();

  return (
    <div className="relative w-full h-[100dvh] bg-canvas overflow-hidden max-w-[430px] mx-auto sm:border-x sm:border-bd-subtle shadow-2xl">
      {/* Main Tabs Container */}
      <div className="w-full h-full relative z-0">
        <div className={activeTab === 'dashboard' ? 'block h-full' : 'hidden'}><Dashboard onPush={push} /></div>
        <div className={activeTab === 'projects' ? 'block h-full' : 'hidden'}><Projects /></div>
        <div className={activeTab === 'tools' ? 'block h-full' : 'hidden'}><Tools onPush={push} /></div>
        <div className={activeTab === 'clients' ? 'block h-full' : 'hidden'}><Clients initialClientId={navigationOptions?.clientId} /></div>
      </div>

      <Navigation activeTab={activeTab} onChange={(tab) => goToTab(tab)} />

      {/* Pushed Screens */}
      {pushedScreen === 'tasks' && <Tasks onDismiss={dismiss} />}
      {pushedScreen === 'calendar' && <Calendar onDismiss={dismiss} />}
      {pushedScreen === 'finance' && <Finance onDismiss={dismiss} />}
      {pushedScreen === 'time-tracker' && <TimeTracker onDismiss={dismiss} />}
      {pushedScreen === 'settings' && <Settings onDismiss={dismiss} />}
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <DataProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </DataProvider>
    </PreferencesProvider>
  );
}


