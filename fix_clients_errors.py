import re
with open("src/screens/Clients.tsx", "r") as f:
    content = f.read()

# Fix form state sets
content = content.replace(
    "status: client.status,\n      });",
    "status: client.status,\n        tags: client.tags || [],\n        notes: client.notes || '',\n      });"
)
content = content.replace(
    "setClientForm({ name: '', company: '', email: '', phone: '', status: 'lead' });",
    "setClientForm({ name: '', company: '', email: '', phone: '', status: 'lead', tags: [], notes: '' });"
)
content = content.replace(
    "setClientForm({ name: '', company: '', email: '', phone: '', status: 'lead' as 'lead' | 'active' | 'past' });",
    "setClientForm({ name: '', company: '', email: '', phone: '', status: 'lead', tags: [], notes: '' });"
)

# Fix lastMsg
content = content.replace("lastMsg.content", "lastMsg.body")

# Fix msgChannel default state
content = content.replace(
    "useState<'Note' | 'Email' | 'SMS' | 'Call' | 'Meeting'>('Note')",
    "useState<'note' | 'email' | 'sms' | 'call' | 'meeting'>('note')"
)

with open("src/screens/Clients.tsx", "w") as f:
    f.write(content)
