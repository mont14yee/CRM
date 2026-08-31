import { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Header, DayAgendaRow } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';
import { useCalendar } from '../context/CalendarContext';
import { useClients } from '../context/ClientsContext';
import { EventItem } from '../types';
import { getMonthGrid, formatMonthYear, getTodayDateStr } from '../utils/date';
import { SearchPicker } from '../components/SearchPicker';

export function Calendar({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState<'Month' | 'Agenda'>('Month');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();
  const { clients } = useClients();

  const [form, setForm] = useState({
    title: '',
    category: '',
    allDay: false,
    date: getTodayDateStr(),
    time: '',
    repeat: 'None',
    notes: '',
    clientId: '',
  });

  const handleOpenSheet = (event?: EventItem) => {
    if (event) {
      setEditingEvent(event);
      setForm({ 
        title: event.title, 
        category: event.categoryId, 
        allDay: event.allDay,
        date: event.date,
        time: event.time || '',
        repeat: event.repeat || 'None',
        notes: event.notes || '',
        clientId: event.clientId || '',
      });
    } else {
      setEditingEvent(null);
      setForm({ 
        title: '', 
        category: '', 
        allDay: false, 
        date: getTodayDateStr(),
        time: '',
        repeat: 'None',
        notes: '',
        clientId: '',
      });
    }
    setShowMoreDetails(false);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      showToast({ message: 'Event title is required' });
      return;
    }
    
    const eventData = {
        title: form.title,
        categoryId: form.category,
        allDay: form.allDay,
        date: form.date,
        time: form.time,
        repeat: form.repeat,
        notes: form.notes,
        clientId: form.clientId || undefined,
    };
    
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setSheetOpen(false);
    showToast({
      message: 'Event saved successfully',
      actionLabel: 'Add another',
      onAction: () => handleOpenSheet(),
    });
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const grid = useMemo(() => getMonthGrid(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth]);
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToToday = () => {
    const d = new Date();
    d.setDate(1);
    setCurrentMonth(d);
  };

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    
    events.forEach(e => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return;
      
      const arr = map.get(e.date) || [];
      arr.push(e);
      map.set(e.date, arr);
    });
    return map;
  }, [events, search]);

  const todayStr = getTodayDateStr();
  const sortedDates = Array.from(eventsByDate.keys())
    .filter(date => tab === 'Month' || date >= todayStr)
    .sort();

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary" aria-label="Close">
            <X size={20} />
          </button>
        }
        title="Calendar"
        rightIcon={
          <button onClick={() => handleOpenSheet()} className="w-11 h-11 rounded-full bg-tx-primary flex items-center justify-center text-tx-inverse" aria-label="Add event">
            <Plus size={20} />
          </button>
        }
      />

      <div className="flex flex-col gap-4 px-5 mt-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex bg-surface-neutral rounded-full p-1 w-64">
            {['Month', 'Agenda'].map((opt) => (
              <button
                key={opt}
                onClick={() => setTab(opt as 'Month' | 'Agenda')}
                className={`flex-1 py-2 text-center text-[14px] font-medium rounded-full transition-colors ${
                  tab === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={() => setIsSearching(!isSearching)} className="w-10 h-10 rounded-full bg-surface-neutral text-tx-primary flex items-center justify-center shrink-0" aria-label="Search events">
            <Search size={18} />
          </button>
        </div>
        
        {isSearching && (
          <div className="flex items-center gap-3 bg-surface-neutral rounded-[20px] px-4 py-3 border border-transparent focus-within:border-bd-subtle transition-colors animate-in fade-in">
            <Search size={20} className="text-tx-muted" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[15px] flex-1 text-tx-primary"
              autoFocus
            />
          </div>
        )}
      </div>

      {tab === 'Month' ? (
        <div className="px-5 mb-8 animate-in fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-tx-primary">{formatMonthYear(currentMonth)}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleJumpToToday} className="px-3 py-1.5 rounded-full bg-surface-neutral text-[13px] font-medium text-tx-primary">
                Today
              </button>
              <div className="flex items-center bg-surface-neutral rounded-full">
                <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center text-tx-primary rounded-full active:bg-tx-primary/10" aria-label="Previous month">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center text-tx-primary rounded-full active:bg-tx-primary/10" aria-label="Next month">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 mb-4 text-center text-[13px] font-medium text-tx-muted">
            {days.map((d, i) => <div key={i}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {grid.map((cell, i) => {
              const isToday = cell.dateStr === getTodayDateStr();
              const hasEvent = eventsByDate.has(cell.dateStr);

              return (
                <div key={i} className="flex flex-col items-center justify-center relative h-10">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[15px] font-medium ${
                    isToday ? 'bg-accent-primary text-tx-primary' :
                    !cell.isCurrentMonth ? 'text-tx-muted/50' : 'text-tx-primary'
                  }`}>
                    {cell.day}
                  </div>
                  {hasEvent && !isToday && (
                    <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-tx-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-2 animate-in fade-in">
          <div className="px-5 flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-medium text-tx-primary">Upcoming Events</h2>
          </div>
          
          {sortedDates.map(date => {
            const dateEvents = eventsByDate.get(date)!;
            const dateObj = new Date(date + 'T00:00:00');
            const dateDisplay = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
            
            return (
              <div key={date}>
                <DayAgendaRow
                  date={dateDisplay}
                  weekday={weekday}
                  events={dateEvents.map(e => ({ 
                    time: e.allDay ? 'All Day' : e.time || '', 
                    label: e.title,
                    onClick: () => handleOpenSheet(e)
                  }))}
                />
              </div>
            );
          })}
          {sortedDates.length === 0 && (
            <div className="text-center text-tx-muted py-8 text-[15px]">No events found.</div>
          )}
        </div>
      )}

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingEvent ? 'Edit Event' : 'New Event'}
        onSave={handleSave}
      >
        <BottomSheetField>
          <input
            type="text"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full text-[20px] font-medium text-tx-primary placeholder:text-tx-muted/50 bg-transparent outline-none py-2"
            autoFocus
          />
        </BottomSheetField>
        
        <BottomSheetField label="Type/Category">
          <CategoryPicker
            value={form.category}
            onChange={(c) => setForm({ ...form, category: c })}
            scope="event"
            categories={preferences.categories}
            onAddCategory={addCategory}
          />
        </BottomSheetField>

        <BottomSheetField label="Date & Time">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-neutral">
              <span className="text-[15px] font-medium text-tx-primary">All-day</span>
              <button 
                onClick={() => setForm(f => ({ ...f, allDay: !f.allDay }))}
                className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${form.allDay ? 'bg-tx-primary' : 'bg-canvas border border-bd-subtle'}`}
                aria-label={form.allDay ? "Disable all-day" : "Enable all-day"}
              >
                <div className={`w-4 h-4 rounded-full bg-canvas transition-transform ${form.allDay ? 'translate-x-6' : 'translate-x-0 bg-tx-muted'}`} />
              </button>
            </div>
            {!form.allDay ? (
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
                />
                <input 
                  type="time" 
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-32 px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
                />
              </div>
            ) : (
              <input 
                type="date" 
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
              />
            )}
          </div>
        </BottomSheetField>

        {!showMoreDetails ? (
          <button onClick={() => setShowMoreDetails(true)} className="text-[14px] font-medium text-tx-muted py-2 text-left w-full">
            More details...
          </button>
        ) : (
          <>
            <BottomSheetField label="Link Client">
              <SearchPicker
                items={clients.map(c => ({ id: c.id, label: c.name }))}
                value={form.clientId}
                onChange={(id) => setForm(f => ({ ...f, clientId: id }))}
                
              />
            </BottomSheetField>

            <BottomSheetField label="Repeat">
              <select 
                value={form.repeat}
                onChange={e => setForm({ ...form, repeat: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
              >
                <option value="None">None</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Custom">Custom</option>
              </select>
            </BottomSheetField>
            
            <BottomSheetField label="Notes">
              <textarea 
                placeholder="Add optional notes..." 
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none h-24 resize-none" 
              />
            </BottomSheetField>
            
            {editingEvent && (
               <button 
                 onClick={() => setDeleteConfirmOpen(true)}
                 className="w-full py-3 mt-4 rounded-xl border border-red-500/20 text-red-500 font-medium text-[15px]"
               >
                 Delete Event
               </button>
            )}
          </>
        )}
      </BottomSheet>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (editingEvent) {
            deleteEvent(editingEvent.id);
            setSheetOpen(false);
            setDeleteConfirmOpen(false);
            showToast({ message: 'Event deleted' });
          }
        }}
        title="Delete Event"
        body="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

