import { useState, useMemo } from 'react';
import { Search, Bell, ChevronRight, X, Briefcase, Users, Calendar, AlertCircle } from 'lucide-react';
import { Header, ExpandableHeader, DayAgendaRow } from '../components/Shared';
import { PushedScreenState } from '../types';
import { useTasks } from '../context/TasksContext';
import { useRevenue } from '../context/RevenueContext';
import { useCalendar } from '../context/CalendarContext';
import { useProfile } from '../context/ProfileContext';
import { usePreferences } from '../context/PreferencesContext';
import { useClients } from '../context/ClientsContext';
import { useProjects } from '../context/ProjectsContext';
import { formatCurrencyCompact, formatCurrency } from '../utils/currency';
import { getRecentMonths, getTodayDateStr } from '../utils/date';
import { useNavigation } from '../context/NavigationContext';

export function Dashboard({ onPush }: { onPush: (screen: PushedScreenState) => void }) {
  const { profile } = useProfile();
  const { name, avatarSeed } = profile;
  const { preferences } = usePreferences();
  const { tasks } = useTasks();
  const { revenues } = useRevenue();
  const { events } = useCalendar();
  const { clients } = useClients();
  const { projects } = useProjects();
  const { goToTab, goToClient } = useNavigation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { clients: [], projects: [], tasks: [] };
    const q = searchQuery.toLowerCase();
    return {
      clients: clients.filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)),
      projects: projects.filter(p => p.name.toLowerCase().includes(q)),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q)),
    };
  }, [searchQuery, clients, projects, tasks]);

  // Notifications
  const todayDateStr = getTodayDateStr();
  const notifications = useMemo(() => {
    const notifs = [];
    
    // Tasks due today
    tasks.filter(t => t.date && t.date.startsWith(todayDateStr) && t.status !== 'done').forEach(t => {
      notifs.push({ id: `ts-${t.id}`, type: 'task', title: 'Task Due Today', subtitle: t.title });
    });

    // Today's events
    events.filter(e => e.date === todayDateStr).forEach(e => {
      notifs.push({ id: `ev-${e.id}`, type: 'event', title: 'Event Today', subtitle: `${e.time || 'All Day'} - ${e.title}` });
    });

    // Overdue or soon-overdue invoices
    revenues.filter(r => r.status === 'Overdue' || (r.status === 'Pending' && r.date && r.date <= todayDateStr)).forEach(r => {
      notifs.push({ 
        id: `rev-${r.id}`, 
        type: 'revenue', 
        title: r.status === 'Overdue' ? 'Overdue Invoice' : 'Invoice Due Soon', 
        subtitle: `${r.clientOrProject || 'General'} - ${formatCurrency(r.amount, preferences.currency)}` 
      });
    });

    return notifs;
  }, [events, tasks, revenues, todayDateStr, preferences.currency]);

  // Tasks Summary
  const totalTasks = tasks.length;
  const todaysTasks = tasks.filter(t => t.date && t.date.startsWith(todayDateStr)).length;
  
  // Leads
  const newLeads = clients.filter(c => c.status === 'lead').length;
  const formattedLeads = newLeads.toString();

  // Finance Summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let thisMonthRevenue = 0;
  
  revenues.forEach(r => {
    if (!r.date) return;
    const [y, mStr] = r.date.split('-');
    if (parseInt(mStr, 10) - 1 === currentMonth && parseInt(y, 10) === currentYear && r.status === 'Paid') {
      thisMonthRevenue += r.amount;
    }
  });

  const monthName = new Date().toLocaleString('default', { month: 'short' });

  // Calculate chart data (last 6 months)
  const recent6Months = getRecentMonths(6);
  const chartData = recent6Months.map(m => {
    let total = 0;
    revenues.forEach(r => {
      if (!r.date) return;
      const [y, mStr] = r.date.split('-');
      if (parseInt(mStr, 10) - 1 === m.month && parseInt(y, 10) === m.year && r.status === 'Paid') {
        total += r.amount;
      }
    });
    return total;
  });

  const maxChartValue = Math.max(...chartData, 1);

  // Calendar summary - just get next 2 days with events
  const eventsByDate = new Map<string, typeof events>();
  events.forEach(e => {
    const arr = eventsByDate.get(e.date) || [];
    arr.push(e);
    eventsByDate.set(e.date, arr);
  });
  
  const sortedDates = Array.from(eventsByDate.keys()).sort().filter(d => d >= todayDateStr).slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar relative">
      <Header
        leftIcon={
          <button onClick={() => onPush('settings')} className="w-11 h-11 rounded-full overflow-hidden bg-surface-neutral" aria-label="Settings">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt="Avatar" className="w-full h-full object-cover" />
          </button>
        }
        title={<span className="text-[17px] font-medium text-tx-primary">Hi, {name.split(' ')[0]}</span>}
        rightIcon={
          <div className="flex items-center bg-surface-neutral rounded-full h-11 p-1">
            <button onClick={() => setIsSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-canvas shadow-sm text-tx-primary" aria-label="Search">
              <Search size={18} />
            </button>
            <button onClick={() => setIsNotificationsOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full text-tx-primary relative" aria-label="Notifications">
              <Bell size={18} />
              {notifications.length > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-neutral" />
              )}
            </button>
          </div>
        }
      />
      
      <div className="px-5 mt-2">
        <h2 className="text-[26px] font-semibold text-tx-primary mb-4">Your Dashboard</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">{totalTasks} Tasks</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">{formattedLeads} New Leads</div>
          <div className="px-4 py-2 bg-surface-neutral rounded-full text-[14px] font-medium text-tx-primary">{todaysTasks} Today's Tasks</div>
        </div>

        <ExpandableHeader label="Payment Summary" onExpand={() => onPush('finance')} />
        
        <button onClick={() => onPush('finance')} className="w-full mt-2 mb-6 bg-surface-neutral rounded-[24px] p-5 text-left active:opacity-80 transition-opacity">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="text-[40px] font-light text-tx-primary leading-none tracking-tight">{formatCurrencyCompact(thisMonthRevenue, preferences.currency)}</div>
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
            {chartData.map((val, i) => {
              const heightPct = Math.max((val / maxChartValue) * 100, 4);
              const isCurrent = i === chartData.length - 1;
              return (
                <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ease-out ${isCurrent ? 'bg-tx-primary' : 'bg-canvas'}`} style={{ height: `${heightPct}%` }} />
              );
            })}
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

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-[100] bg-canvas flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center px-5 py-4 gap-3 border-b border-bd-subtle">
            <div className="flex-1 flex items-center bg-surface-neutral rounded-full px-4 h-11">
              <Search size={18} className="text-tx-muted mr-2" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search clients, projects, tasks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-tx-primary"
              />
            </div>
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-[15px] font-medium text-tx-primary px-2 active:opacity-70">
              Cancel
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!searchQuery.trim() ? (
              <div className="text-center text-tx-muted mt-10 text-[14px]">Type to start searching...</div>
            ) : (
              <>
                {searchResults.clients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">Clients</h3>
                    <div className="flex flex-col gap-2">
                      {searchResults.clients.map(c => (
                        <div key={c.id} onClick={() => { setIsSearchOpen(false); goToClient(c.id); }} className="flex items-center gap-3 p-3 rounded-xl bg-surface-neutral active:opacity-80">
                          <Users size={18} className="text-tx-muted" />
                          <div>
                            <div className="text-[15px] font-medium text-tx-primary">{c.name}</div>
                            {c.company && <div className="text-[12px] text-tx-muted">{c.company}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResults.projects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">Projects</h3>
                    <div className="flex flex-col gap-2">
                      {searchResults.projects.map(p => (
                        <div key={p.id} onClick={() => { setIsSearchOpen(false); goToTab('projects'); }} className="flex items-center gap-3 p-3 rounded-xl bg-surface-neutral active:opacity-80">
                          <Briefcase size={18} className="text-tx-muted" />
                          <div className="text-[15px] font-medium text-tx-primary">{p.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResults.tasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">Tasks</h3>
                    <div className="flex flex-col gap-2">
                      {searchResults.tasks.map(t => (
                        <div key={t.id} onClick={() => { setIsSearchOpen(false); onPush('tasks' as any); }} className="flex items-center gap-3 p-3 rounded-xl bg-surface-neutral active:opacity-80">
                          <div className="w-4 h-4 rounded-full border-2 border-tx-muted" />
                          <div className="text-[15px] font-medium text-tx-primary">{t.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.clients.length === 0 && searchResults.projects.length === 0 && searchResults.tasks.length === 0 && (
                  <div className="text-center text-tx-muted mt-10 text-[14px]">No results found.</div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Notifications Overlay */}
      {isNotificationsOpen && (
        <div className="absolute inset-0 z-[100] bg-canvas flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Header
            leftIcon={
              <button onClick={() => setIsNotificationsOpen(false)} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary active:opacity-80" aria-label="Close notifications">
                <X size={20} />
              </button>
            }
            title={<span className="text-[17px] font-medium text-tx-primary">Notifications</span>}
          />
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {notifications.length === 0 ? (
              <div className="text-center text-tx-muted mt-10 text-[14px]">You're all caught up!</div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-4 p-4 rounded-2xl bg-surface-neutral">
                    <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center shrink-0">
                      {n.type === 'task' && <div className="w-4 h-4 rounded-full border-2 border-tx-primary" />}
                      {n.type === 'event' && <Calendar size={18} className="text-tx-primary" />}
                      {n.type === 'revenue' && <AlertCircle size={18} className="text-red-500" />}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[15px] font-medium text-tx-primary">{n.title}</div>
                      <div className="text-[13px] text-tx-muted mt-0.5">{n.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
