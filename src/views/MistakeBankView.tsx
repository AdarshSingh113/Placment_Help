import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Edit3, 
  X,
  Sparkles, 
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MistakeItem } from '../types';
import { CustomFieldsManager } from '../components/CustomFieldsManager';

export const MistakeBankView: React.FC = () => {
  const { 
    mistakes, 
    addMistake, 
    updateMistake, 
    deleteMistake, 
    incrementMistakeFrequency 
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>((mistakes || [])[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);

  // New Mistake Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Interview');
  const [newWhatIDid, setNewWhatIDid] = useState('');
  const [newWhatIShouldHaveDone, setNewWhatIShouldHaveDone] = useState('');
  const [newWhyIMadeIt, setNewWhyIMadeIt] = useState('');
  const [newHowToAvoid, setNewHowToAvoid] = useState('');

  const selectedMistake = (mistakes || []).find((m) => m.id === selectedMistakeId) || (mistakes || [])[0];

  const categories = ['All', 'Interview', 'Guesstimate', 'Case', 'GD', 'Communication', 'Domain'];
  const statuses = ['All', 'New', 'Under Review', 'Resolved', 'Recurring'];

  const filteredMistakes = (mistakes || []).filter((m) => {
    const matchesSearch = m.mistakeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.whatIDid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.howToAvoid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = addMistake({
      mistakeTitle: newTitle.trim(),
      category: newCategory,
      whatIDid: newWhatIDid.trim() || 'Described flawed move or impulse response.',
      whatIShouldHaveDone: newWhatIShouldHaveDone.trim() || 'Structured approach to take instead.',
      correctApproach: newWhatIShouldHaveDone.trim() || 'Structured approach to take instead.',
      whyIMadeIt: newWhyIMadeIt.trim() || 'Lack of structured pause or nervous impulse.',
      howToAvoid: newHowToAvoid.trim() || 'Defensive trigger rule to prevent recurrence.',
      frequency: 1,
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    });

    setNewTitle('');
    setNewWhatIDid('');
    setNewWhatIShouldHaveDone('');
    setNewWhyIMadeIt('');
    setNewHowToAvoid('');
    setShowAddModal(false);
    setSelectedMistakeId(newId);
    setIsEditing(false);
  };

  const handleDeleteCurrentMistake = (idToDelete: string) => {
    deleteMistake(idToDelete);
    const remaining = mistakes.filter(m => m.id !== idToDelete);
    if (remaining.length > 0) {
      setSelectedMistakeId(remaining[0].id);
    } else {
      setSelectedMistakeId(null);
    }
  };

  return (
    <div id="mistake_bank_container" className="space-y-6 animate-in fade-in duration-200">
      <CustomFieldsManager
        entityType="mistake"
        isOpen={isFieldManagerOpen}
        onClose={() => setIsFieldManagerOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>Mistake Bank & Corrective Action OS</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Log custom mock interview errors, guesstimate oversights, and institutional corrective rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn_add_mistake"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 transition-all cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Custom Mistake</span>
          </button>
        </div>
      </div>

      {/* CREATE MISTAKE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Log New Learning / Mistake</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMistake} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Mistake Title / Pattern Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jumping to conclusions without asking clarifying questions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                >
                  <option value="Interview">Interview & HR</option>
                  <option value="Guesstimate">Guesstimate & Numbers</option>
                  <option value="Case">Case / GTM / Strategy</option>
                  <option value="GD">GD & Debate</option>
                  <option value="Communication">Communication & Body Language</option>
                  <option value="Domain">Domain / Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  ❌ What I Did (The Flawed Move)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Assumed market was entire population without segmenting age demographics..."
                  value={newWhatIDid}
                  onChange={(e) => setNewWhatIDid(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  ✓ Correct Approach (What to do instead)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Write down demographic pyramid: 0-14, 15-64, 65+ before multiplying..."
                  value={newWhatIShouldHaveDone}
                  onChange={(e) => setNewWhatIShouldHaveDone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    🔍 Root Cause (Why I made it)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nervousness, rushed tempo..."
                    value={newWhyIMadeIt}
                    onChange={(e) => setNewWhyIMadeIt(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    🛡️ Actionable Rule to Avoid
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Always take 30s silence before math..."
                    value={newHowToAvoid}
                    onChange={(e) => setNewHowToAvoid(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 cursor-pointer"
                >
                  Save to Mistake Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search mistakes by error description, corrective rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-neutral-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-neutral-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Split View: List vs Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mistake List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[650px] overflow-y-auto custom-scrollbar">
          {filteredMistakes.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-900/50 rounded-2xl border border-neutral-800">
              No mistakes logged. Click "+ Log Custom Mistake" to record one.
            </div>
          ) : null}

          {filteredMistakes.map((m) => {
            const isSelected = selectedMistake?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMistakeId(m.id);
                  setIsEditing(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-950/20 border-rose-500/50 text-white shadow-xs'
                    : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-rose-300 font-mono">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      m.status === 'Resolved'
                        ? 'bg-emerald-950 text-emerald-300'
                        : m.status === 'Recurring'
                        ? 'bg-rose-950 text-rose-300 animate-pulse'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {m.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCurrentMistake(m.id);
                      }}
                      className="p-1 text-neutral-500 hover:text-rose-400 rounded hover:bg-rose-950/30 cursor-pointer"
                      title="Delete Mistake"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-semibold line-clamp-2">
                  {m.mistakeTitle}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                  <span className="font-mono">Freq: {m.frequency}x</span>
                  <span>{m.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Mistake Detail & Corrective Action Guide (8 cols) */}
        {selectedMistake ? (
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase">
                    <span>{selectedMistake.category}</span>
                    <span>• Logged: {selectedMistake.date}</span>
                    <span>• Occurred: {selectedMistake.frequency} times</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedMistake.mistakeTitle}
                      onChange={(e) => updateMistake(selectedMistake.id, { mistakeTitle: e.target.value })}
                      className="text-lg sm:text-xl font-bold text-white mt-1 w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1"
                    />
                  ) : (
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {selectedMistake.mistakeTitle}
                    </h2>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isEditing
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'text-neutral-400 hover:text-white border-neutral-700 bg-neutral-800'
                    }`}
                    title={isEditing ? 'Done Editing' : 'Edit Mistake Details'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => incrementMistakeFrequency(selectedMistake.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
                    title="Repeat occurrence (+1)"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>+1 Repeat</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextStatus = selectedMistake.status === 'Resolved' ? 'Under Review' : 'Resolved';
                      updateMistake(selectedMistake.id, { status: nextStatus });
                    }}
                    className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedMistake.status === 'Resolved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedMistake.status === 'Resolved' ? 'Resolved ✓' : 'Mark Resolved'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCurrentMistake(selectedMistake.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                    title="Delete Mistake Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Anatomy of Mistake Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What I Did */}
                <div className="p-4 rounded-xl bg-neutral-950/70 border border-rose-800/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    ❌ What I Did (The Flawed Move)
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={selectedMistake.whatIDid}
                      onChange={(e) => updateMistake(selectedMistake.id, { whatIDid: e.target.value })}
                      className="w-full text-xs text-white bg-neutral-900 border border-neutral-700 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-wrap">
                      {selectedMistake.whatIDid}
                    </p>
                  )}
                </div>

                {/* Correct Approach */}
                <div className="p-4 rounded-xl bg-neutral-950/70 border border-emerald-800/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    ✓ Correct Approach (What to do instead)
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={selectedMistake.correctApproach || selectedMistake.whatIShouldHaveDone}
                      onChange={(e) => updateMistake(selectedMistake.id, { 
                        correctApproach: e.target.value,
                        whatIShouldHaveDone: e.target.value 
                      })}
                      className="w-full text-xs text-white bg-neutral-900 border border-neutral-700 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-wrap">
                      {selectedMistake.correctApproach || selectedMistake.whatIShouldHaveDone}
                    </p>
                  )}
                </div>

                {/* Why I Made It */}
                <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    🔍 Root Cause Analysis
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={selectedMistake.whyIMadeIt || ''}
                      onChange={(e) => updateMistake(selectedMistake.id, { whyIMadeIt: e.target.value })}
                      className="w-full text-xs text-white bg-neutral-900 border border-neutral-700 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-wrap">
                      {selectedMistake.whyIMadeIt || 'Time crunch and lack of habituated muscle memory.'}
                    </p>
                  )}
                </div>

                {/* How to Avoid */}
                <div className="p-4 rounded-xl bg-neutral-950/70 border border-blue-800/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    🛡️ Actionable Rule to Avoid
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={selectedMistake.howToAvoid}
                      onChange={(e) => updateMistake(selectedMistake.id, { howToAvoid: e.target.value })}
                      className="w-full text-xs text-white bg-neutral-900 border border-neutral-700 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-wrap font-medium">
                      {selectedMistake.howToAvoid}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Mistake Selected</h3>
            <p className="text-xs text-neutral-400">Select an item on the left or log a new mistake to see the corrective guide.</p>
          </div>
        )}
      </div>
    </div>
  );
};
