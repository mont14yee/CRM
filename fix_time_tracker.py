import re

with open('src/screens/TimeTracker.tsx', 'r') as f:
    content = f.read()

# Fix rounding in handleSave
old_handle_save = """  const handleSave = () => {
    const parts = manualDuration.split(':');
    let totalSecs = elapsedSeconds;
    if (parts.length === 3) {
      totalSecs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    if (editingEntry) {"""

new_handle_save = """  const handleSave = () => {
    const parts = manualDuration.split(':');
    let totalSecs = elapsedSeconds;
    if (parts.length === 3) {
      totalSecs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    // Ensure rounding applies even if user manually typed an exact unrounded time
    const incrementSeconds = (preferences.roundingIncrementMinutes || 1) * 60;
    if (incrementSeconds > 0) {
      totalSecs = Math.ceil(totalSecs / incrementSeconds) * incrementSeconds;
    }

    if (editingEntry) {"""

content = content.replace(old_handle_save, new_handle_save)

with open('src/screens/TimeTracker.tsx', 'w') as f:
    f.write(content)

with open('src/context/TimeTrackerContext.tsx', 'r') as f:
    content = f.read()

# Add a one-time migration for date->startedAt, notes->note
migration_effect = """  React.useEffect(() => {
    let migrated = false;
    const migratedEntries = timeEntries.map((e: any) => {
      let changed = false;
      const newE = { ...e };
      if (newE.date && !newE.startedAt) {
        newE.startedAt = newE.date;
        delete newE.date;
        changed = true;
      }
      if (newE.notes !== undefined && newE.note === undefined) {
        newE.note = newE.notes;
        delete newE.notes;
        changed = true;
      }
      if (changed) migrated = true;
      return newE;
    });
    if (migrated) {
      setTimeEntries(migratedEntries);
    }
  }, [timeEntries, setTimeEntries]);

  const addTimeEntry"""

content = content.replace("  const addTimeEntry", migration_effect)

with open('src/context/TimeTrackerContext.tsx', 'w') as f:
    f.write(content)
