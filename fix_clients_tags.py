import re

with open('src/screens/Clients.tsx', 'r') as f:
    content = f.read()

content = content.replace("selectedClient.tags.length > 0", "(selectedClient.tags || []).length > 0")
content = content.replace("selectedClient.tags.map", "(selectedClient.tags || []).map")
content = content.replace("c.tags.some", "(c.tags || []).some")

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(content)
