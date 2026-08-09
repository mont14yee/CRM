import { useState } from 'react';
import { Search, MoreVertical, Calendar, Clock, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { Header, TabPill, ListRow } from '../components/Shared';
import { PushedScreenState } from '../types';

export function Tools({ onPush }: { onPush: (screen: PushedScreenState) => void }) {
  const [tab, setTab] = useState('Productivity');

  const tools = [
    { icon: <Calendar size={20} className="text-tx-primary" />, title: 'Calendar', action: () => onPush('calendar') },
    { icon: <Clock size={20} className="text-tx-primary" />, title: 'Scheduler', action: () => {} },
    { icon: <Layers size={20} className="text-tx-primary" />, title: 'My Templates', action: () => {} },
    { icon: <BookOpen size={20} className="text-tx-primary" />, title: 'My Library', action: () => {} },
    { icon: <Clock size={20} className="text-tx-primary" />, title: 'Time Tracker', action: () => onPush('time-tracker') },
    { icon: <CheckSquare size={20} className="text-tx-primary" />, title: 'All Tasks', action: () => onPush('tasks') },
  ];

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <Search size={20} />
          </button>
        }
        title="Tools"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="mt-2 mb-6">
        <TabPill options={['Productivity', 'Finance']} active={tab} onChange={setTab} />
      </div>

      <div className="px-5">
        {tools.map((tool, idx) => (
          <ListRow 
            key={idx}
            icon={<div className="w-10 h-10 rounded-full bg-surface-neutral flex items-center justify-center">{tool.icon}</div>}
            title={tool.title}
            onClick={tool.action}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="px-6 py-2.5 rounded-full bg-surface-neutral text-[14px] font-medium text-tx-primary">
          See More
        </button>
      </div>
    </div>
  );
}
