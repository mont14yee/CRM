import re

with open('src/screens/Calendar.tsx', 'r') as f:
    content = f.read()

# Modify sortedDates to filter for upcoming events in Agenda view
old_sorted_dates = 'const sortedDates = Array.from(eventsByDate.keys()).sort();'
new_sorted_dates = '''const todayStr = getTodayDateStr();
  const sortedDates = Array.from(eventsByDate.keys())
    .filter(date => tab === 'Month' || date >= todayStr)
    .sort();'''

content = content.replace(old_sorted_dates, new_sorted_dates)

with open('src/screens/Calendar.tsx', 'w') as f:
    f.write(content)

