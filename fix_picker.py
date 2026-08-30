import re

with open('src/screens/Tasks.tsx', 'r') as f:
    content = f.read()

content = content.replace("onAddCategory={() => addCategory({ label: 'New Category', color: '#888E80', scope: 'task' })}", "onAddCategory={addCategory}")
with open('src/screens/Tasks.tsx', 'w') as f:
    f.write(content)

with open('src/screens/Calendar.tsx', 'r') as f:
    content = f.read()

content = content.replace("onAddCategory={() => addCategory({ label: 'New Category', color: '#888E80', scope: 'event' })}", "onAddCategory={addCategory}")
with open('src/screens/Calendar.tsx', 'w') as f:
    f.write(content)

with open('src/components/BottomSheet.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ReactNode } from 'react';", "import React, { ReactNode, useState } from 'react';")

old_picker = """export function CategoryPicker({
  value,
  onChange,
  scope,
  categories,
  onAddCategory,
}: {
  value: string;
  onChange: (id: string) => void;
  scope: 'task' | 'event' | 'revenue';
  categories: any[];
  onAddCategory: () => void;
}) {
  const filtered = categories.filter((c) => c.scope === scope);

  return (
    <div className="flex flex-wrap gap-2">
      {filtered.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
            value === cat.id 
              ? 'bg-tx-primary text-tx-inverse border-tx-primary' 
              : 'bg-canvas text-tx-primary border-bd-subtle'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.label}
          </div>
        </button>
      ))}
      <button
        onClick={onAddCategory}
        className="px-3 py-1.5 rounded-full text-[13px] font-medium bg-surface-neutral text-tx-primary border border-transparent"
      >
        + New
      </button>
    </div>
  );
}"""

new_picker = """export function CategoryPicker({
  value,
  onChange,
  scope,
  categories,
  onAddCategory,
}: {
  value: string;
  onChange: (id: string) => void;
  scope: 'task' | 'event' | 'revenue';
  categories: any[];
  onAddCategory: (category: any) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const filtered = categories.filter((c) => c.scope === scope);

  const handleAdd = () => {
    if (newLabel.trim()) {
      onAddCategory({ label: newLabel.trim(), color: '#888E80', scope });
      setNewLabel('');
    }
    setIsAdding(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filtered.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
            value === cat.id 
              ? 'bg-tx-primary text-tx-inverse border-tx-primary' 
              : 'bg-canvas text-tx-primary border-bd-subtle'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.label}
          </div>
        </button>
      ))}
      {isAdding ? (
        <div className="flex items-center gap-1">
          <input 
            autoFocus
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Name..."
            className="px-3 py-1.5 rounded-full text-[13px] bg-canvas text-tx-primary border border-bd-subtle outline-none w-24"
          />
          <button onClick={handleAdd} className="px-3 py-1.5 rounded-full bg-tx-primary text-tx-inverse text-[13px] font-medium">
             Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1.5 rounded-full text-[13px] font-medium bg-surface-neutral text-tx-primary border border-transparent"
        >
          + New
        </button>
      )}
    </div>
  );
}"""

content = content.replace(old_picker, new_picker)
with open('src/components/BottomSheet.tsx', 'w') as f:
    f.write(content)
