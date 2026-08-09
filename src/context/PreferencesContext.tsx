import { createContext, useContext, useState, ReactNode } from 'react';
import { UserPreferences, Category } from '../types';

const defaultCategories: Category[] = [
  { id: 'c1', label: 'Client Calls', color: '#E7F45A', scope: 'task' },
  { id: 'c2', label: 'Design', color: '#F2A93E', scope: 'task' },
];

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  firstDayOfWeek: 'sun',
  defaultReminderMinutes: 15,
  roundingIncrementMinutes: 5,
  overdueThresholdDays: 30,
  defaultTaskDuration: 30,
  categories: defaultCategories,
};

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setPreferences((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, addCategory }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
