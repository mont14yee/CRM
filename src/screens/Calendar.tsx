import { useState } from 'react';
import { X, MoreVertical, Search, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Header, DayAgendaRow } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';

export function Calendar({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState('Calendar');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    category: '',
    allDay: false,
  });

  const handleOpenSheet = (event?: any) => {
    if (event) {
      setEditingEvent(event);
      setForm({ title: event.label, category: '', allDay: false });
    } else {
      setEditingEvent(null);
      setForm({ title: '', category: '', allDay: false });
    }
    setShowMoreDetails(false);
    setSheetOpen(true);
  };

  const handleSave = () => {
    setSheetOpen(false);
    showToast({
      message: 'Event saved successfully',
      actionLabel: 'Add another',
      onAction: () => handleOpenSheet(),
    });
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const grid = Array.from({ length: 35 }, (_, i) => i - 2);

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
            const isToday = num === 17;
            const hasEvent = num === 16 || num === 20;

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
        <div onClick={() => handleOpenSheet({ label: 'Gym Session', time: '9 AM' })}>
          <DayAgendaRow
            date="16 May"
            weekday="Friday"
            events={[
              { time: '9 AM', label: 'Gym Session' },
              { time: '6 PM', label: 'Design' }
            ]}
          />
        </div>
        <div onClick={() => handleOpenSheet({ label: 'Playing Cricket', time: '8 AM' })}>
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
                <input type="date" className="flex-1 px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
                <input type="time" className="w-32 px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
              </div>
            ) : (
              <input type="date" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
            )}
          </div>
        </BottomSheetField>

        {!showMoreDetails ? (
          <button onClick={() => setShowMoreDetails(true)} className="text-[14px] font-medium text-tx-muted py-2">
            More details...
          </button>
        ) : (
          <>
            <BottomSheetField label="Repeat">
              <select className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none">
                <option>None</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Custom</option>
              </select>
            </BottomSheetField>
            
            <BottomSheetField label="Notes">
              <textarea placeholder="Add optional notes..." className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none h-24 resize-none" />
            </BottomSheetField>
          </>
        )}
      </BottomSheet>
    </div>
  );
}

