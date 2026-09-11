import { Search, Plus } from 'lucide-react';

export default function PageToolbar({ searchValue, onSearchChange, placeholder, onCreateClick, createLabel }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-9"
        />
      </div>
      {onCreateClick && (
        <button onClick={onCreateClick} className="btn-primary shrink-0">
          <Plus size={16} />
          {createLabel}
        </button>
      )}
    </div>
  );
}
