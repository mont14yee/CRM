import { useState } from 'react';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { Header, ProgressBar } from '../components/Shared';
import { BottomSheet, BottomSheetField } from '../components/BottomSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useProjects } from '../context/ProjectsContext';
import { ProjectItem } from '../types';
import { useToast } from '../context/ToastContext';
import { useClients } from '../context/ClientsContext';
import { useNavigation } from '../context/NavigationContext';

export function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { goToClient } = useNavigation();
  const { showToast } = useToast();
  
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);

  const [form, setForm] = useState({
    name: '',
    priority: 'low' as 'high' | 'low',
    completionPct: '0',
    tone: 'lime' as 'lime' | 'olive' | 'neutral',
    clientId: '',
  });

  const handleOpenSheet = (proj?: ProjectItem) => {
    if (proj) {
      setEditingProj(proj);
      setForm({
        name: proj.name,
        priority: proj.priority,
        completionPct: String(proj.completionPct),
        tone: proj.tone,
        clientId: proj.clientId || '',
      });
    } else {
      setEditingProj(null);
      setForm({ name: '', priority: 'low', completionPct: '0', tone: 'lime', clientId: '' });
    }
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editingProj) {
      updateProject(editingProj.id, {
        name: form.name,
        priority: form.priority,
        completionPct: Number(form.completionPct),
        tone: form.tone,
        clientId: form.clientId || undefined,
      });
    } else {
      addProject({
        name: form.name,
        priority: form.priority,
        completionPct: Number(form.completionPct),
        tone: form.tone,
        clientId: form.clientId || undefined,
      });
    }
    setSheetOpen(false);
    showToast({ message: editingProj ? 'Project updated' : 'Project created' });
  };

  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header
        leftIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <Search size={20} />
          </button>
        }
        title="Projects"
        rightIcon={
          <button className="w-11 h-11 rounded-full bg-surface-neutral flex items-center justify-center text-tx-primary">
            <MoreVertical size={20} />
          </button>
        }
      />

      <div className="px-5 mt-4 flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-medium text-tx-primary">Recent Activity</h2>
        <button onClick={() => handleOpenSheet()} className="w-10 h-10 rounded-full bg-tx-primary text-tx-inverse flex items-center justify-center">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {projects.map((proj) => (
          <div 
            key={proj.id} 
            onClick={() => handleOpenSheet(proj)}
            className="bg-surface-neutral rounded-[24px] p-5 relative overflow-hidden cursor-pointer active:opacity-80 transition-opacity"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                {proj.clientId && (
                  <button onClick={() => goToClient(proj.clientId!)} className="w-10 h-10 rounded-full overflow-hidden bg-surface-neutral active:opacity-80">
                    <img src={clients.find(c => c.id === proj.clientId)?.avatarUrl || `https://i.pravatar.cc/150?u=${proj.clientId}`} alt="client" className="w-full h-full object-cover" />
                  </button>
                )}
                {!proj.clientId && (
                  <img src={`https://i.pravatar.cc/150?u=${proj.id}`} alt="client" className="w-10 h-10 rounded-full object-cover bg-canvas" />
                )}
                <div className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
                  proj.priority === 'high' ? 'bg-canvas text-tx-primary' : 'bg-canvas/50 text-tx-muted'
                }`}>
                  {proj.priority === 'high' ? 'High Priority' : 'Low Priority'}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-canvas text-tx-primary text-[12px] font-medium">
                Completed {proj.completionPct}%
              </div>
            </div>
            
            <div className="flex items-end gap-4 mb-5">
              <div className="text-[48px] font-light text-tx-muted leading-none tracking-tighter">
                {proj.index}
              </div>
              <div className="text-[20px] font-medium text-tx-primary leading-tight pb-1">
                {proj.name}
              </div>
            </div>

            <ProgressBar progress={proj.completionPct} tone={proj.tone} />
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center text-tx-muted py-8 text-[15px]">No projects found.</div>
        )}
      </div>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingProj ? 'Edit Project' : 'New Project'}
        onSave={handleSave}
      >
        <BottomSheetField>
          <input
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-[20px] font-medium text-tx-primary placeholder:text-tx-muted/50 bg-transparent outline-none py-2"
            autoFocus
          />
        </BottomSheetField>
        
        <BottomSheetField label="Client (Optional)">
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full bg-surface-neutral text-tx-primary px-4 py-2 rounded-xl outline-none"
          >
            <option value="">No Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </BottomSheetField>
        
        <BottomSheetField label="Priority">
          <div className="flex bg-surface-neutral rounded-full p-1 w-full">
            {['low', 'high'].map((opt) => (
              <button
                key={opt}
                onClick={() => setForm({ ...form, priority: opt as any })}
                className={`flex-1 py-2 text-center text-[14px] font-medium rounded-full transition-colors ${
                  form.priority === opt ? 'bg-canvas text-tx-primary shadow-sm' : 'text-tx-muted'
                }`}
              >
                {opt === 'high' ? 'High' : 'Low'}
              </button>
            ))}
          </div>
        </BottomSheetField>

        <BottomSheetField label="Completion %">
          <input 
            type="number" 
            min="0"
            max="100"
            placeholder="0"
            value={form.completionPct}
            onChange={e => setForm({ ...form, completionPct: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-neutral border-none text-[15px] outline-none" 
          />
        </BottomSheetField>
        
        <BottomSheetField label="Theme Tone">
          <div className="flex gap-2">
             {['lime', 'olive', 'neutral'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, tone: t as any })}
                  className={`flex-1 py-3 text-center text-[14px] font-medium rounded-xl transition-colors border ${
                    form.tone === t ? 'border-tx-primary' : 'border-transparent bg-surface-neutral'
                  }`}
                >
                  <span className="capitalize">{t}</span>
                </button>
             ))}
          </div>
        </BottomSheetField>
        
        {editingProj && (
           <button 
             onClick={() => setDeleteConfirmOpen(true)}
             className="w-full py-3 mt-4 rounded-xl border border-red-500/20 text-red-500 font-medium text-[15px]"
           >
             Delete Project
           </button>
        )}
      </BottomSheet>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (editingProj) {
            deleteProject(editingProj.id);
            setSheetOpen(false);
            setDeleteConfirmOpen(false);
            showToast({ message: 'Project deleted' });
          }
        }}
        title="Delete Project"
        body="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
