import re

with open('src/screens/Finance.tsx', 'r') as f:
    content = f.read()

# Fix 1: grouping by local date instead of UTC date
old_grouping = """    effectiveRevenues.forEach(r => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;"""
new_grouping = """    effectiveRevenues.forEach(r => {
      const [y, m] = r.date.split('-');
      const key = `${parseInt(y, 10)}-${parseInt(m, 10) - 1}`;"""
content = content.replace(old_grouping, new_grouping)

# Fix 2: local date formatting in recent entries
old_display = "{new Date(r.date).toLocaleDateString()}"
new_display = "{new Date(r.date + 'T00:00:00').toLocaleDateString()}"
content = content.replace(old_display, new_display)

with open('src/screens/Finance.tsx', 'w') as f:
    f.write(content)
