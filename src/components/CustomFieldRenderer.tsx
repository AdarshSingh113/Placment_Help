import React from 'react';
import { CustomFieldDefinition, CustomFieldValues } from '../types';

interface CustomFieldInputProps {
  field: CustomFieldDefinition;
  value: any;
  onChange: (val: any) => void;
}

export const CustomFieldInput: React.FC<CustomFieldInputProps> = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'long_text':
    case 'rich_text':
      return (
        <textarea
          rows={3}
          placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}...`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      );

    case 'number':
    case 'percentage':
      return (
        <input
          type="number"
          placeholder={field.placeholder || '0'}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      );

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
        />
      );

    case 'url':
      return (
        <input
          type="url"
          placeholder={field.placeholder || 'https://...'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      );

    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-blue-600 focus:ring-0"
          />
          <span>{field.name}</span>
        </label>
      );

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">-- Select {field.name} --</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case 'rating':
      return (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                (value || 0) >= star
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {star}★
            </button>
          ))}
        </div>
      );

    case 'tags':
    case 'multi_select':
      const currentTags: string[] = Array.isArray(value) ? value : [];
      return (
        <div>
          <input
            type="text"
            placeholder="Type tag & press Enter (or comma-separated)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const val = (e.currentTarget.value || '').trim().replace(/,/g, '');
                if (val && !currentTags.includes(val)) {
                  onChange([...currentTags, val]);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/50 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onChange(currentTags.filter((t) => t !== tag))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case 'text':
    default:
      return (
        <input
          type="text"
          placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}...`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      );
  }
};

interface CustomFieldDisplayProps {
  field: CustomFieldDefinition;
  value: any;
}

export const CustomFieldDisplay: React.FC<CustomFieldDisplayProps> = ({ field, value }) => {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
        {field.name}
      </div>
      <div className="text-sm text-neutral-200">
        {field.type === 'url' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            {value}
          </a>
        ) : field.type === 'checkbox' ? (
          <span>{value ? '✓ Yes / Enabled' : '✗ No / Disabled'}</span>
        ) : field.type === 'rating' ? (
          <span className="text-amber-400 font-bold">{value} / 5 ★</span>
        ) : Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map((v: string) => (
              <span key={v} className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-xs border border-blue-800/40">
                {v}
              </span>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{String(value)}</div>
        )}
      </div>
    </div>
  );
};
