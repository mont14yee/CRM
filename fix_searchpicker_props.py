import re

for file in ['src/screens/Calendar.tsx', 'src/screens/Finance.tsx']:
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('placeholder="Select a client..."', '')
    content = content.replace('placeholder="Select a project..."', '')

    with open(file, 'w') as f:
        f.write(content)

