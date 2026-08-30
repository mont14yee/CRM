import re
with open("src/screens/Clients.tsx", "r") as f:
    content = f.read()

content = content.replace("useState<'note' | 'email' | 'sms' | 'call' | 'meeting'>('Note')", "useState<'note' | 'email' | 'sms' | 'call' | 'meeting'>('note')")

with open("src/screens/Clients.tsx", "w") as f:
    f.write(content)
