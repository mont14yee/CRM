import re

with open('src/screens/Clients.tsx', 'r') as f:
    content = f.read()

# 1. revenues instead of entries
content = content.replace('const { entries } = useRevenue();', 'const { revenues } = useRevenue();')
content = content.replace('entries.filter(', 'revenues.filter(')

# 2. avatarSeed and createdAt for addClient
content = content.replace(
    "import { formatCurrency, formatCurrencyCompact, getCurrencySymbol } from '../utils/currency';",
    "import { formatCurrency, formatCurrencyCompact, getCurrencySymbol } from '../utils/currency';\nimport { generateId } from '../utils/id';"
)
content = content.replace(
    'addClient(form);',
    "addClient({ ...form, avatarSeed: generateId(), createdAt: new Date().toISOString() });"
)

# 3. Header children -> rightIcon
header_start = content.find('<Header title="Clients">')
header_end = content.find('</Header>') + len('</Header>')
if header_start != -1:
    old_header = content[header_start:header_end]
    new_header = old_header.replace('<Header title="Clients">', '<Header title="Clients" rightIcon={<>')
    new_header = new_header.replace('</Header>', '>} />')
    content = content[:header_start] + new_header + content[header_end:]

with open('src/screens/Clients.tsx', 'w') as f:
    f.write(content)
