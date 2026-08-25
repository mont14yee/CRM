import { useState, useMemo } from 'react';
import { X, MoreVertical, Search, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Header, DayAgendaRow } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';
import { useCalendar } from '../context/CalendarContext';
import { EventItem } from '../types';

export function Calendar({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState('Calendar');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();

  const [form, setForm] = useState({
    title: '',
    category: '',
    allDay: false,
    date: new Date().toISOString().split('T')[0],
    time: '',
    repeat: 'None',
    notes: '',
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
      });
    } else {
      setEditingEvent(null);
      setForm({ 
        title: '', 
        category: '', 
        allDay: false, 
        date: new Date().toISOString().split('T')[0],
        time: '',
        repeat: 'None',
        notes: ''
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
    
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: form.title,
        categoryId: form.category,
        allDay: form.allDay,
        date: form.date,
        time: form.time,
        repeat: form.repeat,
        notes: form.notes,
      });
    } else {
      addEvent({
        title: form.title,
        categoryId: form.category,
        allDay: form.allDay,
        date: form.date,
        time: form.time,
        repeat: form.repeat,
        notes: form.notes,
      });
    }
    setSheetOpen(false);
    showToast({
      message: 'Event saved successfully',
      actionLabel: 'Add another',
      onAction: () => handleOpenSheet(),
    });
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const grid = Array.from({ length: 35 }, (_, i) => i - 2);

  // Group events by date for rendering DayAgendaRow
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    events.forEach(e => {
      const arr = map.get(e.date) || [];
      arr.push(e);
      map.set(e.date, arr);
    });
    return map;
  }, [events]);

  const sortedDates = Array.from(eventsByDate.keys()).sort();

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <X size={20} />
          </button>
        }
        title="Calendar"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="flex items-center justify-between px-5 mt-2 mb-6">
        <div className="flex bg-surface-neutral rounded-full p-1 w-64">
          {['Today', 'Calendar'].map((opt) => (
            <button
              key={opt}
              onClick={() => setTab(opt)}
              className={`flex-1 py-2.5 text-center text-[15px] font-medium rounded-full transition-colors ${
                tab === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button className="w-11 h-11 rounded-full bg-surface-neutral text-tx-primary flex items-center justify-center shrink-0">
          <Search size={20} />
        </button>
      </div>

      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold text-tx-primary">May 2025</h2>
          <button className="w-10 h-10 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <CalendarIcon size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 mb-4 text-center text-[13px] font-medium text-tx-muted">
          {days.map((d, i) => <div key={i}>{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-y-4 text-center">
          {grid.map((num, i) => {
            const isAdj = num <= 0 || num > 31;
            const displayNum = isAdj ? (num <= 0 ? 30 + num : num - 31) : num;
            
            // Just simulate "today" is May 17, 2025 for grid visual mapping
            const isToday = num === 17;
            const dateStr = `2025-05-${displayNum.toString().padStart(2, '0')}`;
            const hasEvent = !isAdj && eventsByDate.has(dateStr);

            return (
              <div key={i} className="flex flex-col items-center justify-center relative h-10">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[15px] font-medium ${
                  isToday ? 'bg-accent-primary text-tx-primary' :
                  isAdj ? 'text-tx-muted/50' : 'text-tx-primary'
                }`}>
                  {displayNum}
                </div>
                {hasEvent && !isToday && (
                  <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-tx-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-tx-primary">Monthly Tasks</h2>
          <button onClick={() => handleOpenSheet()} className="text-[20px] text-tx-primary">
            +
          </button>
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
            onAddCategory={() => addCategory({ label: 'New Category', color: '#888E80', scope: 'event' })}
          />
        </BottomSheetField>

        <BottomSheetField label="Date & Time">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-neutral">
              <span className="text-[15px] font-medium text-tx-primary">All-day</span>
              <button 
                onClick={() => setForm(f => ({ ...f, allDay: !f.allDay }))}
                className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${form.allDay ? 'bg-tx-primary' : 'bg-canvas border border-bd-subtle'}`}
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
                 onClick={() => {
                   deleteEvent(editingEvent.id);
                   setSheetOpen(false);
                   showToast({ message: 'Event deleted' });
                 }}
                 className="w-full py-3 mt-4 rounded-xl border border-red-500/20 text-red-500 font-medium text-[15px]"
               >
                 Delete Event
               </button>
            )}
          </>
        )}
      </BottomSheet>
    </div>
  );
}

