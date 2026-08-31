import { useState } from 'react';
import { Search, MoreVertical, Calendar, Clock, CheckSquare, Users, DollarSign } from 'lucide-react';
import { Header, TabPill, ListRow } from '../components/Shared';
import { PushedScreenState } from '../types';
import { useNavigation } from '../context/NavigationContext';

export function Tools({ onPush }: { onPush: (screen: PushedScreenState) => void }) {
  const [tab, setTab] = useState('Productivity');
  const { goToTab } = useNavigation();

  const productivityTools = [
    { icon: <Calendar size={20} className="text-tx-primary" />, title: 'Calendar', action: () => onPush('calendar') },
    { icon: <CheckSquare size={20} className="text-tx-primary" />, title: 'All Tasks', action: () => onPush('tasks') },
    { icon: <Clock size={20} className="text-tx-primary" />, title: 'Time Tracker', action: () => onPush('time-tracker') },
    { icon: <Users size={20} className="text-tx-primary" />, title: 'Clients', action: () => goToTab('clients') },
  ];

  const financeTools = [
    { icon: <DollarSign size={20} className="text-tx-primary" />, title: 'Finance Overview', action: () => onPush('finance') },
  ];

  const currentTools = tab === 'Productivity' ? productivityTools : financeTools;

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary" aria-label="Search tools">
            <Search size={20} />
          </button>
        }
        title="Tools"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary" aria-label="More options">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="mt-2 mb-6">
        <TabPill options={['Productivity', 'Finance']} active={tab} onChange={setTab} />
      </div>

      <div className="px-5">
        {currentTools.map((tool, idx) => (
          <ListRow 
            key={idx}
            icon={<div className="w-10 h-10 rounded-full bg-surface-neutral flex items-center justify-center">{tool.icon}</div>}
            title={tool.title}
            onClick={tool.action}
          />
        ))}
      </div>
    </div>
  );
}
