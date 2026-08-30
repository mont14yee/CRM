import re

with open('src/context/MessagesContext.tsx', 'r') as f:
    content = f.read()

content = content.replace('ClientMessage', 'MessageItem')
content = content.replace('timestamp', 'createdAt')

with open('src/context/MessagesContext.tsx', 'w') as f:
    f.write(content)
