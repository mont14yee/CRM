import re

content = """import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Search, Plus, Phone, Mail, MoreVertical, X, ChevronLeft, 
  MessageSquare, PhoneCall, Video, Smartphone, StickyNote, Building2,
  Briefcase, DollarSign, Tag, Send, Check
} from 'lucide-react';
import { Header } from '../components/Shared';
import { BottomSheet, BottomSheetField } from '../components/BottomSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useClients } from '../context/ClientsContext';
import { useMessages } from '../context/MessagesContext';
import { useProjects } from '../context/ProjectsContext';
import { useRevenue } from '../context/RevenueContext';
import { useNavigation } from '../context/NavigationContext';
import { Client, ClientStatus, MessageChannel } from '../types';
import { formatCurrency, formatCurrencyCompact, getCurrencySymbol } from '../utils/currency';
import { usePreferences } from '../context/PreferencesContext';

const STATUS_COLORS: Record<ClientStatus, string> = {
  lead: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  past: 'bg-tx-muted/10 text-tx-muted border-tx-muted/20'
};

const CHANNEL_ICONS: Record<MessageChannel, React.ElementType> = {
  note: StickyNote,
  email: Mail,
  sms: Smartphone,
  call: PhoneCall,
  meeting: Video,
};

export function Clients({ initialClientId }: { initialClientId?: string }) {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { messagesForClient, addMessage } = useMessages();
  const { projects } = useProjects();
  const { entries } = useRevenue();
  const { preferences } = usePreferences();
  const { dismiss } = useNavigation(); // to clear if needed

  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId || null);
  const [filter, setFilter] = useState<'all' | ClientStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sheet / Modals
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'lead' as ClientStatus,
    tags: [] as string[],
    notes: ''
  };
  const [form, setForm] = useState(initialFormState);
  const [newTag, setNewTag] = useState('');

  // Activity Compose State
  const [msgBody, setMsgBody] = useState('');
  const [msgChannel, setMsgChannel] = useState<MessageChannel>('note');

  // Detail Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  // Derived
  const filteredClients = useMemo(() => {
    let result = clients;
    if (filter !== 'all') {
      result = result.filter(c => c.status === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return result;
  }, [clients, filter, searchQuery]);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const counts = useMemo(() => {
    return {
      all: clients.length,
      lead: clients.filter(c => c.status === 'lead').length,
      active: clients.filter(c => c.status === 'active').length,
      past: clients.filter(c => c.status === 'past').length,
    };
  }, [clients]);

  // Handlers
  const handleOpenCreate = () => {
    setForm(initialFormState);
    setEditingClientId(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = () => {
    if (selectedClient) {
      setForm({
        name: selectedClient.name,
        company: selectedClient.company || '',
        email: selectedClient.email || '',
        phone: selectedClient.phone || '',
        status: selectedClient.status,
        tags: [...selectedClient.tags],
        notes: selectedClient.notes || ''
      });
      setEditingClientId(selectedClient.id);
      setIsMenuOpen(false);
      setIsSheetOpen(true);
    }
  };

  const handleSaveClient = () => {
    if (!form.name.trim()) return;
    if (editingClientId) {
      updateClient(editingClientId, form);
    } else {
      addClient(form);
    }
    setIsSheetOpen(false);
  };

  const confirmDelete = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
      setSelectedClientId(null);
    }
  };

  const handleSendMsg = () => {
    if (!msgBody.trim() || !selectedClientId) return;
    addMessage({
      clientId: selectedClientId,
      body: msgBody.trim(),
      channel: msgChannel
    });
    setMsgBody('');
  };

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setNewTag('');
  };

  const removeTag = (t: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
  };

  return (
    <div className="flex flex-col h-full bg-canvas relative pb-[88px]">
      {selectedClientId && selectedClient ? (
        // --- DETAIL VIEW ---
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar bg-surface-neutral/30">
          <div className="sticky top-0 z-20 bg-canvas/80 backdrop-blur-md border-b border-bd-subtle px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setSelectedClientId(null)}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-surface-neutral text-tx-primary transition-colors active:opacity-80"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-semibold text-[17px] text-tx-primary truncate px-2">{selectedClient.name}</h1>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center -mr-2 rounded-full hover:bg-surface-neutral text-tx-primary transition-colors active:opacity-80"
              >
                <MoreVertical size={20} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 w-48 bg-canvas border border-bd-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={handleOpenEdit}
                      className="w-full text-left px-4 py-3 text-[15px] font-medium text-tx-primary hover:bg-surface-neutral transition-colors active:bg-surface-hover"
                    >
                      Edit Client
                    </button>
                    <button 
                      onClick={() => { setIsMenuOpen(false); setIsDeleteOpen(true); }}
                      className="w-full text-left px-4 py-3 text-[15px] font-medium text-red-500 hover:bg-red-500/10 transition-colors active:bg-red-500/20"
                    >
                      Delete Client
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="px-6 py-8 flex flex-col items-center text-center bg-canvas">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedClient.avatarSeed}`}
              alt={selectedClient.name}
              className="w-24 h-24 rounded-full bg-surface-neutral mb-4 border border-bd-subtle shadow-sm object-cover"
            />
            <h2 className="text-2xl font-bold text-tx-primary mb-1">{selectedClient.name}</h2>
            {selectedClient.company && (
              <div className="flex items-center text-tx-muted text-[15px] mb-3">
                <Building2 size={16} className="mr-1.5" />
                <span>{selectedClient.company}</span>
              </div>
            )}
            <div className={`px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase border mb-5 ${STATUS_COLORS[selectedClient.status]}`}>
              {selectedClient.status}
            </div>
            
            {selectedClient.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {selectedClient.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-surface-neutral text-tx-secondary rounded-md text-[13px] font-medium border border-bd-subtle/50">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 w-full max-w-[280px]">
              <a 
                href={selectedClient.phone ? `tel:${selectedClient.phone}` : '#'}
                onClick={e => !selectedClient.phone && e.preventDefault()}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border transition-colors ${selectedClient.phone ? 'bg-surface-neutral border-bd-subtle text-tx-primary active:opacity-80' : 'bg-transparent border-dashed border-bd-subtle text-tx-muted opacity-50 cursor-default'}`}
              >
                <Phone size={20} className="mb-1" />
                <span className="text-[13px] font-medium">Call</span>
              </a>
              <a 
                href={selectedClient.email ? `mailto:${selectedClient.email}` : '#'}
                onClick={e => !selectedClient.email && e.preventDefault()}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border transition-colors ${selectedClient.email ? 'bg-surface-neutral border-bd-subtle text-tx-primary active:opacity-80' : 'bg-transparent border-dashed border-bd-subtle text-tx-muted opacity-50 cursor-default'}`}
              >
                <Mail size={20} className="mb-1" />
                <span className="text-[13px] font-medium">Email</span>
              </a>
            </div>
          </div>

          <div className="px-4 py-4 grid grid-cols-2 gap-3">
            <div className="bg-canvas border border-bd-subtle rounded-2xl p-4 flex flex-col">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                <Briefcase size={18} />
              </div>
              <span className="text-[13px] text-tx-muted font-medium mb-1">Linked Projects</span>
              <span className="text-xl font-bold text-tx-primary">
                {projects.filter(p => p.clientId === selectedClient.id).length}
              </span>
            </div>
            <div className="bg-canvas border border-bd-subtle rounded-2xl p-4 flex flex-col">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <DollarSign size={18} />
              </div>
              <span className="text-[13px] text-tx-muted font-medium mb-1">Total Billed</span>
              <span className="text-xl font-bold text-tx-primary">
                {formatCurrencyCompact(
                  entries.filter(r => r.clientId === selectedClient.id && r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0),
                  preferences.currency
                )}
              </span>
            </div>
          </div>

          <div className="px-4 pb-8 flex-1">
            <h3 className="text-[15px] font-bold text-tx-primary mb-4 px-1">Activity & Notes</h3>
            
            <div className="bg-canvas border border-bd-subtle rounded-2xl p-3 mb-6 shadow-sm focus-within:border-accent-primary transition-colors">
              <textarea 
                value={msgBody}
                onChange={e => setMsgBody(e.target.value)}
                placeholder="Log a note, call, meeting..."
                className="w-full bg-transparent resize-none outline-none text-[15px] text-tx-primary placeholder:text-tx-muted min-h-[60px]"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-bd-subtle/50">
                <div className="flex gap-1">
                  {(['note', 'email', 'call', 'meeting', 'sms'] as MessageChannel[]).map(ch => {
                    const Icon = CHANNEL_ICONS[ch];
                    const isActive = msgChannel === ch;
                    return (
                      <button
                        key={ch}
                        onClick={() => setMsgChannel(ch)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-surface-neutral text-tx-primary' : 'text-tx-muted hover:text-tx-secondary hover:bg-surface-neutral/50'}`}
                      >
                        <Icon size={16} />
                      </button>
                    )
                  })}
                </div>
                <button 
                  onClick={handleSendMsg}
                  disabled={!msgBody.trim()}
                  className="w-8 h-8 rounded-full bg-tx-primary text-tx-inverse flex items-center justify-center disabled:opacity-50 transition-opacity active:scale-95"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {messagesForClient(selectedClient.id).map(msg => {
                const Icon = CHANNEL_ICONS[msg.channel];
                const d = new Date(msg.createdAt);
                return (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-canvas border border-bd-subtle flex items-center justify-center shrink-0 text-tx-muted">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 bg-canvas border border-bd-subtle rounded-2xl rounded-tl-sm p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[13px] font-medium capitalize text-tx-primary">{msg.channel}</span>
                        <span className="text-[12px] text-tx-muted">{d.toLocaleDateString()} {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-[14.5px] text-tx-secondary leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  </div>
                )
              })}
              {messagesForClient(selectedClient.id).length === 0 && (
                <div className="text-center py-8 text-tx-muted text-[14px]">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // --- LIST VIEW ---
        <>
          <Header title="Clients">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-neutral text-tx-primary transition-colors active:opacity-80"
              >
                <Search size={20} />
              </button>
              <button 
                onClick={handleOpenCreate}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-tx-primary text-tx-inverse hover:opacity-90 transition-opacity active:opacity-80"
              >
                <Plus size={22} />
              </button>
            </div>
          </Header>

          {isSearchOpen && (
            <div className="px-4 py-2 animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" />
                <input 
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, company, email..."
                  className="w-full bg-surface-neutral rounded-xl py-2.5 pl-10 pr-10 text-[15px] outline-none focus:ring-1 ring-bd-subtle"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tx-muted p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-3 overflow-x-auto no-scrollbar flex gap-2">
            {(['all', 'lead', 'active', 'past'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors border ${
                  filter === f 
                  ? 'bg-tx-primary text-tx-inverse border-tx-primary' 
                  : 'bg-surface-neutral text-tx-secondary border-transparent active:bg-surface-hover'
                }`}
              >
                <span className="capitalize">{f}</span>
                <span className={`ml-1.5 text-[12px] ${filter === f ? 'text-tx-inverse/70' : 'text-tx-muted'}`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
            <div className="flex flex-col gap-3">
              {filteredClients.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-canvas border border-bd-subtle hover:border-accent-primary/50 transition-colors active:bg-surface-neutral text-left"
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${c.avatarSeed}`}
                    alt={c.name}
                    className="w-12 h-12 rounded-full bg-surface-neutral border border-bd-subtle/50 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[16px] text-tx-primary truncate leading-tight">{c.name}</h3>
                    {c.company && (
                      <div className="text-[14px] text-tx-muted truncate mt-0.5">
                        {c.company}
                      </div>
                    )}
                  </div>
                  <div className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${STATUS_COLORS[c.status]}`}>
                    {c.status}
                  </div>
                </button>
              ))}
              {filteredClients.length === 0 && (
                <div className="py-12 text-center flex flex-col items-center justify-center text-tx-muted">
                  <div className="w-16 h-16 rounded-full bg-surface-neutral flex items-center justify-center mb-4">
                    <Users size={32} className="opacity-50" />
                  </div>
                  <p className="text-[16px] font-medium text-tx-primary">No clients found</p>
                  <p className="text-[14px] mt-1 max-w-[200px]">
                    {searchQuery ? "Try adjusting your search or filters." : "Add a client to start tracking relationships."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* SIBLINGS (Mounted outside conditionals so they work from Detail View) */}
      <BottomSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={editingClientId ? "Edit Client" : "New Client"}
        onSave={handleSaveClient}
        saveLabel="Save"
      >
        <BottomSheetField label="Name *">
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jane Doe" 
          />
        </BottomSheetField>
        
        <BottomSheetField label="Company">
          <input 
            type="text" 
            value={form.company} 
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            placeholder="Acme Corp" 
          />
        </BottomSheetField>

        <div className="grid grid-cols-2 gap-4">
          <BottomSheetField label="Email">
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="jane@example.com" 
            />
          </BottomSheetField>
          <BottomSheetField label="Phone">
            <input 
              type="tel" 
              value={form.phone} 
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="555-0199" 
            />
          </BottomSheetField>
        </div>

        <BottomSheetField label="Status">
          <div className="flex bg-surface-neutral p-1 rounded-xl">
            {(['lead', 'active', 'past'] as const).map(s => (
              <button
                key={s}
                onClick={() => setForm(f => ({ ...f, status: s }))}
                className={`flex-1 py-1.5 text-[14px] font-medium rounded-lg capitalize transition-all ${
                  form.status === s 
                  ? 'bg-canvas text-tx-primary shadow-sm' 
                  : 'text-tx-muted hover:text-tx-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </BottomSheetField>

        <BottomSheetField label="Tags">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-surface-neutral text-tx-primary text-[14px] font-medium rounded-full border border-bd-subtle flex items-center gap-1.5">
                  {t}
                  <button onClick={() => removeTag(t)} className="text-tx-muted hover:text-tx-primary">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTag} 
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag(); }}
                placeholder="Add a tag (press Enter)" 
                className="flex-1 min-w-0"
              />
              <button 
                onClick={addTag}
                disabled={!newTag.trim()}
                className="px-4 bg-surface-neutral text-tx-primary rounded-xl font-medium disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </BottomSheetField>

        <BottomSheetField label="Notes">
          <textarea 
            value={form.notes} 
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Background info, preferences..." 
            className="min-h-[80px]"
          />
        </BottomSheetField>
      </BottomSheet>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Client"
        body={`Are you sure you want to delete ${selectedClient?.name}? Linked projects, revenue, and tasks will remain but the client link will be removed. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
"""

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(content)
