import { useState, useMemo } from 'react';
import { X, MoreVertical, Edit2, ChevronDown } from 'lucide-react';
import { Header, TabPill, ProgressBar } from '../components/Shared';
import { BottomSheet, BottomSheetField, CategoryPicker } from '../components/BottomSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useToast } from '../context/ToastContext';
import { useRevenue } from '../context/RevenueContext';

export function Finance({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState('Monthly');
  
  const [isLogSheetOpen, setLogSheetOpen] = useState(false);
  const [isGoalSheetOpen, setGoalSheetOpen] = useState(false);
  
  const { preferences, addCategory } = usePreferences();
  const { showToast } = useToast();
  const { revenues, yearlyGoal, addRevenue, setYearlyGoal } = useRevenue();

  const [logForm, setLogForm] = useState({
    amount: '',
    client: '',
    status: 'Paid' as 'Paid' | 'Pending' | 'Overdue',
    date: new Date().toISOString().split('T')[0],
  });

  const [goalForm, setGoalForm] = useState({
    amount: yearlyGoal.toString(),
    period: 'Yearly',
  });

  const handleSaveLog = () => {
    if (!logForm.amount) return;
    addRevenue({
      amount: Number(logForm.amount),
      clientOrProject: logForm.client || 'General',
      status: logForm.status,
      date: logForm.date,
    });
    setLogSheetOpen(false);
    showToast({
      message: 'Revenue logged',
      actionLabel: 'Log another',
      onAction: () => {
        setLogForm({ amount: '', client: '', status: 'Paid', date: new Date().toISOString().split('T')[0] });
        setLogSheetOpen(true);
      },
    });
  };

  const handleSaveGoal = () => {
    if (goalForm.amount) {
      setYearlyGoal(Number(goalForm.amount));
    }
    setGoalSheetOpen(false);
    showToast({ message: 'Goal updated' });
  };

  // Compute Revenue Stats
  const totalRevenue = useMemo(() => {
    return revenues.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  }, [revenues]);

  const earnedPct = Math.min(100, Math.round((totalRevenue / (yearlyGoal || 1)) * 100));
  const remainingPct = 100 - earnedPct;

  // Compute months (e.g., last 3 months)
  const monthlyStats = useMemo(() => {
    const stats: Record<string, { total: number; overdue: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    revenues.forEach(r => {
      const d = new Date(r.date);
      const m = months[d.getMonth()];
      if (!stats[m]) stats[m] = { total: 0, overdue: 0 };
      if (r.status === 'Paid') stats[m].total += r.amount;
      if (r.status === 'Overdue') stats[m].overdue += r.amount;
    });

    return ['April', 'May', 'June'].map(mName => {
      const shortM = mName.substring(0, 3);
      const stat = stats[shortM] || { total: 0, overdue: 0 };
      const pct = stat.total > 0 ? Math.round((stat.overdue / (stat.total + stat.overdue)) * 100) : 0;
      return { month: mName, total: stat.total, overduePct: pct };
    });
  }, [revenues]);

  // Find max for scaling the bars
  const maxMonthly = Math.max(...monthlyStats.map(m => m.total), 1);

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
              <div className="text-[36px] font-light leading-none">${totalRevenue.toLocaleString()}</div>
            </div>
            <button onClick={() => setLogSheetOpen(true)} className="w-10 h-10 rounded-full bg-tx-inverse/10 flex items-center justify-center">
              <Edit2 size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {monthlyStats.map((mStat, idx) => {
              const widthPct = Math.max(10, Math.round((mStat.total / maxMonthly) * 100));
              const isCurrent = idx === 1; // Highlight middle one like design
              
              return (
                <div key={mStat.month} className="flex items-center gap-4 cursor-pointer active:opacity-80 transition-opacity">
                  <div className="w-12 text-[13px]">{mStat.month}</div>
                  <div 
                    className={`h-10 rounded-r-lg flex items-center justify-between px-3 text-[14px] font-medium transition-all ${
                      isCurrent ? 'bg-accent-primary text-tx-primary' : 'bg-surface-muted text-tx-primary'
                    }`}
                    style={{ width: `${widthPct}%`, minWidth: '80px' }}
                  >
                    <span>{isCurrent && 'Revenue '}${mStat.total.toLocaleString()}</span>
                    {mStat.overduePct > 0 && <span className="text-[12px] opacity-80">Overdue {mStat.overduePct}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-neutral rounded-[24px] p-6">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[14px] text-tx-muted">Yearly Revenue Goal</div>
            <button onClick={() => { setGoalForm({ ...goalForm, amount: yearlyGoal.toString() }); setGoalSheetOpen(true); }}>
              <ChevronDown size={20} className="text-tx-muted" />
            </button>
          </div>
          <div className="text-[36px] font-light text-tx-primary leading-none mb-6">${yearlyGoal.toLocaleString()}</div>
          
          <ProgressBar progress={earnedPct} tone="lime" />
          
          <div className="flex justify-between items-center mt-3 text-[13px]">
            <span className="text-tx-primary font-medium text-[13px]">Revenue goal {earnedPct >= 100 ? 'Achieved' : 'not Achieved'}</span>
            <span className="text-tx-muted">{remainingPct}%</span>
          </div>
          
          <div className="mt-8">
            <div className="text-[13px] text-tx-muted mb-2">Earned {earnedPct}%</div>
            {/* Dot density visualization mock */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < Math.floor((earnedPct/100) * 40) ? 'bg-accent-primary' : 'bg-canvas'}`} />
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
          <input 
            type="text" 
            placeholder="Search or + New" 
            value={logForm.client}
            onChange={e => setLogForm({ ...logForm, client: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
          />
        </BottomSheetField>

        <BottomSheetField label="Status">
          <div className="flex bg-surface-neutral rounded-full p-1 w-full">
            {['Paid', 'Pending', 'Overdue'].map((opt) => (
              <button
                key={opt}
                onClick={() => setLogForm({ ...logForm, status: opt as any })}
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
          <input 
            type="date" 
            value={logForm.date}
            onChange={e => setLogForm({ ...logForm, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
          />
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

