import { usePreferences } from "../context/PreferencesContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Phone, Mail, ChevronLeft, MessageSquare, MoreVertical, Edit2 } from 'lucide-react';
import { Header, TabPill, DayAgendaRow } from '../components/Shared';
import { BottomSheet, BottomSheetField } from '../components/BottomSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useClients } from '../context/ClientsContext';
import { useMessages } from '../context/MessagesContext';
import { useProjects } from '../context/ProjectsContext';
import { useRevenue } from '../context/RevenueContext';
import { useTasks } from '../context/TasksContext';
import { useCalendar } from '../context/CalendarContext';
import { useToast } from '../context/ToastContext';
import { Client, ClientMessage } from '../types';
import { SearchPicker } from '../components/SearchPicker';

export function Clients({ initialClientId }: { initialClientId?: string }) {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { messages, addMessage, lastMessageForClient } = useMessages();
  const { projects } = useProjects();
  const { revenues } = useRevenue();
  const { tasks } = useTasks();
  const { events } = useCalendar();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<'All' | 'Lead' | 'Active' | 'Past'>('All');
  const [search, setSearch] = useState('');
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId || null);
  
  const [isClientSheetOpen, setClientSheetOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDiscardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead' as 'Lead' | 'Active' | 'Past',
  });

  // Automatically open the detail view if initialClientId is provided
  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchFilter = filter === 'All' || c.status === filter;
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.company.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [clients, filter, search]);

  const handleOpenClientSheet = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        status: client.status,
      });
    } else {
      setEditingClient(null);
      setClientForm({ name: '', company: '', email: '', phone: '', status: 'Lead' });
    }
    setClientSheetOpen(true);
  };


  const checkDirtyAndClose = () => {
    const isDirty = editingClient
      ? clientForm.name !== editingClient.name || clientForm.company !== (editingClient.company || '') || clientForm.email !== (editingClient.email || '') || clientForm.phone !== (editingClient.phone || '') || clientForm.status !== editingClient.status
      : clientForm.name !== '' || clientForm.company !== '' || clientForm.email !== '' || clientForm.phone !== '' || clientForm.status !== 'Lead';
    
    if (isDirty) {
      setDiscardConfirmOpen(true);
    } else {
      setClientSheetOpen(false);
    }
  };

  const handleSaveClient = (addAnother = false) => {
    if (!clientForm.name) return;
    if (editingClient) {
      updateClient(editingClient.id, clientForm);
      showToast({ message: 'Client updated' });
    } else {
      addClient(clientForm);
      showToast({ message: 'Client created' });
    }
    
    if (addAnother === true) {
      setClientForm({ name: '', company: '', email: '', phone: '', status: 'Lead' });
      setEditingClient(null);
    } else {
      setClientSheetOpen(false);
    }
  };

  const handleDeleteClient = () => {
    if (editingClient) {
      deleteClient(editingClient.id);
      setSelectedClientId(null);
      setDeleteConfirmOpen(false);
      setClientSheetOpen(false);
      showToast({ message: 'Client deleted' });
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar relative">
      <Header title="Clients" rightIcon={<button onClick={() => handleOpenClientSheet()} className="w-10 h-10 rounded-full bg-tx-primary text-tx-inverse flex items-center justify-center"><Plus size={20}/></button>} />
      
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Lead', 'Active', 'Past'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt as any)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap ${
                filter === opt ? 'bg-tx-primary text-tx-inverse shadow-sm' : 'bg-surface-neutral text-tx-muted'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-3 bg-surface-neutral rounded-[20px] px-4 py-3 border border-transparent focus-within:border-bd-subtle transition-colors">
          <Search size={20} className="text-tx-muted" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[15px] flex-1 text-tx-primary"
          />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {filteredClients.map(client => {
          const lastMsg = lastMessageForClient(client.id);
          return (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className="bg-surface-neutral rounded-[24px] p-5 text-left active:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center font-semibold text-tx-primary">
                    {client.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[16px] font-medium text-tx-primary">{client.name}</div>
                    <div className="text-[13px] text-tx-muted">{client.company}</div>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  client.status === 'Active' ? 'bg-accent-primary/20 text-tx-primary' :
                  client.status === 'Lead' ? 'bg-orange-500/10 text-orange-600' :
                  'bg-surface-muted text-tx-muted'
                }`}>
                  {client.status}
                </div>
              </div>
              {lastMsg && (
                <div className="mt-3 text-[13px] text-tx-muted truncate bg-canvas/50 px-3 py-2 rounded-xl">
                  <span className="font-medium mr-1 text-tx-primary">{lastMsg.channel}:</span>
                  {lastMsg.content}
                </div>
              )}
            </button>
          )
        })}
        {filteredClients.length === 0 && (
          <div className="text-center text-tx-muted py-8 text-[15px]">No clients found.</div>
        )}
      </div>

      {/* Client Detail Overlay */}
      {selectedClient && (
        <ClientDetail 
          client={selectedClient} 
          onClose={() => setSelectedClientId(null)} 
          onEdit={() => handleOpenClientSheet(selectedClient)}
          messages={messages}
          addMessage={addMessage}
          projects={projects}
          revenues={revenues}
          tasks={tasks}
          events={events}
        />
      )}

      {/* Client Create/Edit Sheet */}
      <BottomSheet
        isOpen={isClientSheetOpen}
        onClose={checkDirtyAndClose}
        title={editingClient ? 'Edit Client' : 'New Client'}
        onSave={() => handleSaveClient(false)}
        secondaryAction={
          !editingClient ? (
            <button
              onClick={() => handleSaveClient(true)}
              className="w-full py-3.5 rounded-full bg-surface-neutral text-tx-primary text-[15px] font-medium active:opacity-80 transition-opacity"
            >
              Save & Add Another
            </button>
          ) : undefined
        }
      >
        <BottomSheetField label="Full Name">
          <input
            type="text"
            value={clientForm.name}
            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
          />
        </BottomSheetField>
        
        <BottomSheetField label="Company">
          <input
            type="text"
            value={clientForm.company}
            onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
          />
        </BottomSheetField>

        <BottomSheetField label="Email">
          <input
            type="email"
            value={clientForm.email}
            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
          />
        </BottomSheetField>

        <BottomSheetField label="Phone">
          <input
            type="tel"
            value={clientForm.phone}
            onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none"
          />
        </BottomSheetField>

        <BottomSheetField label="Status">
          <div className="flex bg-surface-neutral rounded-full p-1 w-full">
            {['Lead', 'Active', 'Past'].map((opt) => (
              <button
                key={opt}
                onClick={() => setClientForm({ ...clientForm, status: opt as any })}
                className={`flex-1 py-2 text-center text-[14px] font-medium rounded-full transition-colors ${
                  clientForm.status === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </BottomSheetField>

        {editingClient && (
          <button 
            onClick={() => setDeleteConfirmOpen(true)}
            className="w-full py-3 mt-4 rounded-xl border border-red-500/20 text-red-500 font-medium text-[15px]"
          >
            Delete Client
          </button>
        )}
      </BottomSheet>

      <ConfirmDialog
        isOpen={isDiscardConfirmOpen}
        title="Discard Changes?"
        body="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        onClose={() => setDiscardConfirmOpen(false)}
        onConfirm={() => {
          setDiscardConfirmOpen(false);
          setClientSheetOpen(false);
        }}
      />
      
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        body={`Are you sure you want to delete ${editingClient?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function ClientDetail({ 
  client, 
  onClose, 
  onEdit,
  messages,
  addMessage,
  projects,
  revenues,
  tasks,
  events,
}: any) {
  const { preferences } = usePreferences();
  const [msgInput, setMsgInput] = useState('');
  const [msgChannel, setMsgChannel] = useState<'Note' | 'Email' | 'SMS' | 'Call' | 'Meeting'>('Note');

  const clientMessages = messages.filter((m: ClientMessage) => m.clientId === client.id).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Try to match orphaned ref strings robustly by checking client name/company if it's used as a string tag instead of id
  // Currently Revenues save `clientOrProject` as a string. Projects don't link clients yet.
  const relatedRevenue = revenues.filter((r: any) => r.clientOrProject === client.name || r.clientOrProject === client.id);

  const handleSendActivity = () => {
    if (!msgInput.trim()) return;
    addMessage({
      clientId: client.id,
      content: msgInput,
      channel: msgChannel,
      isOutbound: true
    });
    setMsgInput('');
  };

  return (
    <div className="fixed inset-0 bg-canvas z-50 flex flex-col overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-surface-neutral rounded-full text-tx-primary active:opacity-80">
          <ChevronLeft size={20} />
        </button>
        <button onClick={onEdit} className="w-10 h-10 flex items-center justify-center bg-surface-neutral rounded-full text-tx-primary active:opacity-80">
          <Edit2 size={18} />
        </button>
      </div>

      <div className="px-5 pb-8 flex-1">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-surface-neutral flex items-center justify-center font-medium text-[32px] text-tx-primary mb-4 shadow-sm">
            {client.name.substring(0,2).toUpperCase()}
          </div>
          <h2 className="text-[24px] font-semibold text-tx-primary">{client.name}</h2>
          <div className="text-[15px] text-tx-muted">{client.company}</div>
          
          <div className="flex gap-4 mt-6">
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex flex-col items-center gap-1.5 active:opacity-80">
                <div className="w-12 h-12 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
                  <Phone size={20} />
                </div>
                <span className="text-[12px] text-tx-muted">Call</span>
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex flex-col items-center gap-1.5 active:opacity-80">
                <div className="w-12 h-12 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
                  <Mail size={20} />
                </div>
                <span className="text-[12px] text-tx-muted">Email</span>
              </a>
            )}
          </div>
        </div>

        {relatedRevenue.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[15px] font-medium text-tx-primary mb-3">Revenue Log</h3>
            <div className="flex flex-col gap-2">
              {relatedRevenue.map((r: any) => (
                <div key={r.id} className="bg-surface-neutral rounded-xl px-4 py-3 flex justify-between items-center">
                  <div className="text-[14px] text-tx-primary">{formatCurrency(r.amount, preferences.currency)}</div>
                  <div className="text-[12px] text-tx-muted">{new Date(r.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-[15px] font-medium text-tx-primary mb-3">Activity Timeline</h3>
          
          <div className="bg-surface-neutral rounded-[20px] p-4 mb-4">
            <div className="flex gap-2 mb-3">
              {['Note', 'Email', 'Call', 'Meeting'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setMsgChannel(ch as any)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    msgChannel === ch ? 'bg-tx-primary text-tx-inverse' : 'bg-canvas text-tx-muted'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Log an activity..."
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px] text-tx-primary resize-none h-16"
            />
            <div className="flex justify-end">
              <button 
                onClick={handleSendActivity}
                disabled={!msgInput.trim()}
                className="px-4 py-2 bg-tx-primary text-tx-inverse rounded-full text-[13px] font-medium disabled:opacity-50"
              >
                Log
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {clientMessages.map((msg: ClientMessage) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-neutral flex items-center justify-center shrink-0 text-tx-muted">
                  <MessageSquare size={14} />
                </div>
                <div className="flex-1 bg-surface-neutral rounded-[16px] rounded-tl-none p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-medium text-tx-muted">{msg.channel}</span>
                    <span className="text-[11px] text-tx-muted/70">{new Date(msg.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[14px] text-tx-primary leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {clientMessages.length === 0 && (
              <div className="text-center text-[13px] text-tx-muted py-4">No activity logged yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
