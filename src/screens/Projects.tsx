import { Search, MoreVertical, Plus } from 'lucide-react';
import { Header, ProgressBar } from '../components/Shared';
import { ProjectItem } from '../types';

export function Projects() {
  const projects: ProjectItem[] = [
    { id: '1', index: '09', name: 'Dribbble Project', priority: 'high', completionPct: 75, tone: 'lime' },
    { id: '2', index: '06', name: 'Panze Portfolio', priority: 'low', completionPct: 40, tone: 'olive' },
    { id: '3', index: '03', name: 'Netflix Portfolio', priority: 'high', completionPct: 90, tone: 'neutral' },
  ];

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <Search size={20} />
          </button>
        }
        title="Projects"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="px-5 mt-4 flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-medium text-tx-primary">Recent Activity</h2>
        <button className="w-10 h-10 rounded-full bg-tx-primary text-tx-inverse flex items-center justify-center">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-surface-neutral rounded-[24px] p-5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/150?u=${proj.id}`} alt="client" className="w-10 h-10 rounded-full object-cover bg-canvas" />
                <div className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
                  proj.priority === 'high' ? 'bg-canvas text-tx-primary' : 'bg-canvas/50 text-tx-muted'
                }`}>
                  {proj.priority === 'high' ? 'High Priority' : 'Low Priority'}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-canvas text-tx-primary text-[12px] font-medium">
                Completed {proj.completionPct}%
              </div>
            </div>
            
            <div className="flex items-end gap-4 mb-5">
              <div className="text-[48px] font-light text-tx-muted leading-none tracking-tighter">
                {proj.index}
              </div>
              <div className="text-[20px] font-medium text-tx-primary leading-tight pb-1">
                {proj.name}
              </div>
            </div>

            <ProgressBar progress={proj.completionPct} tone={proj.tone} />
          </div>
        ))}
      </div>
    </div>
  );
}
