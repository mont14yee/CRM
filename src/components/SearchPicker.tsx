import { useState } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';

export interface PickerItem {
  id: string;
  label: string;
  color?: string;
}

export function SearchPicker({
  items,
  value,
  onChange,
  onCreateNew,
  placeholder = 'Search or select...',
}: {
  items: PickerItem[];
  value: string | null;
  onChange: (id: string) => void;
  onCreateNew?: (label: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedItem = items.find(i => i.id === value);

  const filteredItems = items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));
  const showCreate = onCreateNew && search.trim() !== '' && !items.some(i => i.label.toLowerCase() === search.trim().toLowerCase());

  // Show compact chip when closed with a valid selection
  if (!isOpen && selectedItem) {
    return (
      <button 
        type="button"
        onClick={() => setIsOpen(true)} 
        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-neutral text-tx-primary rounded-full text-[14px] font-medium active:opacity-80 transition-opacity w-fit"
      >
        {selectedItem.color && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedItem.color }} />}
        {selectedItem.label}
        <ChevronDown size={16} className="text-tx-muted ml-1" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 bg-surface-neutral rounded-xl px-4 py-3 border border-transparent focus-within:border-bd-subtle transition-colors">
        <Search size={18} className="text-tx-muted shrink-0" />
        <input 
          autoFocus={isOpen}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-tx-primary"
        />
        {(isOpen && selectedItem) && (
          <button type="button" onClick={() => { setIsOpen(false); setSearch(''); }} className="p-1 text-tx-muted hover:text-tx-primary shrink-0">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col max-h-48 overflow-y-auto no-scrollbar rounded-xl border border-bd-subtle bg-canvas">
        {filteredItems.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onChange(item.id);
              setIsOpen(false);
              setSearch('');
            }}
            className="flex items-center justify-between px-4 py-3 border-b border-bd-subtle/50 last:border-b-0 hover:bg-surface-neutral active:bg-surface-neutral text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {item.color && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />}
              <span className="text-[15px] font-medium text-tx-primary">{item.label}</span>
            </div>
            {value === item.id && <Check size={18} className="text-tx-primary shrink-0" />}
          </button>
        ))}
        {showCreate && (
          <button
            type="button"
            onClick={() => {
              if (onCreateNew) {
                onCreateNew(search.trim());
              }
              setIsOpen(false);
              setSearch('');
            }}
            className="flex items-center gap-2 px-4 py-3 hover:bg-surface-neutral active:bg-surface-neutral text-left transition-colors text-tx-primary"
          >
            <span className="text-[15px] font-medium">Create <span className="font-semibold">"{search.trim()}"</span></span>
          </button>
        )}
        {filteredItems.length === 0 && !showCreate && (
          <div className="px-4 py-6 text-center text-tx-muted text-[14px]">No results found.</div>
        )}
      </div>
    </div>
  );
}
