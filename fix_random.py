import re
with open("src/screens/Clients.tsx", "r") as f:
    content = f.read()

content = content.replace("Math.random().toString(36).substring(2, 9)", "generateId()")

with open("src/screens/Clients.tsx", "w") as f:
    f.write(content)
