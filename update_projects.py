import re

with open('src/screens/Projects.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { useToast } from '../context/ToastContext';", 
"import { useToast } from '../context/ToastContext';\nimport { useClients } from '../context/ClientsContext';\nimport { useNavigation } from '../context/NavigationContext';")

# Update Projects component
comp_start = """export function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { goToClient } = useNavigation();
  const { showToast } = useToast();"""

content = re.sub(r'export function Projects\(\) \{\n  const \{ projects, addProject, updateProject, deleteProject \} = useProjects\(\);\n  const \{ showToast \} = useToast\(\);', comp_start, content)

# Add clientId to form state
form_start = """  const [form, setForm] = useState({
    name: '',
    priority: 'low' as 'high' | 'low',
    completionPct: '0',
    tone: 'lime' as 'lime' | 'olive' | 'neutral',
    clientId: '',
  });"""

content = re.sub(r"  const \[form, setForm\] = useState\(\{[\s\S]*?tone: 'lime' as 'lime' \| 'olive' \| 'neutral',\n  \}\);", form_start, content)

# Update handleOpenSheet
open_sheet = """  const handleOpenSheet = (proj?: ProjectItem) => {
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
  };"""
content = re.sub(r"  const handleOpenSheet = \(proj\?: ProjectItem\) => \{[\s\S]*?setSheetOpen\(true\);\n  \};", open_sheet, content)

# Update handleSave
save_str = """  const handleSave = () => {
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
  };"""
content = re.sub(r"  const handleSave = \(\) => \{[\s\S]*?showToast\(\{ message: editingProj \? 'Project updated' : 'Project created' \}\);\n  \};", save_str, content)


# Find project render loop to add deep linking
# It's currently: <img src={`https://i.pravatar.cc/150?u=${proj.id}`} alt="client" className="w-10 h-10 rounded-full object-cover bg-canvas" />
render_find = r"<img src=\{`https://i\.pravatar\.cc/150\?u=\$\{proj\.id\}`\} alt=\"client\" className=\"w-10 h-10 rounded-full object-cover bg-canvas\" />"
render_replace = """{proj.clientId && (
                  <button onClick={() => goToClient(proj.clientId!)} className="w-10 h-10 rounded-full overflow-hidden bg-surface-neutral active:opacity-80">
                    <img src={clients.find(c => c.id === proj.clientId)?.avatarUrl || `https://i.pravatar.cc/150?u=${proj.clientId}`} alt="client" className="w-full h-full object-cover" />
                  </button>
                )}
                {!proj.clientId && (
                  <img src={`https://i.pravatar.cc/150?u=${proj.id}`} alt="client" className="w-10 h-10 rounded-full object-cover bg-canvas" />
                )}"""
content = re.sub(render_find, render_replace, content)

# Add Client selection to BottomSheet
bs_find = r"        <BottomSheetField label=\"Priority\">"
bs_replace = """        <BottomSheetField label="Client (Optional)">
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
        
        <BottomSheetField label="Priority">"""
content = re.sub(bs_find, bs_replace, content)

with open('src/screens/Projects.tsx', 'w') as f:
    f.write(content)

