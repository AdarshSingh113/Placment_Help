import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Sliders, 
  ExternalLink, 
  Calendar, 
  Trash2, 
  Copy, 
  Edit3, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Mic2, 
  TrendingUp, 
  Flame,
  Clock,
  ChevronRight,
  BookOpen,
  Target,
  PenLine,
  X,
  Save,
  FileText,
  Newspaper
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Company, CustomFieldDefinition } from '../types';
import { CustomFieldsManager } from '../components/CustomFieldsManager';
import { CustomFieldInput, CustomFieldDisplay } from '../components/CustomFieldRenderer';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { triggerMicroBurst } from '../utils/confetti';

export const PlacementView: React.FC = () => {
  const { 
    companies, 
    addCompany, 
    updateCompany, 
    deleteCompany, 
    duplicateCompany, 
    toggleCompanyFavorite,
    selectedCompanyId, 
    setSelectedCompanyId,
    questions,
    addQuestion,
    updateQuestion,
    customFields,
    news,
    setPracticeModalQuestionId,
    setActiveView
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'prep' | 'date'>('prep');
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'research' | 'questions' | 'notes' | 'preInterview'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingResearch, setIsEditingResearch] = useState(true);
  const [editingAnswerQuestionId, setEditingAnswerQuestionId] = useState<string | null>(null);
  const [draftAnswerText, setDraftAnswerText] = useState<string>('');
  const [companyDraft, setCompanyDraft] = useState<Partial<Company>>({});

  // Inline rename state for company cards in listing
  const [renamingCompanyId, setRenamingCompanyId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  // Add Company Modal state
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('Consulting');
  const [newCompanyRole, setNewCompanyRole] = useState('Associate');
  const [newCompanyStatus, setNewCompanyStatus] = useState<Company['status']>('Target');

  // New question in company tab
  const [newCompQuestion, setNewCompQuestion] = useState('');

  // Selected company object
  const selectedCompany = (companies || []).find((c) => c.id === selectedCompanyId);

  // Sync draft state with selected company (preserves edits when switching views)
  useEffect(() => {
    if (selectedCompany) {
      setCompanyDraft({ ...selectedCompany });
    }
  }, [selectedCompany?.id]);

  // Helper to update draft and auto-save immediately to context silently
  const handleUpdateCompanyDraft = (updates: Partial<Company>, autoSave = true) => {
    setCompanyDraft((prev) => ({ ...prev, ...updates }));
    if (autoSave && selectedCompany) {
      updateCompany(selectedCompany.id, updates, true);
    }
  };

  // Helper to commit draft with visual feedback
  const handleSaveCompanyChanges = (message = 'Company details saved successfully') => {
    if (!selectedCompany) return;
    updateCompany(selectedCompany.id, companyDraft, false);
    triggerMicroBurst();
  };

  // Filtered companies list
  const industries = ['All', ...Array.from(new Set((companies || []).map((c) => c.industry).filter(Boolean)))];
  const statuses = ['All', 'Target', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Archived'];

  const filteredCompanies = (companies || []).filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.whyThisCompany && c.whyThisCompany.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = industryFilter === 'All' || c.industry === industryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'prep') return b.prepProgress - a.prepProgress;
    if (sortBy === 'date') return (a.interviewDate || '9999').localeCompare(b.interviewDate || '9999');
    return 0;
  });

  const companyFields = (customFields || []).filter((f) => f.entityType === 'company');

  // Linked questions for selected company (case-insensitive name or ID)
  const companyQuestions = (questions || []).filter((q) => {
    if (!selectedCompany) return false;
    if (q.companyId && (q.companyId === selectedCompany.id || q.companyId === selectedCompanyId)) return true;
    if (q.companyName && selectedCompany.name && q.companyName.trim().toLowerCase() === selectedCompany.name.trim().toLowerCase()) return true;
    return false;
  });

  const handleAddQuestionForCompany = (e?: React.FormEvent, customQuestionText?: string) => {
    if (e) e.preventDefault();
    if (!selectedCompany) return;

    const questionText = (customQuestionText !== undefined ? customQuestionText : newCompQuestion).trim();
    const effectiveQuestion = questionText || `Why are you interested in joining ${selectedCompany.name}, and what unique strengths do you bring?`;

    const newId = addQuestion({
      question: effectiveQuestion,
      category: 'Company-Specific',
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      difficulty: 'Medium',
      confidence: 3,
      status: 'Needs Practice',
      practiceCount: 0,
      tags: [selectedCompany.name, 'Company-Specific']
    });
    setNewCompQuestion('');
    // Automatically open answer editor so candidate can write their answer immediately!
    setEditingAnswerQuestionId(newId);
    setDraftAnswerText('');
    triggerMicroBurst();
  };

  const calculateDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date('2026-08-24T12:54:55');
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div id="placement_view_container" className="space-y-6 animate-in fade-in duration-200">
      {/* Field Manager Modal */}
      <CustomFieldsManager
        entityType="company"
        isOpen={isFieldManagerOpen}
        onClose={() => setIsFieldManagerOpen(false)}
      />

      {/* Add Company Modal */}
      <AnimatePresence>
        {isAddCompanyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Add Target Company</h3>
                    <p className="text-xs text-neutral-400">Set up company workspace for placement interview prep</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCompanyModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const nameToUse = newCompanyName.trim();
                  if (!nameToUse) return;
                  triggerMicroBurst();
                  const newId = addCompany({
                    name: nameToUse,
                    industry: newCompanyIndustry || 'Consulting',
                    role: newCompanyRole || 'Associate',
                    status: newCompanyStatus,
                    prepProgress: 20
                  });
                  setIsAddCompanyModalOpen(false);
                  setSelectedCompanyId(newId);
                  setIsEditing(false);
                  setIsEditingResearch(true);
                }}
                className="p-5 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. McKinsey & Company, Google, Goldman Sachs..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-semibold text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={newCompanyIndustry}
                      onChange={(e) => setNewCompanyIndustry(e.target.value)}
                      placeholder="e.g. Consulting, Tech, Banking..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={newCompanyRole}
                      onChange={(e) => setNewCompanyRole(e.target.value)}
                      placeholder="e.g. Associate, Product Manager..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Application Status
                  </label>
                  <select
                    value={newCompanyStatus}
                    onChange={(e) => setNewCompanyStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsAddCompanyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Company & Open</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL WORKSPACE VIEW */}
      {selectedCompany ? (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xs">
            <div className="flex items-start gap-4 flex-1">
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  setIsEditing(false);
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800/80 hover:bg-neutral-800 transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={companyDraft.name !== undefined ? companyDraft.name : selectedCompany.name}
                        onChange={(e) => handleUpdateCompanyDraft({ name: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmed = (companyDraft.name || selectedCompany.name).trim();
                            if (trimmed) {
                              updateCompany(selectedCompany.id, { ...companyDraft, name: trimmed }, false);
                            }
                            setIsEditing(false);
                          } else if (e.key === 'Escape') {
                            setCompanyDraft({ ...selectedCompany });
                            setIsEditing(false);
                          }
                        }}
                        placeholder="Company Name (e.g. McKinsey, Google)..."
                        className="text-lg sm:text-2xl font-bold px-3 py-1.5 rounded-xl bg-neutral-950 border-2 border-blue-500 text-white focus:outline-none w-full max-w-md shadow-inner"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = (companyDraft.name || selectedCompany.name).trim();
                          if (trimmed) {
                            updateCompany(selectedCompany.id, { ...companyDraft, name: trimmed }, false);
                          }
                          setIsEditing(false);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95 shrink-0"
                        title="Save company name"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Name</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyDraft({ ...selectedCompany });
                          setIsEditing(false);
                        }}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
                        title="Cancel editing"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => toggleCompanyFavorite(selectedCompany.id)}
                        className="text-neutral-400 hover:text-amber-400 shrink-0"
                      >
                        <Star className={`w-5 h-5 ${selectedCompany.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-700">
                        <span className="text-neutral-400">Industry:</span>
                        <input
                          type="text"
                          value={companyDraft.industry || ''}
                          onChange={(e) => handleUpdateCompanyDraft({ industry: e.target.value })}
                          placeholder="Consulting, Tech..."
                          className="bg-transparent text-white font-semibold focus:outline-none w-28"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-700">
                        <span className="text-neutral-400">Role:</span>
                        <input
                          type="text"
                          value={companyDraft.role || ''}
                          onChange={(e) => handleUpdateCompanyDraft({ role: e.target.value })}
                          placeholder="Associate, SDE..."
                          className="bg-transparent text-white font-semibold focus:outline-none w-28"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-700">
                        <span className="text-neutral-400">Status:</span>
                        <select
                          value={companyDraft.status || selectedCompany.status}
                          onChange={(e) => handleUpdateCompanyDraft({ status: e.target.value as any })}
                          className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                        >
                          {statuses.filter(s => s !== 'All').map(s => (
                            <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-700">
                        <span className="text-neutral-400">Website:</span>
                        <input
                          type="text"
                          value={companyDraft.website || ''}
                          onChange={(e) => handleUpdateCompanyDraft({ website: e.target.value })}
                          placeholder="https://..."
                          className="bg-transparent text-blue-400 focus:outline-none w-32"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 
                        onClick={() => setIsEditing(true)}
                        className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 group/title cursor-pointer hover:text-blue-400 transition-colors"
                        title="Click to change company name"
                      >
                        <span>{selectedCompany.name}</span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700 cursor-pointer transition-colors shadow-xs"
                        title="Change company name & overview"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Change Name</span>
                      </button>
                      <button
                        onClick={() => toggleCompanyFavorite(selectedCompany.id)}
                        className="text-neutral-400 hover:text-amber-400"
                      >
                        <Star className={`w-5 h-5 ${selectedCompany.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        selectedCompany.status === 'Interview Scheduled' 
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                          : selectedCompany.status === 'Shortlisted'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {selectedCompany.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span>Industry: <strong className="text-neutral-200">{selectedCompany.industry}</strong></span>
                      {selectedCompany.role && <span>Role: <strong className="text-neutral-200">{selectedCompany.role}</strong></span>}
                      {selectedCompany.website && (
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('preInterview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'preInterview'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-900/30'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/50 hover:bg-amber-900/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Pre-Interview Mode</span>
              </button>

              {activeTab === 'overview' && (
                isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyDraft({ ...selectedCompany });
                        setIsEditing(false);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateCompany(selectedCompany.id, companyDraft);
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Overview</span>
                  </button>
                )
              )}

              {activeTab === 'research' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingResearch(!isEditingResearch)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingResearch ? 'Preview Mode' : 'Edit Research'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveCompanyChanges('Research answers saved successfully')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Research</span>
                  </button>
                </div>
              )}

              {activeTab === 'notes' && (
                <button
                  type="button"
                  onClick={() => handleSaveCompanyChanges('News & Custom Fields saved successfully')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save News & Fields</span>
                </button>
              )}

              {activeTab === 'preInterview' && (
                <button
                  type="button"
                  onClick={() => handleSaveCompanyChanges('Pre-interview command answers saved successfully')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Command Answers</span>
                </button>
              )}

              <button
                onClick={() => setIsFieldManagerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Fields</span>
              </button>
            </div>
          </div>

          {/* Apple Segmented Slider Tabs with High Contrast */}
          <div className="flex items-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-x-auto custom-scrollbar shadow-inner">
            {[
              { id: 'overview', label: 'Company Overview' },
              { id: 'research', label: 'In-Depth Research' },
              { id: 'questions', label: `Interview Questions (${companyQuestions.length})` },
              { id: 'notes', label: 'News & Custom Fields' },
              { id: 'preInterview', label: '🔥 Pre-Interview Workspace' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40 border border-blue-400/40 scale-[1.02]'
                      : 'bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700/90 border border-neutral-700/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {isEditing ? (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                        <Edit3 className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Edit Overview Fields
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyDraft({ ...selectedCompany });
                          setIsEditing(false);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateCompany(selectedCompany.id, companyDraft);
                          setIsEditing(false);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all cursor-pointer active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>

                  {/* Core Identity Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-blue-400 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={companyDraft.name !== undefined ? companyDraft.name : selectedCompany.name}
                        onChange={(e) => handleUpdateCompanyDraft({ name: e.target.value })}
                        placeholder="e.g. McKinsey & Company, Google..."
                        className="w-full px-3.5 py-2 text-sm font-bold rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Industry</label>
                      <input
                        type="text"
                        value={companyDraft.industry || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ industry: e.target.value })}
                        placeholder="e.g. Consulting, Tech..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Role</label>
                      <input
                        type="text"
                        value={companyDraft.role || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ role: e.target.value })}
                        placeholder="e.g. Associate..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Vision</label>
                      <textarea
                        rows={3}
                        value={companyDraft.vision || ''}
                        onChange={(e) => setCompanyDraft(prev => ({ ...prev, vision: e.target.value }))}
                        placeholder="Define long-term aspirational destination of the company..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Mission</label>
                      <textarea
                        rows={3}
                        value={companyDraft.mission || ''}
                        onChange={(e) => setCompanyDraft(prev => ({ ...prev, mission: e.target.value }))}
                        placeholder="Define core purpose and what the company delivers today..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Model</label>
                    <textarea
                      rows={3}
                      value={companyDraft.businessModel || ''}
                      onChange={(e) => setCompanyDraft(prev => ({ ...prev, businessModel: e.target.value }))}
                      placeholder="How the company creates, delivers, and captures value (B2B, SaaS, advisory, marketplace)..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Products & Services</label>
                      <textarea
                        rows={3}
                        value={companyDraft.productsServices || ''}
                        onChange={(e) => setCompanyDraft(prev => ({ ...prev, productsServices: e.target.value }))}
                        placeholder="Primary product lines, consulting practices, platforms..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Customers</label>
                      <textarea
                        rows={3}
                        value={companyDraft.targetCustomers || ''}
                        onChange={(e) => setCompanyDraft(prev => ({ ...prev, targetCustomers: e.target.value }))}
                        placeholder="Enterprise tier, Fortune 500, mid-market, consumers..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Market Position & Moat</label>
                    <textarea
                      rows={3}
                      value={companyDraft.marketPosition || ''}
                      onChange={(e) => setCompanyDraft(prev => ({ ...prev, marketPosition: e.target.value }))}
                      placeholder="Competitive advantages, proprietary IP, pricing power, network effects..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyDraft({ ...selectedCompany });
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateCompany(selectedCompany.id, companyDraft);
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Vision & Mission</h3>
                    <div>
                      <span className="text-xs font-semibold text-neutral-400">Vision:</span>
                      <p className="text-sm text-neutral-200 mt-0.5">{selectedCompany.vision || 'No vision stated.'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-400">Mission:</span>
                      <p className="text-sm text-neutral-200 mt-0.5">{selectedCompany.mission || 'No mission stated.'}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Business & Revenue Model</h3>
                    <p className="text-sm text-neutral-200">{selectedCompany.businessModel || 'Direct client fees, enterprise subscriptions, retainers.'}</p>
                    {selectedCompany.revenueModel && (
                      <div className="pt-2 border-t border-neutral-800">
                        <span className="text-xs font-semibold text-neutral-400">Revenue Drivers:</span>
                        <p className="text-sm text-neutral-200 mt-0.5">{selectedCompany.revenueModel}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Products, Services & Customers</h3>
                    <div>
                      <span className="text-xs font-semibold text-neutral-400">Offerings:</span>
                      <p className="text-sm text-neutral-200 mt-0.5">{selectedCompany.productsServices || 'Key core services portfolio.'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-400">Target ICP:</span>
                      <p className="text-sm text-neutral-200 mt-0.5">{selectedCompany.targetCustomers || 'Enterprise and consumer demographics.'}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Competitors & Market Position</h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(selectedCompany.keyCompetitors || []).map((comp) => (
                        <span key={comp} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 text-xs border border-neutral-700">
                          {comp}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-200">{selectedCompany.marketPosition}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IN-DEPTH RESEARCH */}
          {activeTab === 'research' && (
            <div className="space-y-4">
              {isEditingResearch ? (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                        <Edit3 className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Edit In-Depth Research Answers
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyDraft({ ...selectedCompany });
                          setIsEditingResearch(false);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveCompanyChanges('Research answers saved successfully');
                          setIsEditingResearch(false);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Research</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-emerald-400">
                          Why This Company?
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.whyThisCompany || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.whyThisCompany || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ whyThisCompany: e.target.value })}
                        placeholder="Scale, learning velocity, leadership mentorship, specific culture, alumni pedigree..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-blue-400">
                          Why This Role?
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.whyThisRole || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.whyThisRole || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ whyThisRole: e.target.value })}
                        placeholder="Structured problem solving, commercial ownership, client-facing impact, skill development..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-indigo-400">
                          Core Attractions & Apprenticeship
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.attractions || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.attractions || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ attractions: e.target.value })}
                        placeholder="Unrivaled apprenticeship model, global project network, mentorship, alumni track record..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-amber-400">
                          What Concerns Me / Risks & Challenges
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.concerns || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.concerns || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ concerns: e.target.value })}
                        placeholder="High travel cadence, ambiguous project scopes, work-life balance boundaries..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-purple-400">
                          Key Differentiators & Moats
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.differentiators || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.differentiators || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ differentiators: e.target.value })}
                        placeholder="Proprietary knowledge network, AI integrations, unmatched partner depth, brand moats..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-cyan-400">
                          Important Metrics & Headcount
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {(companyDraft.importantMetrics || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={companyDraft.importantMetrics || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ importantMetrics: e.target.value })}
                        placeholder="Revenue run rate, employee base, growth rate, market share stats, offices..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyDraft({ ...selectedCompany });
                        setIsEditingResearch(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveCompanyChanges('Research answers saved successfully');
                        setIsEditingResearch(false);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Research</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>In-Depth Research Answers</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingResearch(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Answers</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Why This Company?</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.whyThisCompany || 'Click Edit Answers to write why you want to join this firm.'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Why This Role?</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.whyThisRole || 'Click Edit Answers to write why this specific role fits your career.'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Attractions</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.attractions || 'Click Edit Answers to outline apprenticeship, global network, and perks.'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">What Concerns Me / Risks</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.concerns || 'Click Edit Answers to note potential risks or challenges.'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Key Differentiators & Moats</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.differentiators || 'Click Edit Answers to list proprietary IP and moats.'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Important Metrics & Headcount</h4>
                        <button onClick={() => setIsEditingResearch(true)} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Edit</button>
                      </div>
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.importantMetrics || 'Click Edit Answers to record revenue and headcount numbers.'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINKED INTERVIEW QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-blue-400" />
                    <span>Company-Specific Question Bank</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    Connected to universal Q&A database
                  </span>
                </div>

                {/* Inline add question form */}
                <form onSubmit={(e) => handleAddQuestionForCompany(e)} className="space-y-2.5 my-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add interview question for ${selectedCompany.name}... (e.g. Why ${selectedCompany.name}?)`}
                      value={newCompQuestion}
                      onChange={(e) => setNewCompQuestion(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-md shadow-blue-900/30 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {/* High-yield quick suggestion chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400">Quick prompts:</span>
                    {[
                      `Why ${selectedCompany.name}?`,
                      `What are ${selectedCompany.name}'s key competitors?`,
                      `Walk me through your background and fit for ${selectedCompany.name}.`,
                      `Tell me about a time you solved a tough problem.`
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleAddQuestionForCompany(undefined, prompt)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/70 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        + {prompt}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-3">
                  {companyQuestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800 space-y-3">
                      <p>No questions linked to {selectedCompany.name} yet. Click above to add a company-specific behavioral or technical prompt.</p>
                      <button
                        type="button"
                        onClick={() => handleAddQuestionForCompany(undefined, `Why do you want to work at ${selectedCompany.name}, and what unique strengths do you bring?`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Default "Why {selectedCompany.name}?" Question</span>
                      </button>
                    </div>
                  ) : (
                    companyQuestions.map((q) => {
                      const isEditingThisAnswer = editingAnswerQuestionId === q.id;
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700/80 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                                  {q.category}
                                </span>
                                <span className="text-xs text-neutral-400">Confidence: {q.confidence}/5 ★</span>
                                <span className="text-xs text-neutral-500">Practiced: {q.practiceCount || 0} times</span>
                              </div>
                              <div className="text-sm font-semibold text-white">{q.question}</div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isEditingThisAnswer) {
                                    setEditingAnswerQuestionId(null);
                                  } else {
                                    setEditingAnswerQuestionId(q.id);
                                    setDraftAnswerText(q.myAnswer || '');
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer transition-colors shadow-xs"
                                title="Edit your written answer"
                              >
                                <PenLine className="w-3.5 h-3.5 text-blue-400" />
                                <span>{q.myAnswer ? 'Edit Answer' : 'Write Answer'}</span>
                              </button>
                            </div>
                          </div>

                          {/* INLINE ANSWER WRITING & EDITING FORM */}
                          {isEditingThisAnswer ? (
                            <div className="p-4 rounded-xl border border-blue-500/50 bg-blue-950/20 space-y-3 animate-in fade-in">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                                    <PenLine className="w-3.5 h-3.5" />
                                  </span>
                                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                                    Write / Edit Prepared Response
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const hasStar = draftAnswerText.includes('[Situation]:') || 
                                                    draftAnswerText.includes('[Task]:') || 
                                                    draftAnswerText.includes('[Action]:') || 
                                                    draftAnswerText.includes('[Result]:');
                                    return hasStar ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const cleaned = draftAnswerText
                                            .replace(/\[Situation\]:\s*/gi, '')
                                            .replace(/\[Task\]:\s*/gi, '')
                                            .replace(/\[Action\]:\s*/gi, '')
                                            .replace(/\[Result\]:\s*/gi, '')
                                            .trim();
                                          setDraftAnswerText(cleaned);
                                        }}
                                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                                      >
                                        ✕ Clear STAR Template
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const template = `[Situation]: \n[Task]: \n[Action]: \n[Result]: `;
                                          setDraftAnswerText(prev => prev.trim() ? `${template}\n\n${prev}` : template);
                                        }}
                                        className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                                      >
                                        + Insert STAR Template
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>

                              <textarea
                                rows={5}
                                value={draftAnswerText}
                                onChange={(e) => setDraftAnswerText(e.target.value)}
                                placeholder="Write your response into this question (e.g. key talking points, personal story, STAR structure)..."
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                                autoFocus
                              />

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] text-neutral-500 font-mono">
                                  {draftAnswerText.trim() ? draftAnswerText.trim().split(/\s+/).length : 0} words
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingAnswerQuestionId(null)}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateQuestion(q.id, { myAnswer: draftAnswerText });
                                      setEditingAnswerQuestionId(null);
                                      triggerMicroBurst();
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md transition-all active:scale-95"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save Answer</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* DISPLAY ANSWER */
                            q.myAnswer ? (
                              <div
                                onClick={() => {
                                  setEditingAnswerQuestionId(q.id);
                                  setDraftAnswerText(q.myAnswer || '');
                                }}
                                className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group/ans"
                                title="Click to edit answer"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>My Prepared Answer:</span>
                                  </span>
                                  <span className="text-[11px] text-blue-400 group-hover/ans:underline">Click to edit answer</span>
                                </div>
                                <p className="text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
                                  {q.myAnswer}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800">
                                <span className="text-xs text-neutral-500 italic">No answer written yet.</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAnswerQuestionId(q.id);
                                    setDraftAnswerText('');
                                  }}
                                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Write Answer</span>
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTES & CUSTOM FIELDS */}
          {activeTab === 'notes' && (
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Company News & Custom Fields
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveCompanyChanges('News & Custom Fields saved successfully')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save News & Fields</span>
                </button>
              </div>

              {/* 1. Company Recent News & Developments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>Company Recent News & Market Developments</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {(companyDraft.recentNews || '').length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={companyDraft.recentNews || ''}
                  onChange={(e) => handleUpdateCompanyDraft({ recentNews: e.target.value })}
                  placeholder="Record recent earnings results, major customer acquisitions, merger & acquisition updates, leadership changes, or new product announcements..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* 2. Candidate Strategy & Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Candidate Notes & Placement Strategy</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {(companyDraft.myNotes || '').length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={companyDraft.myNotes || ''}
                  onChange={(e) => handleUpdateCompanyDraft({ myNotes: e.target.value })}
                  placeholder="Personal observations from alumni networking, partner conversations, internal culture insights, and preparation checklist..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* 3. Dynamic Custom Fields */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Dynamic Custom Attributes ({companyFields.length})</span>
                  </h4>
                  <button
                    onClick={() => setIsFieldManagerOpen(true)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Custom Fields</span>
                  </button>
                </div>

                {companyFields.length === 0 ? (
                  <div className="p-4 rounded-xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center text-xs text-neutral-400">
                    No custom fields configured for companies yet. Click "Manage Custom Fields" to create fields like CTC/Compensation, Recruiter Contact, or Referral Source.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {companyFields.map((field) => {
                      const val = (companyDraft.customFields || selectedCompany.customFields || {})[field.id];
                      return (
                        <div key={field.id} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
                          <label className="block text-xs font-semibold text-neutral-300">
                            {field.name}
                          </label>
                          <CustomFieldInput
                            field={field}
                            value={val}
                            onChange={(newVal) => {
                              const updatedCustom = {
                                ...(companyDraft.customFields || selectedCompany.customFields || {}),
                                [field.id]: newVal
                              };
                              handleUpdateCompanyDraft({ customFields: updatedCustom });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Explicit Bottom Save Button */}
              <div className="flex justify-end pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleSaveCompanyChanges('News & Custom Fields saved successfully')}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save News & Custom Fields</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PRE-INTERVIEW MODE WORKSPACE */}
          {activeTab === 'preInterview' && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-amber-800/40 space-y-6">
              {/* Pre-interview Countdown Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 to-neutral-950 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>Pre-Interview Command Mode</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedCompany.name}</h2>
                  <p className="text-xs text-neutral-300 mt-0.5">{selectedCompany.role || 'Associate'} • Date: {selectedCompany.interviewDate || 'Not set'}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Countdown</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400">
                      {calculateDaysRemaining(selectedCompany.interviewDate) !== null
                        ? `${calculateDaysRemaining(selectedCompany.interviewDate)} Days Left`
                        : 'Scheduled Soon'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Preparation</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400">
                      {selectedCompany.prepProgress}%
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveCompanyChanges('Pre-interview command answers saved successfully')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Answers</span>
                  </button>
                </div>
              </div>

              {/* PRE-INTERVIEW COMMAND CODE - WITH EDITABLE ANSWERS BELOW THEM */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>⚡ Pre-Interview Command Code: Prepared Answers</span>
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Add and refine your answers below each command before walking into the interview
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Command 1: Company Differentiators */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Command 1: Company Differentiators & Moats (3 Core Pillars)
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Memorize the 3 core pillars that make {selectedCompany.name} unique (e.g. "{companyDraft.differentiators ? companyDraft.differentiators.slice(0, 60) + '...' : 'Scale, proprietary IP, culture'}").
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300/90 mb-1">
                        ✍️ Your Prepared Answer Below:
                      </label>
                      <textarea
                        rows={3}
                        value={companyDraft.differentiators || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ differentiators: e.target.value })}
                        placeholder="Add your answer below: Type the 3 core pillars to memorize (e.g. 1. Scale & global network, 2. Proprietary tech & data assets, 3. Unmatched partnership culture)..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* Command 2: "Why This Company?" Hook */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Command 2: "Why This Company?" 90-Second Verbal Hook
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Practice a 90-second elevator pitch tying your background to their exact mission.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300/90 mb-1">
                        ✍️ Your Prepared Answer Below:
                      </label>
                      <textarea
                        rows={3}
                        value={companyDraft.whyThisCompanyPitch || companyDraft.whyThisCompany || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ whyThisCompanyPitch: e.target.value })}
                        placeholder="Add your answer below: Type your 90-second verbal hook connecting your background and passion directly to this company's future..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* Command 3: Recent Developments */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Command 3: Recent News & Market Talking Points
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Reference their latest announcements, earnings highlights, or strategic initiatives.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300/90 mb-1">
                        ✍️ Your Prepared Answer Below:
                      </label>
                      <textarea
                        rows={3}
                        value={companyDraft.recentNews || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ recentNews: e.target.value })}
                        placeholder="Add your answer below: Reference their latest announcements, quarterly results, or key initiatives (e.g. 'I noticed your recent expansion into...')..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* Command 4: Firm-Specific Cheat Sheet & Frameworks */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Command 4: Firm-Specific Cheat Sheet & Key Frameworks
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Essential talking points, technical concepts, or metrics specific to {selectedCompany.name}.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300/90 mb-1">
                        ✍️ Your Prepared Answer Below:
                      </label>
                      <textarea
                        rows={3}
                        value={companyDraft.keyQuestionsTalkingPoints || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ keyQuestionsTalkingPoints: e.target.value })}
                        placeholder="Add your answer below: Write key metrics, core frameworks, client case examples, or acronyms to weave into your responses..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* Command 5: Questions To Ask Partner */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        5
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Command 5: Thoughtful Questions To Ask The Partner / Interviewer
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Prepare 2-3 thoughtful questions on their specific industry transformation or project leadership.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300/90 mb-1">
                        ✍️ Your Prepared Answer Below:
                      </label>
                      <textarea
                        rows={3}
                        value={companyDraft.questionsForPartner || ''}
                        onChange={(e) => handleUpdateCompanyDraft({ questionsForPartner: e.target.value })}
                        placeholder="Add your answer below: Question 1: How has your team adapted to... Question 2: What differentiates high performers in their first 6 months here?..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Save All Command Answers Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    All command answers auto-save as you type and sync to your cloud workspace.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveCompanyChanges('Pre-interview command answers saved successfully')}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-950/40 cursor-pointer transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save All Command Answers</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN COMPANY DATABASE LISTING VIEW */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] flex items-center gap-2.5">
                <Target className="w-7 h-7 text-[#0071e3]" />
                <span>Company Tracker</span>
              </h1>
              <p className="text-sm text-[#86868b] mt-1">
                Completely customizable company database for deep-dive interview preparation. (
                <AnimatedCounter value={companies.length} suffix=" companies tracked" />
                )
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                id="btn_placement_customize_fields"
                onClick={() => setIsFieldManagerOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1d1d1f] border border-black/10 transition-colors shadow-xs cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Fields</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                id="btn_placement_add_company"
                onClick={() => {
                  setNewCompanyName('');
                  setNewCompanyIndustry('Consulting');
                  setNewCompanyRole('Associate');
                  setNewCompanyStatus('Target');
                  setIsAddCompanyModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-b from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company</span>
              </motion.button>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-[#1d1d1f]">
            <div className="flex items-center gap-2.5 flex-1">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search companies by name, industry, vision..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1d1d1f] placeholder-neutral-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">Industry:</span>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#f5f5f7] border border-black/10 text-[#1d1d1f] focus:outline-none"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-neutral-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#f5f5f7] border border-black/10 text-[#1d1d1f] focus:outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-neutral-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#f5f5f7] border border-black/10 text-[#1d1d1f] focus:outline-none"
                >
                  <option value="prep">Preparation %</option>
                  <option value="name">Company Name</option>
                  <option value="date">Interview Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Companies Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((comp, idx) => {
              const daysLeft = calculateDaysRemaining(comp.interviewDate);
              const compQCount = questions.filter(
                (q) => q.companyId === comp.id || q.companyName === comp.name
              ).length;
              const isBlack = idx % 2 === 0;

              return (
                <motion.div
                  key={comp.id}
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                  className={`p-5 rounded-2xl flex flex-col justify-between space-y-4 group ${
                    isBlack ? 'apple-card-black' : 'apple-card-white'
                  }`}
                >
                  <div className="specular-sheen" />
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {renamingCompanyId === comp.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const trimmed = renameText.trim();
                              if (trimmed) {
                                updateCompany(comp.id, { name: trimmed });
                              }
                              setRenamingCompanyId(null);
                            }}
                            className="flex items-center gap-1.5 mb-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={renameText}
                              onChange={(e) => setRenameText(e.target.value)}
                              autoFocus
                              className="px-2 py-1 text-xs sm:text-sm font-bold rounded-lg bg-neutral-900 border border-blue-500 text-white focus:outline-none w-full shadow-inner"
                              placeholder="Company name..."
                            />
                            <button
                              type="submit"
                              className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shrink-0"
                              title="Save Name"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRenamingCompanyId(null)}
                              className="p-1 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer shrink-0"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 
                              onClick={() => setSelectedCompanyId(comp.id)}
                              className={`text-base font-bold cursor-pointer transition-colors truncate ${
                                isBlack ? 'text-white group-hover:text-blue-400' : 'text-[#1d1d1f] group-hover:text-[#0071e3]'
                              }`}
                              title="Open workspace"
                            >
                              {comp.name}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenamingCompanyId(comp.id);
                                setRenameText(comp.name);
                              }}
                              className={`p-1 rounded-md transition-opacity cursor-pointer ${
                                isBlack 
                                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' 
                                  : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                              }`}
                              title="Rename Company"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleCompanyFavorite(comp.id)}
                              className="text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                            >
                              <Star className={`w-4 h-4 ${comp.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                            </button>
                          </div>
                        )}
                        <div className={`text-xs mt-0.5 ${isBlack ? 'text-neutral-400' : 'text-[#86868b]'}`}>
                          {comp.industry}
                        </div>
                      </div>

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        comp.status === 'Interview Scheduled'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                          : comp.status === 'Shortlisted'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                          : isBlack 
                          ? 'bg-neutral-800 text-neutral-400' 
                          : 'bg-neutral-100 text-neutral-600 border border-black/[0.06]'
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    {comp.whyThisCompany && (
                      <p className={`text-xs line-clamp-2 ${isBlack ? 'text-neutral-400' : 'text-[#86868b]'}`}>
                        {comp.whyThisCompany}
                      </p>
                    )}

                    {/* Preparation Progress Bar */}
                    <div className="space-y-1.5">
                      <div className={`flex items-center justify-between text-[11px] ${
                        isBlack ? 'text-neutral-400' : 'text-[#86868b]'
                      }`}>
                        <span>Readiness</span>
                        <span className="font-bold text-emerald-400 font-mono">{comp.prepProgress}%</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                        isBlack ? 'bg-neutral-800' : 'bg-neutral-200'
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${comp.prepProgress}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-gradient-to-r from-[#2997ff] to-emerald-400 h-full rounded-full relative overflow-hidden"
                        >
                          <div className="animate-shimmer absolute inset-0" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Controls */}
                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isBlack ? 'border-white/10' : 'border-black/[0.06]'
                  }`}>
                    <div className={`flex items-center gap-2 font-mono ${
                      isBlack ? 'text-neutral-400' : 'text-[#86868b]'
                    }`}>
                      <span>{compQCount} Questions</span>
                      {daysLeft !== null && (
                        <span className="text-amber-500 font-semibold">• {daysLeft}d left</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingCompanyId(comp.id);
                          setRenameText(comp.name);
                        }}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          isBlack ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                        }`}
                        title="Rename Company"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateCompany(comp.id)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          isBlack ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                        }`}
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCompany(comp.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedCompanyId(comp.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                          isBlack 
                            ? 'bg-white hover:bg-neutral-200 text-black' 
                            : 'bg-[#0071e3] hover:bg-blue-600 text-white'
                        }`}
                      >
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <Target className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
              <h3 className="text-sm font-bold text-neutral-300">No companies found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try adjusting your search filter or click "Add Company" to register a target organization.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
