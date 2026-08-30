import re

# Fix Clients.tsx
with open('src/screens/Clients.tsx', 'r') as f:
    clients = f.read()

clients = clients.replace('onClose={() => setDiscardConfirmOpen(false)}', 'onCancel={() => setDiscardConfirmOpen(false)}')
clients = clients.replace('onClose={() => setDeleteConfirmOpen(false)}', 'onCancel={() => setDeleteConfirmOpen(false)}')

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(clients)

# Fix TimeTracker.tsx
with open('src/screens/TimeTracker.tsx', 'r') as f:
    tt = f.read()

tt = tt.replace('onClose={() => setDiscardConfirmOpen(false)}', 'onCancel={() => setDiscardConfirmOpen(false)}')
tt = tt.replace('onClose={() => setDeleteConfirmOpen(false)}', 'onCancel={() => setDeleteConfirmOpen(false)}')
# SearchPicker in TimeTracker used color
tt = tt.replace('projects.map(p => ({ id: p.id, label: p.name, color: p.tone === \'lime\' ? \'#a3e635\' : p.tone === \'olive\' ? \'#65a30d\' : \'#a3a3a3\' }))', 'projects.map(p => ({ id: p.id, label: p.name }))')
tt = tt.replace('placeholder="Select a project..."', '')

with open('src/screens/TimeTracker.tsx', 'w') as f:
    f.write(tt)

