import re

with open('src/screens/Projects.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "clients.find(c => c.id === proj.clientId)?.avatarUrl || `https://i.pravatar.cc/150?u=${proj.clientId}`",
    "`https://api.dicebear.com/7.x/notionists/svg?seed=${clients.find(c => c.id === proj.clientId)?.avatarSeed || proj.clientId}`"
)
content = content.replace(
    "`https://i.pravatar.cc/150?u=${proj.id}`",
    "`https://api.dicebear.com/7.x/notionists/svg?seed=${proj.id}`"
)

with open('src/screens/Projects.tsx', 'w') as f:
    f.write(content)
