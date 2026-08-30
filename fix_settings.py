import re

with open('src/screens/Settings.tsx', 'r') as f:
    content = f.read()

# 1. Remove fake trial card
fake_card_regex = r'<div className="bg-surface-neutral rounded-\[24px\] p-5 flex items-center justify-between">.*?</div>'
content = re.sub(fake_card_regex, '', content, flags=re.DOTALL)

# 2. Add confirmation for Category Delete
old_prefs_state = r"const \[newCategoryScope, setNewCategoryScope\] = useState<'task' \| 'event' \| 'revenue'>\('task'\);"
new_prefs_state = '''const [newCategoryScope, setNewCategoryScope] = useState<'task' | 'event' | 'revenue'>('task');
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);'''
content = content.replace(old_prefs_state, new_prefs_state)

old_delete_btn = r"<button onClick=\{\(\) => handleDeleteCategory\(c\.id\)\} className=\"text-tx-muted hover:text-red-500 transition-colors p-2\">\s*<Trash2 size=\{16\} />\s*</button>"
new_delete_btn = '''<button onClick={() => setDeleteCategoryId(c.id)} className="text-tx-muted hover:text-red-500 transition-colors p-2">
                  <Trash2 size={16} />
                </button>'''
content = re.sub(old_delete_btn, new_delete_btn, content)

old_delete_logic = r"const handleDeleteCategory = \(id: string\) => \{\s*updatePreferences\(\{ categories: preferences.categories.filter\(c => c.id !== id\) \}\);\s*\};"
new_delete_logic = '''const handleDeleteCategory = () => {
    if (deleteCategoryId) {
      updatePreferences({ categories: preferences.categories.filter(c => c.id !== deleteCategoryId) });
      setDeleteCategoryId(null);
    }
  };'''
content = re.sub(old_delete_logic, new_delete_logic, content)

# Insert ConfirmDialog for Delete Category
old_end_bottomsheet = r"</BottomSheet>\s*</div>\s*\);\s*\}"
new_end_bottomsheet = '''</BottomSheet>
      <ConfirmDialog
        isOpen={!!deleteCategoryId}
        onCancel={() => setDeleteCategoryId(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        body="Are you sure you want to delete this category?"
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}'''
content = re.sub(old_end_bottomsheet, new_end_bottomsheet, content)

# 3. Fix category scope options
old_options = '''<option value="work">Work</option>
              <option value="personal">Personal</option>'''
new_options = '''<option value="task">Task</option>
              <option value="event">Event</option>
              <option value="revenue">Revenue</option>'''
content = content.replace(old_options, new_options)

# 4. Add confirmation for Import Data
old_settings_state = r"const \[isClearDataOpen, setIsClearDataOpen\] = useState\(false\);"
new_settings_state = '''const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [importDataContent, setImportDataContent] = useState<string | null>(null);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);'''
content = content.replace(old_settings_state, new_settings_state)

old_import_logic = r'''const handleImportData = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{
    const file = e\.target\.files\?\.\[0\];
    if \(!file\) return;
    const reader = new FileReader\(\);
    reader\.onload = \(e\) => \{
      try \{
        const data = JSON\.parse\(e\.target\?\.result as string\);
        for \(const \[key, value\] of Object\.entries\(data\)\) \{
          if \(key\.startsWith\('conneq-'\)\) \{
            localStorage\.setItem\(key, value as string\);
          \}
        \}
        window\.location\.reload\(\);
      \} catch \(err\) \{
        showToast\(\{ message: 'Failed to parse backup file' \}\);
      \}
    \};
    reader\.readAsText\(file\);
  \};'''

new_import_logic = '''const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImportDataContent(e.target?.result as string);
      setIsImportConfirmOpen(true);
    };
    reader.readAsText(file);
    // clear input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = () => {
    if (!importDataContent) return;
    try {
      const data = JSON.parse(importDataContent);
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('conneq-')) {
          localStorage.setItem(key, value as string);
        }
      }
      window.location.reload();
    } catch (err) {
      showToast({ message: 'Failed to parse backup file' });
      setIsImportConfirmOpen(false);
      setImportDataContent(null);
    }
  };'''
content = re.sub(old_import_logic, new_import_logic, content)

old_settings_return_end = r"danger\s*onConfirm=\{handleClearData\}\s*/>\s*</div>\s*\);\s*\}"
new_settings_return_end = '''danger
        onConfirm={handleClearData}
      />

      <ConfirmDialog
        isOpen={isImportConfirmOpen}
        onCancel={() => {
          setIsImportConfirmOpen(false);
          setImportDataContent(null);
        }}
        title="Import Data?"
        body="This will overwrite your existing data. Are you sure you want to proceed?"
        confirmLabel="Yes, import data"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmImport}
      />
    </div>
  );
}'''
content = re.sub(old_settings_return_end, new_settings_return_end, content)

with open('src/screens/Settings.tsx', 'w') as f:
    f.write(content)

