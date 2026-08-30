import re
with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace(
    "reminder?: number;\n}",
    "reminder?: number;\n  clientId?: string;\n}"
)
content = content.replace(
    "'tools' | 'clients' | 'clients' | 'profile'",
    "'tools' | 'clients' | 'profile'"
)

with open("src/types.ts", "w") as f:
    f.write(content)
