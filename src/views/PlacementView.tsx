import React, { useState } from 'react';
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
  Target
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
    customFields,
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

  // New question in company tab
  const [newCompQuestion, setNewCompQuestion] = useState('');

  // Selected company object
  const selectedCompany = (companies || []).find((c) => c.id === selectedCompanyId);

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

  // Linked questions for selected company
  const companyQuestions = (questions || []).filter(
    (q) => q.companyId === selectedCompanyId || (selectedCompany && q.companyName === selectedCompany.name)
  );

  const handleAddQuestionForCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompQuestion.trim() || !selectedCompany) return;
    addQuestion({
      question: newCompQuestion,
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

      {/* DETAIL WORKSPACE VIEW */}
      {selectedCompany ? (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xs">
            <div className="flex items-start gap-4">
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  setIsEditing(false);
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800/80 hover:bg-neutral-800 transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedCompany.name}</h2>
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

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'View Mode' : 'Edit Research'}</span>
              </button>

              <button
                onClick={() => setIsFieldManagerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Fields</span>
              </button>
            </div>
          </div>

          {/* Apple Segmented Slider Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/40 rounded-2xl border border-white/[0.08] overflow-x-auto custom-scrollbar relative">
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
                  className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="companyTabGlider"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.16] to-white/[0.06] border border-white/[0.18] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {isEditing ? (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Edit Overview Fields</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Vision</label>
                      <textarea
                        rows={3}
                        value={selectedCompany.vision || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { vision: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Mission</label>
                      <textarea
                        rows={3}
                        value={selectedCompany.mission || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { mission: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Model</label>
                    <textarea
                      rows={3}
                      value={selectedCompany.businessModel || ''}
                      onChange={(e) => updateCompany(selectedCompany.id, { businessModel: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Products & Services</label>
                      <textarea
                        rows={3}
                        value={selectedCompany.productsServices || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { productsServices: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Customers</label>
                      <textarea
                        rows={3}
                        value={selectedCompany.targetCustomers || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { targetCustomers: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Market Position & Moat</label>
                    <textarea
                      rows={3}
                      value={selectedCompany.marketPosition || ''}
                      onChange={(e) => updateCompany(selectedCompany.id, { marketPosition: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                    />
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
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Why This Company?</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.whyThisCompany || 'Highlight scale, mentorship, and learning velocity.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Why This Role?</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.whyThisRole || 'Structured problem solving and commercial ownership.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Attractions</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.attractions || 'Unrivaled apprenticeship and global network.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">What Concerns Me / Risks</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.concerns || 'High sprint cadence requiring work-life boundaries.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Key Differentiators & Moats</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.differentiators || 'Proprietary knowledge network and AI integration.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Important Metrics & Headcount</h4>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap">{selectedCompany.importantMetrics || 'Revenue, employee base, and market share numbers.'}</p>
                </div>
              </div>
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
                <form onSubmit={handleAddQuestionForCompany} className="flex gap-2 my-4">
                  <input
                    type="text"
                    placeholder={`Add custom interview question for ${selectedCompany.name}...`}
                    value={newCompQuestion}
                    onChange={(e) => setNewCompQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </form>

                {/* Questions List */}
                <div className="space-y-3">
                  {companyQuestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800">
                      No questions linked to {selectedCompany.name} yet. Use the input above to add your first company-specific question.
                    </div>
                  ) : (
                    companyQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                              {q.category}
                            </span>
                            <span className="text-xs text-neutral-400">Confidence: {q.confidence}/5 ★</span>
                            <span className="text-xs text-neutral-500">Practiced: {q.practiceCount || 0} times</span>
                          </div>
                          <div className="text-sm font-semibold text-white">{q.question}</div>
                          {q.myAnswer && (
                            <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                              {q.myAnswer}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setPracticeModalQuestionId(q.id);
                            setActiveView('interviewPrep');
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                        >
                          Practice →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTES & CUSTOM FIELDS */}
          {activeTab === 'notes' && (
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">My Candidate Notes & Strategy</h3>
                <textarea
                  rows={4}
                  value={selectedCompany.myNotes || ''}
                  onChange={(e) => updateCompany(selectedCompany.id, { myNotes: e.target.value })}
                  placeholder="Personal observations from alumni networking, recent earnings calls, partner interviews..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Dynamic Custom Fields Rendering */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">
                    Dynamic Custom Attributes ({companyFields.length})
                  </h3>
                  <button
                    onClick={() => setIsFieldManagerOpen(true)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Manage Custom Fields</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {companyFields.map((field) => {
                    const val = selectedCompany.customFields?.[field.id];
                    return (
                      <div key={field.id} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          {field.name}
                        </label>
                        <CustomFieldInput
                          field={field}
                          value={val}
                          onChange={(newVal) => {
                            const updatedCustom = {
                              ...(selectedCompany.customFields || {}),
                              [field.id]: newVal
                            };
                            updateCompany(selectedCompany.id, { customFields: updatedCustom });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
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
                </div>
              </div>

              {/* TOP 5 THINGS TO PREPARE */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>🔥 Top 5 Things To Prepare Before Stepping In</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-neutral-200">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <span><strong>Company Differentiators:</strong> Memorize the 3 core pillars (e.g. "{selectedCompany.differentiators || 'Scale, knowledge networks, culture'}").</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <span><strong>"Why This Company?" Hook:</strong> Practice 90-second elevator pitch tying your background to their exact mission.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <span><strong>Recent Developments:</strong> Reference their latest announcements: "{selectedCompany.recentNews || 'Recent growth and tech initiatives'}".</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">4</span>
                    <span><strong>Firm-Specific Questions:</strong> Drill all {companyQuestions.length} company-specific questions in Practice Mode.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">5</span>
                    <span><strong>Questions To Ask the Partner:</strong> Prepare 2 thoughtful questions on their specific industry transformation projects.</span>
                  </div>
                </div>
              </div>

              {/* Instant Practice Launch Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const firstQ = companyQuestions[0] || questions[0];
                    if (firstQ) {
                      setPracticeModalQuestionId(firstQ.id);
                      setActiveView('interviewPrep');
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/40 flex items-center gap-2"
                >
                  <Mic2 className="w-4 h-4" />
                  <span>Start Rapid Pre-Interview Mock Drill →</span>
                </button>
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
                  triggerMicroBurst();
                  const newId = addCompany({
                    name: 'New Company',
                    industry: 'Consulting',
                    website: '',
                    status: 'Target',
                    prepProgress: 20
                  });
                  setSelectedCompanyId(newId);
                  setIsEditing(true);
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
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => setSelectedCompanyId(comp.id)}
                            className={`text-base font-bold cursor-pointer transition-colors ${
                              isBlack ? 'text-white group-hover:text-blue-400' : 'text-[#1d1d1f] group-hover:text-[#0071e3]'
                            }`}
                          >
                            {comp.name}
                          </h3>
                          <button
                            onClick={() => toggleCompanyFavorite(comp.id)}
                            className="text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${comp.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                        </div>
                        <div className={`text-xs mt-0.5 ${isBlack ? 'text-neutral-400' : 'text-[#86868b]'}`}>
                          {comp.industry}
                        </div>
                      </div>

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
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
