import { Search, Bell, ChevronRight } from 'lucide-react';
import { Header, ExpandableHeader, DayAgendaRow } from '../components/Shared';
import { PushedScreenState } from '../types';

export function Dashboard({ onPush }: { onPush: (screen: PushedScreenState) => void }) {
  const avatarUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={() => onPush('settings')} className="w-11 h-11 rounded-full overflow-hidden bg-surface-neutral">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </button>
        }
        title={<span className="text-[17px] font-medium text-tx-primary">Hi, John</span>}
        rightIcon={
          <div className="flex items-center bg-surface-neutral rounded-full h-11 p-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-canvas shadow-sm text-tx-primary">
              <Search size={18} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-tx-primary">
              <Bell size={18} />
            </button>
          </div>
        }
      />
      
      <div className="px-5 mt-2">
        <h2 className="text-[26px] font-semibold text-tx-primary mb-4">Your Dashboard</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">36 Tasks</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">09 New Leads</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">16 Today's Tasks</div>
        </div>

        <ExpandableHeader label="Payment Summary" onExpand={() => onPush('finance')} />
        
        <button onClick={() => onPush('finance')} className="w-full mt-2 mb-6 bg-surface-neutral rounded-[24px] p-5 text-left active:opacity-80 transition-opacity">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="text-[40px] font-light text-tx-primary leading-none tracking-tight">$56k</div>
              <div className="text-[14px] text-tx-muted mt-2">May gross payment</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center">
              <ChevronRight size={20} className="text-tx-primary" />
            </div>
          </div>
          
          <div className="flex gap-4 text-[12px] font-medium text-tx-muted">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-tx-primary"></div>Paid</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-warm"></div>Upcoming</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-primary"></div>Overdue</div>
          </div>
          
          <div className="mt-6 flex items-end justify-between h-20 gap-1.5">
            <div className="flex-1 bg-canvas rounded-sm h-[40%]" />
            <div className="flex-1 bg-tx-primary rounded-sm h-[75%]" />
            <div className="flex-1 bg-accent-primary rounded-sm h-[100%]" />
            <div className="flex-1 bg-canvas rounded-sm h-[50%]" />
            <div className="flex-1 bg-accent-warm rounded-sm h-[30%]" />
            <div className="flex-1 bg-surface-muted rounded-sm h-[60%]" />
          </div>
        </button>

        <ExpandableHeader label="Monthly Tasks" onExpand={() => onPush('calendar')} />
      </div>

      <div className="mt-2" onClick={() => onPush('calendar')}>
        <DayAgendaRow
          date="16 May"
          weekday="Friday"
          events={[
            { time: '9 AM', label: 'Gym Session' },
            { time: '6 PM', label: 'Design' }
          ]}
        />
        <DayAgendaRow
          date="17 May"
          weekday="Saturday"
          events={[
            { time: '8 AM', label: 'Playing Cricket' },
            { time: '10 AM', label: 'Design' }
          ]}
        />
      </div>
    </div>
  );
}
