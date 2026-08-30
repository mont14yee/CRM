export type ClientStatus = 'lead' | 'active' | 'past';
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
  categoryId: string;
  priority: 'Low' | 'Medium' | 'High';
  date?: string; // ISO date-time
  notes?: string;
  status: 'done' | 'active' | 'upcoming';
  projectId?: string;
  repeat?: string;
  reminder?: number;
  clientId?: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  priority: 'high' | 'low';
  completionPct: number;
  tone: Tone;
  clientId?: string;
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
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceNumber?: string;
  notes?: string;
  clientId?: string;
}

export interface EventItem {
  id: string;
  title: string;
  categoryId: string;
  allDay: boolean;
  date: string;
  time?: string;
  repeat: string;
  notes?: string;
  clientId?: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  startedAt: string;
  durationSeconds: number;
  billable: boolean;
  note?: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  tags: string[];
  notes?: string;
  avatarSeed: string;
  createdAt: string;
}

export type MessageChannel = 'note' | 'call' | 'email' | 'meeting' | 'sms';

export interface MessageItem {
  id: string;
  clientId: string;
  channel: MessageChannel;
  body: string;
  createdAt: string;
  pinned?: boolean;
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

export type TabState = 'dashboard' | 'projects' | 'tools' | 'clients' | 'profile';
export type PushedScreenState = 'none' | 'tasks' | 'calendar' | 'finance' | 'time-tracker' | 'settings';



export interface UserProfile {
  name: string;
  email: string;
  businessName?: string;
  avatarSeed: string;
}
