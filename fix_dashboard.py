import re

with open('src/screens/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix search click for client
content = content.replace("goToTab('clients')", "goToClient(c.id)")

# Fix leads format to be honest zero state (e.g. 0 instead of 00)
content = content.replace(
    "const formattedLeads = newLeads.toString().padStart(2, '0');",
    "const formattedLeads = newLeads.toString();"
)

# Fix timezone bug in chart data (since we fixed it in Finance.tsx)
old_finance = """  // Finance Summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let thisMonthRevenue = 0;
  
  revenues.forEach(r => {
    const d = new Date(r.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status === 'Paid') {
      thisMonthRevenue += r.amount;
    }
  });

  const monthName = new Date().toLocaleString('default', { month: 'short' });

  // Calculate chart data (last 6 months)
  const recent6Months = getRecentMonths(6);
  const chartData = recent6Months.map(m => {
    let total = 0;
    revenues.forEach(r => {
      const d = new Date(r.date);
      if (d.getMonth() === m.month && d.getFullYear() === m.year && r.status === 'Paid') {
        total += r.amount;
      }
    });
    return total;
  });"""

new_finance = """  // Finance Summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let thisMonthRevenue = 0;
  
  revenues.forEach(r => {
    if (!r.date) return;
    const [y, mStr] = r.date.split('-');
    if (parseInt(mStr, 10) - 1 === currentMonth && parseInt(y, 10) === currentYear && r.status === 'Paid') {
      thisMonthRevenue += r.amount;
    }
  });

  const monthName = new Date().toLocaleString('default', { month: 'short' });

  // Calculate chart data (last 6 months)
  const recent6Months = getRecentMonths(6);
  const chartData = recent6Months.map(m => {
    let total = 0;
    revenues.forEach(r => {
      if (!r.date) return;
      const [y, mStr] = r.date.split('-');
      if (parseInt(mStr, 10) - 1 === m.month && parseInt(y, 10) === m.year && r.status === 'Paid') {
        total += r.amount;
      }
    });
    return total;
  });"""

content = content.replace(old_finance, new_finance)

with open('src/screens/Dashboard.tsx', 'w') as f:
    f.write(content)
