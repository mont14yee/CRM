import { useState } from 'react';
import { X, MoreVertical, Edit2, ChevronDown } from 'lucide-react';
import { Header, TabPill, ProgressBar } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';

export function Finance({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState('Monthly');
  
  const [isLogSheetOpen, setLogSheetOpen] = useState(false);
  const [isGoalSheetOpen, setGoalSheetOpen] = useState(false);
  
  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();

  const [logForm, setLogForm] = useState({
    amount: '',
    client: '',
    status: 'Paid',
  });

  const [goalForm, setGoalForm] = useState({
    amount: '8367',
    period: 'Yearly',
  });

  const handleSaveLog = () => {
    setLogSheetOpen(false);
    showToast({
      message: 'Revenue logged',
      actionLabel: 'Log another',
      onAction: () => setLogSheetOpen(true),
    });
  };

  const handleSaveGoal = () => {
    setGoalSheetOpen(false);
    showToast({ message: 'Goal updated' });
  };

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <X size={20} />
          </button>
        }
        title="Finance Overview"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="mt-2 mb-6">
        <TabPill options={['Monthly', 'Yearly']} active={tab} onChange={setTab} />
      </div>

      <div className="px-5 flex flex-col gap-4">
        <div className="bg-tx-primary rounded-[24px] p-6 text-tx-inverse">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[14px] text-tx-inverse/70 mb-1">ConneQ Revenue</div>
              <div className="text-[36px] font-light leading-none">$2,598</div>
            </div>
            <button onClick={() => setLogSheetOpen(true)} className="w-10 h-10 rounded-full bg-tx-inverse/10 flex items-center justify-center">
              <Edit2 size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 cursor-pointer active:opacity-80 transition-opacity">
              <div className="w-12 text-[13px]">April</div>
              <div className="flex-1 h-10 bg-surface-muted rounded-r-lg flex items-center px-3 text-[14px] font-medium w-[60%]">
                $605
              </div>
            </div>
            <div className="flex items-center gap-4 cursor-pointer active:opacity-80 transition-opacity">
              <div className="w-12 text-[13px]">May</div>
              <div className="flex-1 h-10 bg-accent-primary text-tx-primary rounded-r-lg flex items-center justify-between px-3 text-[14px] font-medium w-[100%]">
                <span>Revenue $1,026</span>
                <span className="text-[12px] opacity-80">Overdue 20%</span>
              </div>
            </div>
            <div className="flex items-center gap-4 cursor-pointer active:opacity-80 transition-opacity">
              <div className="w-12 text-[13px]">June</div>
              <div className="flex-1 h-10 bg-surface-muted rounded-r-lg flex items-center px-3 text-[14px] font-medium w-[80%]">
                $967
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-neutral rounded-[24px] p-6">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[14px] text-tx-muted">Yearly Revenue Goal</div>
            <button onClick={() => setGoalSheetOpen(true)}>
              <ChevronDown size={20} className="text-tx-muted" />
            </button>
          </div>
          <div className="text-[36px] font-light text-tx-primary leading-none mb-6">$8,367</div>
          
          <ProgressBar progress={31} tone="lime" />
          
          <div className="flex justify-between items-center mt-3 text-[13px]">
            <span className="text-tx-primary font-medium text-[13px]">Revenue goal not Achieved</span>
            <span className="text-tx-muted">69%</span>
          </div>
          
          <div className="mt-8">
            <div className="text-[13px] text-tx-muted mb-2">Earned 31%</div>
            {/* Dot density visualization mock */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < 12 ? 'bg-accent-primary' : 'bg-canvas'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomSheet
        isOpen={isLogSheetOpen}
        onClose={() => setLogSheetOpen(false)}
        title="Log Revenue"
        onSave={handleSaveLog}
      >
        <BottomSheetField>
          <div className="flex items-center text-[28px] font-light text-tx-primary">
            <span className="text-tx-muted mr-1">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={logForm.amount}
              onChange={(e) => setLogForm({ ...logForm, amount: e.target.value })}
              className="w-full bg-transparent outline-none py-2"
              autoFocus
            />
          </div>
        </BottomSheetField>
        
        <BottomSheetField label="Client / Project">
          <input type="text" placeholder="Search or + New" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
        </BottomSheetField>

        <BottomSheetField label="Status">
          <div className="flex bg-surface-neutral rounded-full p-1 w-full">
            {['Paid', 'Pending', 'Overdue'].map((opt) => (
              <button
                key={opt}
                onClick={() => setLogForm({ ...logForm, status: opt })}
                className={`flex-1 py-2 text-center text-[14px] font-medium rounded-full transition-colors ${
                  logForm.status === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </BottomSheetField>
        
        <BottomSheetField label="Date">
          <input type="date" className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" />
        </BottomSheetField>
      </BottomSheet>

      <BottomSheet
        isOpen={isGoalSheetOpen}
        onClose={() => setGoalSheetOpen(false)}
        title="Edit Goal"
        onSave={handleSaveGoal}
      >
        <BottomSheetField>
          <div className="flex items-center text-[28px] font-light text-tx-primary">
            <span className="text-tx-muted mr-1">$</span>
            <input
              type="number"
              placeholder="0"
              value={goalForm.amount}
              onChange={(e) => setGoalForm({ ...goalForm, amount: e.target.value })}
              className="w-full bg-transparent outline-none py-2"
              autoFocus
            />
          </div>
        </BottomSheetField>
        
        <BottomSheetField label="Period">
          <select 
            value={goalForm.period}
            onChange={(e) => setGoalForm({ ...goalForm, period: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
          >
            <option>Monthly</option>
            <option>Yearly</option>
            <option>Custom</option>
          </select>
        </BottomSheetField>
      </BottomSheet>
    </div>
  );
}

