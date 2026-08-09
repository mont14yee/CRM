import { useState } from 'react';
import { X, MoreVertical, Sparkles, User, Signal, Palette, Landmark, Settings2, ChevronLeft, Trash2 } from 'lucide-react';
import { Header, ListRow, CircularProgress } from '../components/Shared';
import { usePreferences } from '../context/PreferencesContext';

function PreferencesScreen({ onBack }: { onBack: () => void }) {
  const { preferences, updatePreferences } = usePreferences();

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <ChevronLeft size={20} />
          </button>
        }
        title="Preferences"
      />
      
      <div className="px-5 py-4 flex flex-col gap-8">
        <section>
          <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">General</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-tx-primary">Currency</span>
              <select 
                value={preferences.currency}
                onChange={(e) => updatePreferences({ currency: e.target.value })}
                className="bg-surface-neutral px-3 py-1.5 rounded-lg outline-none text-[14px]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-tx-primary">First day of week</span>
              <select 
                value={preferences.firstDayOfWeek}
                onChange={(e) => updatePreferences({ firstDayOfWeek: e.target.value as 'sun' | 'mon' })}
                className="bg-surface-neutral px-3 py-1.5 rounded-lg outline-none text-[14px]"
              >
                <option value="sun">Sunday</option>
                <option value="mon">Monday</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">Defaults</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-tx-primary">Reminder lead time</span>
              <select 
                value={preferences.defaultReminderMinutes}
                onChange={(e) => updatePreferences({ defaultReminderMinutes: parseInt(e.target.value) })}
                className="bg-surface-neutral px-3 py-1.5 rounded-lg outline-none text-[14px]"
              >
                <option value={0}>At time of event</option>
                <option value={5}>5 mins before</option>
                <option value={15}>15 mins before</option>
                <option value={30}>30 mins before</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-tx-primary">Time tracking increment</span>
              <select 
                value={preferences.roundingIncrementMinutes}
                onChange={(e) => updatePreferences({ roundingIncrementMinutes: parseInt(e.target.value) })}
                className="bg-surface-neutral px-3 py-1.5 rounded-lg outline-none text-[14px]"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-medium text-tx-muted mb-3 uppercase tracking-wider">Categories</h3>
          <div className="flex flex-col gap-3">
            {preferences.categories.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-neutral">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                  <div>
                    <div className="text-[15px] font-medium text-tx-primary">{c.label}</div>
                    <div className="text-[12px] text-tx-muted capitalize">{c.scope}</div>
                  </div>
                </div>
                <button className="text-tx-muted hover:text-tx-primary transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="py-3 rounded-xl border border-bd-subtle border-dashed text-[14px] font-medium text-tx-muted text-center active:bg-surface-neutral transition-colors">
              + Add Category
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Settings({ onDismiss }: { onDismiss: () => void }) {
  const [activeScreen, setActiveScreen] = useState<'main' | 'preferences'>('main');
  const avatarUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

  const settings = [
    { icon: <Sparkles size={20} className="text-tx-primary" />, title: 'ConneQ AI', subtitle: 'Manage AI settings' },
    { icon: <User size={20} className="text-tx-primary" />, title: 'Account Details', subtitle: 'Update info, website, description' },
    { icon: <Signal size={20} className="text-tx-primary" />, title: 'Subscription Plan', subtitle: 'Get the right plan for your business' },
    { icon: <Palette size={20} className="text-tx-primary" />, title: 'Brand Elements', subtitle: 'Add your brand to invoice, emails' },
    { icon: <Landmark size={20} className="text-tx-primary" />, title: 'Bank Account', subtitle: 'Add an account to receive payments' },
    { 
      icon: <Settings2 size={20} className="text-tx-primary" />, 
      title: 'Preferences', 
      subtitle: 'Customize formats, defaults, categories',
      onClick: () => setActiveScreen('preferences')
    },
  ];

  if (activeScreen === 'preferences') {
    return <PreferencesScreen onBack={() => setActiveScreen('main')} />;
  }

  return (
    <div className="absolute inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button onClick={onDismiss} className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <X size={20} />
          </button>
        }
        title="Settings"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="px-5 flex flex-col gap-6 mt-2">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover bg-surface-neutral" />
          <div>
            <div className="text-[20px] font-semibold text-tx-primary">John Snow</div>
            <div className="text-[14px] text-tx-muted mt-0.5">johnsnow@example.com</div>
          </div>
        </div>

        <div className="bg-surface-neutral rounded-[24px] p-5 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-medium text-tx-primary mb-1">7 days left in your trial.</div>
            <button className="text-[14px] font-medium text-tx-muted underline underline-offset-2">
              Continue Setup
            </button>
          </div>
          <CircularProgress progress={62} size={56} strokeWidth={4}>
            <span className="text-[13px] font-medium text-tx-primary">62%</span>
          </CircularProgress>
        </div>

        <div className="mt-2 flex flex-col gap-2 pb-8">
          {settings.map((s, idx) => (
            <ListRow
              key={idx}
              icon={<div className="w-10 h-10 rounded-full bg-surface-neutral flex items-center justify-center">{s.icon}</div>}
              title={s.title}
              subtitle={s.subtitle}
              onClick={s.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

