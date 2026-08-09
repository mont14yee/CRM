import { useState } from 'react';
import { X, MoreVertical, Pause } from 'lucide-react';
import { Header } from '../components/Shared';
import { BottomSheet, BottomSheetField } from '../components/BottomSheet';
import { useToast } from '../context/ToastContext';

export function TimeTracker({ onDismiss }: { onDismiss: () => void }) {
  const [timerState, setTimerState] = useState<'idle' | 'running'>('idle');
  
  const [isStartSheetOpen, setStartSheetOpen] = useState(false);
  const [isSaveSheetOpen, setSaveSheetOpen] = useState(false);
  
  const { showToast } = useToast();

  const [form, setForm] = useState({
    project: '',
    note: '',
    billable: true,
    duration: '01:40:02',
  });

  const handleStart = () => {
    setStartSheetOpen(false);
    setTimerState('running');
  };

  const handleStop = () => {
    setTimerState('idle');
    setSaveSheetOpen(true);
  };

  const handleSave = () => {
    setSaveSheetOpen(false);
    showToast({
      message: 'Time saved successfully',
      actionLabel: 'Log manual',
      onAction: () => setSaveSheetOpen(true),
    });
  };

  const handleManualEntry = () => {
    setSaveSheetOpen(true);
  };

  return (
    <div className="absolute inset-0 bg-tx-primary z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-tx-inverse/10 flex items-center justify-center text-tx-inverse">
            <X size={20} />
          </button>
        }
        title={<span className="text-tx-inverse">Time Tracker</span>}
        rightIcon={
          <button onClick={handleManualEntry} className="w-11 h-11 rounded-full bg-tx-inverse/10 flex items-center justify-center text-tx-inverse">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="flex bg-tx-inverse/10 rounded-full p-1 mb-12">
          <button className="px-6 py-2 rounded-full bg-tx-inverse text-tx-primary text-[14px] font-medium">AM</button>
          <button className="px-6 py-2 rounded-full text-tx-inverse/50 text-[14px] font-medium">PM</button>
        </div>

        <div className="relative w-64 h-64 mb-16">
          {/* Tick marks */}
          <div className="absolute inset-0">
             {Array.from({ length: 60 }).map((_, i) => (
               <div
                 key={i}
                 className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-64"
                 style={{ transform: `translateX(-50%) rotate(${i * 6}deg)` }}
               >
                 <div className={`w-0.5 ${i % 5 === 0 ? 'h-3 bg-tx-inverse/40' : 'h-1.5 bg-tx-inverse/20'}`} />
               </div>
             ))}
          </div>
          
          {/* Progress Arc */}
          <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
             <circle
               cx="128" cy="128" r="114"
               fill="none"
               stroke="var(--color-accent-primary)"
               strokeWidth="4"
               strokeDasharray="716"
               strokeDashoffset={timerState === 'running' ? "500" : "716"}
               strokeLinecap="round"
               className="transition-all duration-1000 ease-out"
             />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[36px] font-light text-tx-inverse tabular-nums tracking-tight">
              {timerState === 'running' ? '01:40:02' : '00:00:00'}
            </div>
          </div>
        </div>

        {timerState === 'running' ? (
          <div className="flex items-center gap-4 mt-auto">
            <button className="w-16 h-16 rounded-full bg-tx-inverse/10 flex items-center justify-center text-tx-inverse">
              <Pause size={24} fill="currentColor" />
            </button>
            <button onClick={handleStop} className="px-10 h-16 rounded-full bg-accent-primary text-tx-primary text-[16px] font-medium flex items-center justify-center">
              Stop
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-auto">
            <button onClick={() => setStartSheetOpen(true)} className="px-12 h-16 rounded-full bg-accent-primary text-tx-primary text-[16px] font-medium flex items-center justify-center">
              Start
            </button>
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={isStartSheetOpen}
        onClose={() => setStartSheetOpen(false)}
        title="Start Timer"
        onSave={handleStart}
        saveLabel="Start"
      >
        <BottomSheetField label="Project / Task">
          <input type="text" placeholder="Search or + New" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
        </BottomSheetField>
        
        <BottomSheetField label="Note (optional)">
          <input type="text" placeholder="What are you working on?" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
        </BottomSheetField>

        <BottomSheetField>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-neutral mt-2">
            <span className="text-[15px] font-medium text-tx-primary">Billable</span>
            <button 
              onClick={() => setForm(f => ({ ...f, billable: !f.billable }))}
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${form.billable ? 'bg-tx-primary' : 'bg-canvas border border-bd-subtle'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-canvas transition-transform ${form.billable ? 'translate-x-6' : 'translate-x-0 bg-tx-muted'}`} />
            </button>
          </div>
        </BottomSheetField>
      </BottomSheet>

      <BottomSheet
        isOpen={isSaveSheetOpen}
        onClose={() => setSaveSheetOpen(false)}
        title="Save Summary"
        onSave={handleSave}
        saveLabel="Save"
        secondaryAction={
          <button onClick={() => setSaveSheetOpen(false)} className="w-full py-3.5 rounded-full text-tx-muted text-[15px] font-medium">
            Discard
          </button>
        }
      >
        <BottomSheetField>
          <div className="flex items-center text-[36px] font-light text-tx-primary">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full bg-transparent outline-none py-2 tabular-nums"
            />
          </div>
        </BottomSheetField>

        <BottomSheetField label="Project / Task">
          <input type="text" placeholder="Search or + New" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
        </BottomSheetField>
        
        <BottomSheetField label="Note">
          <textarea placeholder="Add notes..." className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none h-24 resize-none" />
        </BottomSheetField>
      </BottomSheet>
    </div>
  );
}

