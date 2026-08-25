import { Search, Bell, ChevronRight } from 'lucide-react';
import { Header, ExpandableHeader, DayAgendaRow } from '../components/Shared';
import { PushedScreenState } from '../types';
import { useTasks } from '../context/TasksContext';
import { useRevenue } from '../context/RevenueContext';
import { useCalendar } from '../context/CalendarContext';

export function Dashboard({ onPush }: { onPush: (screen: PushedScreenState) => void }) {
  const avatarUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";
  
  const { tasks } = useTasks();
  const { revenues } = useRevenue();
  const { events } = useCalendar();

  // Tasks Summary
  const totalTasks = tasks.length;
  // Let's pretend today is defined as current date
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date && t.date.startsWith(todayDateStr)).length;
  
  // Finance Summary
  // Let's get total revenue for this month (using current month as example)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let thisMonthRevenue = 0;
  
  revenues.forEach(r => {
    const d = new Date(r.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status === 'Paid') {
      thisMonthRevenue += r.amount;
    }
  });

  const monthName = new Date().toLocaleString('default', { month: 'short' });

  // Calendar summary - just get next 2 days with events
  const eventsByDate = new Map<string, typeof events>();
  events.forEach(e => {
    const arr = eventsByDate.get(e.date) || [];
    arr.push(e);
    eventsByDate.set(e.date, arr);
  });
  
  const sortedDates = Array.from(eventsByDate.keys()).sort().filter(d => d >= todayDateStr).slice(0, 2);

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
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">{totalTasks} Tasks</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">09 New Leads</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">{todaysTasks} Today's Tasks</div>
        </div>

        <ExpandableHeader label="Payment Summary" onExpand={() => onPush('finance')} />
        
        <button onClick={() => onPush('finance')} className="w-full mt-2 mb-6 bg-surface-neutral rounded-[24px] p-5 text-left active:opacity-80 transition-opacity">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="text-[40px] font-light text-tx-primary leading-none tracking-tight">${thisMonthRevenue >= 1000 ? (thisMonthRevenue/1000).toFixed(1) + 'k' : thisMonthRevenue}</div>
              <div className="text-[14px] text-tx-muted mt-2">{monthName} gross payment</div>
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
        {sortedDates.map(date => {
          const dateEvents = eventsByDate.get(date)!;
          const dateObj = new Date(date + 'T00:00:00');
          const dateDisplay = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
          
          return (
            <DayAgendaRow
              key={date}
              date={dateDisplay}
              weekday={weekday}
              events={dateEvents.map(e => ({ 
                time: e.allDay ? 'All Day' : e.time || '', 
                label: e.title 
              }))}
            />
          );
        })}
        {sortedDates.length === 0 && (
          <div className="text-center text-tx-muted py-8 text-[15px]">No upcoming events.</div>
        )}
      </div>
    </div>
  );
}
