import { LayoutDashboard, FolderKanban, Wrench, Users } from 'lucide-react';
import { TabState } from '../types';

export function Navigation({
  activeTab,
  onChange,
}: {
  activeTab: TabState;
  onChange: (tab: TabState) => void;
}) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'projects', icon: FolderKanban },
    { id: 'tools', icon: Wrench },
    { id: 'clients', icon: Users },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-canvas border-t border-bd-subtle pb-6 pt-2 px-6 flex items-center justify-between z-40">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as TabState)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-colors relative"
          >
            <div
              className={`absolute inset-0 rounded-full transition-opacity ${
                isActive ? 'bg-accent-primary opacity-100' : 'opacity-0'
              }`}
            />
            <Icon size={24} className={`relative z-10 transition-colors ${isActive ? 'text-tx-primary' : 'text-tx-muted'}`} />
          </button>
        );
      })}
    </nav>
  );
}
