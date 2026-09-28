import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Sliders, Check } from 'lucide-react';
import { CustomFieldDefinition, CustomFieldType } from '../types';
import { useData } from '../context/DataContext';

interface CustomFieldsManagerProps {
  entityType: 'company' | 'question' | 'gdTopic' | 'guesstimate' | 'mistake';
  isOpen: boolean;
  onClose: () => void;
}

export const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({
  entityType,
  isOpen,
  onClose
}) => {
  const { customFields, addCustomField, updateCustomField, deleteCustomField } = useData();

  const [isAdding, setIsAdding] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // New field state
  const [name, setName] = useState('');
  const [type, setType] = useState<CustomFieldType>('text');
  const [placeholder, setPlaceholder] = useState('');
  const [optionsStr, setOptionsStr] = useState('');

  const entityFields = (customFields || []).filter((f) => f.entityType === entityType);

  if (!isOpen) return null;

  const handleSaveNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const options = (type === 'dropdown' || type === 'multi_select') && optionsStr.trim()
      ? optionsStr.split(',').map((o) => o.trim()).filter(Boolean)
      : undefined;

    if (editingFieldId) {
      updateCustomField(editingFieldId, {
        name,
        type,
        placeholder,
        options
      });
      setEditingFieldId(null);
    } else {
      addCustomField({
        name,
        type,
        placeholder,
        options,
        entityType
      });
    }

    setName('');
    setType('text');
    setPlaceholder('');
    setOptionsStr('');
    setIsAdding(false);
  };

  const handleStartEdit = (field: CustomFieldDefinition) => {
    setEditingFieldId(field.id);
    setName(field.name);
    setType(field.type);
    setPlaceholder(field.placeholder || '');
    setOptionsStr(field.options ? field.options.join(', ') : '');
    setIsAdding(true);
  };

  const fieldTypeOptions: { value: CustomFieldType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'long_text', label: 'Long Text / Paragraph' },
    { value: 'number', label: 'Number' },
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'date', label: 'Date' },
    { value: 'url', label: 'Web URL' },
    { value: 'dropdown', label: 'Dropdown Select' },
    { value: 'multi_select', label: 'Multi-Select Tags' },
    { value: 'checkbox', label: 'Checkbox (Boolean)' },
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'tags', label: 'Tags Array' },
    { value: 'rich_text', label: 'Rich Text' }
  ];

  return (
    <div 
      id="custom_fields_modal_backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">
                Field Manager: {entityType}
              </h3>
              <p className="text-xs text-neutral-400">
                Add, rename, delete or reconfigure dynamic fields for this database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* Active Fields List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Configured Custom Fields ({entityFields.length})
              </h4>
              {!isAdding && (
                <button
                  onClick={() => {
                    setEditingFieldId(null);
                    setName('');
                    setType('text');
                    setPlaceholder('');
                    setOptionsStr('');
                    setIsAdding(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Field
                </button>
              )}
            </div>

            {entityFields.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-neutral-950/50 border border-dashed border-neutral-800 text-neutral-400 text-xs">
                No custom fields defined for {entityType} yet. Click "Add Field" to create your first custom attribute.
              </div>
            ) : (
              <div className="space-y-2">
                {entityFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{field.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 uppercase font-mono">
                          {field.type}
                        </span>
                        {field.placeholder && (
                          <span className="text-[11px] text-neutral-400 truncate max-w-xs">
                            Placeholder: "{field.placeholder}"
                          </span>
                        )}
                        {field.options && (
                          <span className="text-[11px] text-neutral-400">
                            ({field.options.length} options)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(field)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-700"
                        title="Edit Field"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomField(field.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/50"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAdding && (
            <form onSubmit={handleSaveNewField} className="p-4 rounded-xl bg-neutral-950/80 border border-blue-500/40 space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold text-blue-400 uppercase">
                  {editingFieldId ? 'Edit Custom Field' : 'Create New Custom Field'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-neutral-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Field Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Recent Acquisition, CEO, Revenue, Market Share"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Field Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CustomFieldType)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    {fieldTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Placeholder (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Enter revenue number..."
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {(type === 'dropdown' || type === 'multi_select') && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Options (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tier 1, Tier 2, Tier 3"
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingFieldId ? 'Update Field' : 'Create Field'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400">
          <span>Changes apply dynamically to all records in {entityType}.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
