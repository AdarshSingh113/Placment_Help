import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Database, 
  Edit3,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Guesstimate, GuesstimateVariable } from '../types';
import { CustomFieldsManager } from '../components/CustomFieldsManager';

export const GuesstimateLabView: React.FC = () => {
  const { 
    guesstimates, 
    addGuesstimate, 
    updateGuesstimate, 
    deleteGuesstimate, 
    duplicateGuesstimate,
    evaluateGuesstimateFormula,
    dataPoints,
    addDataPoint,
    deleteDataPoint
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [selectedGuesstimateId, setSelectedGuesstimateId] = useState<string | null>(
    guesstimates[0]?.id || null
  );
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);
  const [showDataBank, setShowDataBank] = useState(false);

  // New Guesstimate Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('Market Sizing');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newApproach, setNewApproach] = useState('');

  // Macro Bank Add State
  const [showAddMacro, setShowAddMacro] = useState(false);
  const [macroStatName, setMacroStatName] = useState('');
  const [macroVal, setMacroVal] = useState('');
  const [macroUnit, setMacroUnit] = useState('');
  const [macroTopic, setMacroTopic] = useState('Demographics');

  // Key Assumption input
  const [newAssumptionText, setNewAssumptionText] = useState('');

  const selectedGuesstimate = (guesstimates || []).find((g) => g.id === selectedGuesstimateId) || (guesstimates || [])[0];

  const filteredGuesstimates = (guesstimates || []).filter((g) => {
    const matchesSearch = g.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || g.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  // Calculate live formula output
  const calculatedResult = selectedGuesstimate
    ? evaluateGuesstimateFormula(selectedGuesstimate.variables || [], selectedGuesstimate.formula)
    : null;

  // Add variable handler
  const handleAddVariable = () => {
    if (!selectedGuesstimate) return;
    const currentVars = selectedGuesstimate.variables || [];
    const nextIndex = currentVars.length + 1;
    const newVar: GuesstimateVariable = {
      id: `v${nextIndex}`,
      name: `Variable ${nextIndex}`,
      value: 100,
      unit: 'units',
      notes: 'Assumption factor'
    };
    const updatedVars = [...currentVars, newVar];
    const newFormula = selectedGuesstimate.formula
      ? `${selectedGuesstimate.formula} * v${nextIndex}`
      : `v${nextIndex}`;
    updateGuesstimate(selectedGuesstimate.id, {
      variables: updatedVars,
      formula: newFormula
    });
  };

  const handleUpdateVariable = (varId: string, updates: Partial<GuesstimateVariable>) => {
    if (!selectedGuesstimate) return;
    const currentVars = selectedGuesstimate.variables || [];
    const updatedVars = currentVars.map((v) =>
      v.id === varId ? { ...v, ...updates } : v
    );
    updateGuesstimate(selectedGuesstimate.id, { variables: updatedVars });
  };

  const handleDeleteVariable = (varId: string) => {
    if (!selectedGuesstimate) return;
    const currentVars = selectedGuesstimate.variables || [];
    const updatedVars = currentVars.filter((v) => v.id !== varId);
    updateGuesstimate(selectedGuesstimate.id, { variables: updatedVars });
  };

  const handleInjectMacroAsVariable = (dp: { statName: string; numberValue: string | number; unit: string }) => {
    if (!selectedGuesstimate) return;
    const currentVars = selectedGuesstimate.variables || [];
    const nextIndex = currentVars.length + 1;
    // parse clean number
    const numVal = typeof dp.numberValue === 'number' ? dp.numberValue : parseFloat(String(dp.numberValue).replace(/[^0-9.]/g, '')) || 100;
    const newVar: GuesstimateVariable = {
      id: `v${nextIndex}`,
      name: dp.statName,
      value: numVal,
      unit: dp.unit || 'units',
      notes: `Injected from Macro Bank (${dp.numberValue})`
    };
    const updatedVars = [...selectedGuesstimate.variables, newVar];
    const newFormula = selectedGuesstimate.formula
      ? `${selectedGuesstimate.formula} * v${nextIndex}`
      : `v${nextIndex}`;
    updateGuesstimate(selectedGuesstimate.id, {
      variables: updatedVars,
      formula: newFormula
    });
  };

  const handleCreateGuesstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newId = addGuesstimate({
      question: newQuestion.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      approachNotes: newApproach.trim() || 'Top-down / capacity-based sizing structure.',
      variables: [
        { id: 'v1', name: 'Base Population / Units', value: 1000000, unit: 'units', notes: 'Initial target group' },
        { id: 'v2', name: 'Target Penetration / Conversion Rate', value: 0.1, unit: '%', notes: '10% adoption' },
        { id: 'v3', name: 'Average Price / Ticket Size', value: 500, unit: 'INR', notes: 'Average transaction' }
      ],
      formula: 'v1 * v2 * v3',
      confidence: 3,
      practiceCount: 0,
      status: 'In Progress',
      keyAssumptions: [
        'Assumes normal distribution across income brackets',
        'Standard replacement/purchase frequency'
      ]
    });

    setNewQuestion('');
    setNewApproach('');
    setShowCreateModal(false);
    setSelectedGuesstimateId(newId);
  };

  const handleDeleteCurrentGuesstimate = (idToDelete: string) => {
    deleteGuesstimate(idToDelete);
    const remaining = guesstimates.filter(g => g.id !== idToDelete);
    if (remaining.length > 0) {
      setSelectedGuesstimateId(remaining[0].id);
    } else {
      setSelectedGuesstimateId(null);
    }
  };

  return (
    <div id="guesstimate_lab_container" className="space-y-6 animate-in fade-in duration-200">
      <CustomFieldsManager
        entityType="guesstimate"
        isOpen={isFieldManagerOpen}
        onClose={() => setIsFieldManagerOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-emerald-600" />
            <span>Guesstimate Lab & Formula Evaluator</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Build mathematical breakdowns, test variable sensitivities, and master market sizing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDataBank(!showDataBank)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showDataBank
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Macro Data Bank ({dataPoints.length})</span>
          </button>

          <button
            id="btn_add_guesstimate"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Guesstimate</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW GUESSTIMATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Create Custom Guesstimate</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuesstimate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Guesstimate Question / Problem Statement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Estimate the number of commercial flights taking off from Mumbai daily."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Market Sizing">Market Sizing</option>
                    <option value="Capacity Sizing">Capacity Sizing</option>
                    <option value="Revenue Estimation">Revenue Estimation</option>
                    <option value="Supply & Demand">Supply & Demand</option>
                    <option value="Volume Calculation">Volume Calculation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Initial Approach Notes / Framework
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Top-down runway hourly capacity vs bottom-up passenger terminal flow..."
                  value={newApproach}
                  onChange={(e) => setNewApproach(e.target.value)}
                  className="w-full min-h-[96px] px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  Create & Launch Solver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Macro Data Reference Drawer */}
      {showDataBank && (
        <div className="p-5 rounded-2xl bg-neutral-900/95 border border-blue-500/30 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>Macro Benchmark Data Bank ({dataPoints.length} stats)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Authoritative reference values. Click "+ Inject" to copy directly as a variable in your active guesstimate formula.
              </p>
            </div>

            <button
              onClick={() => setShowAddMacro(!showAddMacro)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Benchmark Data</span>
            </button>
          </div>

          {/* Add Macro Inline Form */}
          {showAddMacro && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!macroStatName.trim()) return;
                addDataPoint({
                  statName: macroStatName.trim(),
                  numberValue: macroVal || '100',
                  unit: macroUnit || '',
                  topic: macroTopic || 'Macro Benchmark',
                  context: 'Custom benchmark entered in Guesstimate Lab',
                  howToUse: 'Use directly as baseline in market sizing models.',
                  date: new Date().toISOString().split('T')[0]
                });
                setMacroStatName('');
                setMacroVal('');
                setMacroUnit('');
                setShowAddMacro(false);
              }}
              className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Add Custom Macro Statistic</span>
                <button type="button" onClick={() => setShowAddMacro(false)} className="text-neutral-400 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Metric Name (e.g. India Gen-Z Population)"
                  value={macroStatName}
                  onChange={(e) => setMacroStatName(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 375M)"
                  value={macroVal}
                  onChange={(e) => setMacroVal(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. people)"
                  value={macroUnit}
                  onChange={(e) => setMacroUnit(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMacro(false)}
                  className="px-3 py-1 text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white"
                >
                  Save Stat
                </button>
              </div>
            </form>
          )}

          {/* Macro Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dataPoints.map((dp) => (
              <div
                key={dp.id}
                className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between space-y-2 hover:border-neutral-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="truncate">{dp.topic}</span>
                    <button
                      onClick={() => deleteDataPoint(dp.id)}
                      className="text-neutral-600 hover:text-rose-400 p-0.5"
                      title="Delete Stat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white mt-1 line-clamp-1">{dp.statName}</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    {dp.numberValue} <span className="text-[10px] text-neutral-400 font-normal">{dp.unit}</span>
                  </div>
                </div>

                {selectedGuesstimate && (
                  <button
                    onClick={() => handleInjectMacroAsVariable(dp)}
                    className="w-full py-1 text-[11px] font-bold rounded-lg bg-neutral-800 hover:bg-emerald-600 hover:text-white text-emerald-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>+ Inject Variable</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Workspace Split: Selector & Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Guesstimate List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Filter guesstimates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="text-[11px] bg-neutral-800 text-neutral-300 rounded px-1.5 py-1 border border-neutral-700"
            >
              <option value="All">All Diff</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredGuesstimates.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                No guesstimates found. Click "+ New Guesstimate" to create one.
              </div>
            ) : null}

            {filteredGuesstimates.map((g) => {
              const isSelected = selectedGuesstimate?.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuesstimateId(g.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-xs'
                      : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                      {g.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        g.difficulty === 'Hard' ? 'text-rose-400 bg-rose-950/60' : 'text-amber-400 bg-amber-950/60'
                      }`}>
                        {g.difficulty}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCurrentGuesstimate(g.id);
                        }}
                        className="p-1 text-neutral-500 hover:text-rose-400 rounded hover:bg-rose-950/30 cursor-pointer"
                        title="Delete Guesstimate"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold line-clamp-2">
                    {g.question}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                    <span>{g.variables.length} Variables</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {g.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Interactive Solver (8 cols) */}
        {selectedGuesstimate ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Question Details Header */}
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 uppercase font-mono">
                      {selectedGuesstimate.category}
                    </span>
                    <span className="text-xs text-neutral-400">Confidence: {selectedGuesstimate.confidence}/5 ★</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedGuesstimate.question}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => duplicateGuesstimate(selectedGuesstimate.id)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCurrentGuesstimate(selectedGuesstimate.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                    title="Delete Guesstimate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Approach Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Approach Structure & Methodology:
                  </label>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Markdown / Multi-line supported • Expandable
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={selectedGuesstimate.approachNotes || ''}
                  onChange={(e) => updateGuesstimate(selectedGuesstimate.id, { approachNotes: e.target.value })}
                  placeholder="Outline whether you chose a top-down demographic split, bottom-up capacity sizing, supply-side constraints, throughput assumptions, or peak vs non-peak hourly breakdowns..."
                  className="w-full min-h-[140px] px-3.5 py-3 text-xs sm:text-sm leading-relaxed rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 resize-y transition-all font-sans"
                />
              </div>
            </div>

            {/* LIVE CALCULATION ENGINE BAR */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/40 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Interactive Formula Bar
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={selectedGuesstimate.formula}
                      onChange={(e) => updateGuesstimate(selectedGuesstimate.id, { formula: e.target.value })}
                      placeholder="e.g. v1 * v2 * v3 * v4"
                      className="px-3 py-1.5 text-sm font-mono rounded-lg bg-neutral-950 border border-neutral-700 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 w-64"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-emerald-800/40 text-right">
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Calculated Result
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {calculatedResult !== null ? calculatedResult.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'Error'}
                  </div>
                </div>
              </div>

              {/* Variables Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Step-by-Step Variables ({selectedGuesstimate.variables.length})
                  </h4>
                  <button
                    onClick={handleAddVariable}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Variable</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedGuesstimate.variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40">
                          {variable.id}
                        </span>
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) => handleUpdateVariable(variable.id, { name: e.target.value })}
                          className="text-xs sm:text-sm font-semibold bg-transparent text-white border-b border-transparent focus:border-blue-500 focus:outline-none flex-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={variable.value}
                          onChange={(e) => handleUpdateVariable(variable.id, { value: Number(e.target.value) })}
                          className="w-24 sm:w-28 px-2 py-1 text-xs sm:text-sm font-mono font-bold bg-neutral-900 border border-neutral-700 text-white rounded-lg focus:outline-none focus:border-emerald-500 text-right"
                        />
                        <input
                          type="text"
                          placeholder="unit"
                          value={variable.unit || ''}
                          onChange={(e) => handleUpdateVariable(variable.id, { unit: e.target.value })}
                          className="w-16 sm:w-20 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 text-neutral-300 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={() => handleDeleteVariable(variable.id)}
                          className="p-1 text-neutral-500 hover:text-rose-400 cursor-pointer"
                          title="Delete Variable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Assumptions List */}
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Key Stated Assumptions:
                </h4>
              </div>

              <div className="space-y-2">
                {(selectedGuesstimate.keyAssumptions || []).map((assump, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{assump}</span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = (selectedGuesstimate.keyAssumptions || []).filter((_, i) => i !== idx);
                        updateGuesstimate(selectedGuesstimate.id, { keyAssumptions: updated });
                      }}
                      className="text-neutral-500 hover:text-rose-400 cursor-pointer px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add Assumption Inline Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newAssumptionText.trim()) return;
                    const updated = [...(selectedGuesstimate.keyAssumptions || []), newAssumptionText.trim()];
                    updateGuesstimate(selectedGuesstimate.id, { keyAssumptions: updated });
                    setNewAssumptionText('');
                  }}
                  className="flex items-center gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Add a new assumption (e.g. 5-year replacement rate)..."
                    value={newAssumptionText}
                    onChange={(e) => setNewAssumptionText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-emerald-600 text-neutral-200 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
            <Calculator className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Guesstimate Selected</h3>
            <p className="text-xs text-neutral-400">Select a guesstimate on the left or create a new one to begin sizing.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
            >
              + Create Guesstimate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
