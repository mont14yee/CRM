import re

with open('src/screens/Clients.tsx', 'r') as f:
    content = f.read()

# Replace ClientMessage with MessageItem
content = content.replace('ClientMessage', 'MessageItem')

# Message timestamp -> createdAt
content = content.replace('b.timestamp', 'b.createdAt')
content = content.replace('a.timestamp', 'a.createdAt')
content = content.replace('msg.timestamp', 'msg.createdAt')

# Message content -> body
content = content.replace('msg.content', 'msg.body')
content = content.replace('content: msgInput', 'body: msgInput')

# channel capitalization
content = content.replace("'Note' | 'Email' | 'SMS' | 'Call' | 'Meeting'", "'note' | 'email' | 'sms' | 'call' | 'meeting'")
content = content.replace("['Note', 'Email', 'Call', 'Meeting']", "['note', 'email', 'call', 'meeting']")
content = content.replace("msgChannel === ch", "msgChannel === ch") # stays same
content = content.replace("setMsgChannel('Note')", "setMsgChannel('note')")

# Remove isOutbound
content = content.replace('      isOutbound: true\n', '')

# Client form updates
content = content.replace(
"""  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead' as 'Lead' | 'Active' | 'Past',
  });""",
"""  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'lead' as 'lead' | 'active' | 'past',
    tags: [] as string[],
    notes: '',
  });"""
)

# Fix status options
content = content.replace(
"    status: 'Lead' as 'Lead' | 'Active' | 'Past',",
"    status: 'lead' as 'lead' | 'active' | 'past',"
)
content = content.replace(
"['Lead', 'Active', 'Past']",
"['lead', 'active', 'past']"
)
content = content.replace("status: 'Lead'", "status: 'lead'")

# Add avatarSeed and createdAt on client creation
content = content.replace("addClient(clientForm);", "addClient({...clientForm, avatarSeed: Math.random().toString(36).substring(2, 9), createdAt: new Date().toISOString()});")

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(content)

