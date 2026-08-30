import re

with open('src/screens/Dashboard.tsx', 'r') as f:
    content = f.read()
content = content.replace("c.status === 'Lead'", "c.status === 'lead'")
with open('src/screens/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/screens/Clients.tsx', 'r') as f:
    content = f.read()

content = content.replace("<'All' | 'Lead' | 'Active' | 'Past'>", "<'All' | 'lead' | 'active' | 'past'>")
content = content.replace("['All', 'Lead', 'Active', 'Past']", "['All', 'lead', 'active', 'past']")
content = content.replace("client.status === 'Lead'", "client.status === 'lead'")
content = content.replace("clientForm.status !== 'Lead'", "clientForm.status !== 'lead'")
content = content.replace("client.status === 'Active'", "client.status === 'active'")
content = content.replace("status: 'Lead'", "status: 'lead'")

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(content)
