export type Tone = 'lime' | 'olive' | 'neutral';

export interface Category {
  id: string;
  label: string;
  color: string;
  scope: 'task' | 'event' | 'revenue';
}

export interface TaskItem {
  id: string;
  title: string;
  startTime: string;
  status: 'done' | 'active' | 'upcoming';
  tone: Tone;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  priority: 'high' | 'low';
  completionPct: number;
  tone: Tone;
}

export interface RevenueMonth {
  label: string;
  amount: number;
  overduePct?: number;
  isCurrent?: boolean;
}

export interface RevenueEntry {
  id: string;
  amount: number;
  clientOrProject: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber?: string;
  notes?: string;
}

export interface CalendarDay {
  date: string;
  weekday: string;
  events: { time: string; label: string }[];
}

export interface TimeEntry {
  id: string;
  projectId: string;
  startedAt: string;
  durationSeconds: number;
  billable: boolean;
  note?: string;
}

export interface UserPreferences {
  currency: string;
  firstDayOfWeek: 'sun' | 'mon';
  defaultReminderMinutes: number;
  roundingIncrementMinutes: number;
  overdueThresholdDays: number;
  defaultTaskDuration: number;
  categories: Category[];
}

export type TabState = 'dashboard' | 'projects' | 'tools' | 'messages';
export type PushedScreenState = 'none' | 'tasks' | 'calendar' | 'finance' | 'time-tracker' | 'settings';

