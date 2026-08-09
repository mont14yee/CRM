import { useState } from 'react';
import { X, MoreVertical, Plus, ChevronDown } from 'lucide-react';
import { Header, StatCard, ListRow } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';

export function Tasks({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState('Today');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    category: '',
    priority: 'Medium',
  });

  const handleOpenSheet = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setForm({ title: task.title, category: '', priority: 'Medium' });
    } else {
      setEditingTask(null);
      setForm({ title: '', category: '', priority: 'Medium' });
    }
    setShowMoreDetails(false);
    setSheetOpen(true);
  };

  const handleSave = () => {
    setSheetOpen(false);
    showToast({
      message: 'Task saved successfully',
      actionLabel: 'Add another',
      onAction: () => handleOpenSheet(),
    });
  };

  const tasks = [
    { title: 'Sales', subtitle: 'Start 3:20 PM', status: 'done' },
    { title: 'Design', subtitle: 'Start 6:20 PM', status: 'active' },
    { title: 'Meeting', subtitle: 'Start 8:10 PM', status: 'upcoming' },
  ];

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <X size={20} />
          </button>
        }
        title="Tasks"
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
        <button onClick={() => handleOpenSheet()} className="w-11 h-11 rounded-full bg-tx-primary text-tx-inverse flex items-center justify-center shrink-0">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-tx-primary">All-Time Completed</h2>
          <ChevronDown size={20} className="text-tx-muted" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <StatCard value="36" label="Total Tasks" tone="olive" />
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <div className="flex-1 rounded-[20px] bg-accent-primary p-4 flex flex-col justify-center">
              <div className="text-[28px] font-light text-tx-primary leading-tight">2h</div>
              <div className="text-[13px] font-medium text-tx-primary mt-0.5">Avg Per Day</div>
            </div>
            <div className="flex-1 rounded-[20px] bg-surface-neutral p-4 flex flex-col justify-center">
              <div className="text-[28px] font-light text-tx-primary leading-tight">72h</div>
              <div className="text-[13px] font-medium text-tx-muted mt-0.5">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-tx-primary">Today Tasks</h2>
          <button onClick={() => handleOpenSheet()} className="text-[20px] text-tx-primary">
            +
          </button>
        </div>
        {tasks.map((t, idx) => {
          let dotColor = 'bg-surface-neutral';
          if (t.status === 'active') dotColor = 'bg-accent-primary';
          else if (t.status === 'upcoming') dotColor = 'bg-surface-muted';
          
          return (
            <ListRow
              key={idx}
              icon={<div className={`w-3 h-3 rounded-full ${dotColor}`} />}
              title={t.title}
              subtitle={t.subtitle}
              onClick={() => handleOpenSheet(t)}
              swipeable={true}
              onComplete={() => showToast({ message: 'Task completed' })}
              onDelete={() => showToast({ message: 'Task deleted' })}
            />
          );
        })}
      </div>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        onSave={handleSave}
      >
        <BottomSheetField>
          <input
            type="text"
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full text-[20px] font-medium text-tx-primary placeholder:text-tx-muted/50 bg-transparent outline-none py-2"
            autoFocus
          />
        </BottomSheetField>
        
        <BottomSheetField label="Category">
          <CategoryPicker
            value={form.category}
            onChange={(c) => setForm({ ...form, category: c })}
            scope="task"
            categories={preferences.categories}
            onAddCategory={() => addCategory({ label: 'New Category', color: '#888E80', scope: 'task' })}
          />
        </BottomSheetField>

        <BottomSheetField label="Priority">
          <div className="flex bg-surface-neutral rounded-full p-1 w-full">
            {['Low', 'Medium', 'High'].map((opt) => (
              <button
                key={opt}
                onClick={() => setForm({ ...form, priority: opt })}
                className={`flex-1 py-2 text-center text-[14px] font-medium rounded-full transition-colors ${
                  form.priority === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </BottomSheetField>

        {!showMoreDetails ? (
          <button onClick={() => setShowMoreDetails(true)} className="text-[14px] font-medium text-tx-muted py-2">
            More details...
          </button>
        ) : (
          <>
            <BottomSheetField label="Date & Time">
              <input type="datetime-local" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
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


