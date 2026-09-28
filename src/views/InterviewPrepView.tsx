import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mic2, 
  Plus, 
  Search, 
  Sliders, 
  Star, 
  Play, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  Sparkles, 
  HelpCircle,
  Tag,
  Square,
  CheckSquare,
  AlertTriangle,
  ChevronDown,
  Video,
  Camera
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { InterviewQuestion, QuestionCategory } from '../types';
import { CustomFieldsManager } from '../components/CustomFieldsManager';
import { CustomFieldInput, CustomFieldDisplay } from '../components/CustomFieldRenderer';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { AudioAnswerRecorder } from '../components/AudioAnswerRecorder';
import { VideoAnswerRecorder } from '../components/VideoAnswerRecorder';
import { triggerCelebration } from '../utils/confetti';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const InterviewPrepView: React.FC = () => {
  const { 
    questions, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    duplicateQuestion,
    toggleQuestionFavorite,
    recordQuestionPractice,
    categories,
    addCategory,
    deleteCategory,
    companies,
    practiceModalQuestionId,
    setPracticeModalQuestionId,
    customFields,
    addMistake
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // New category creation
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Active practice modal states
  const activePracticeQuestion = (questions || []).find((q) => q.id === practiceModalQuestionId);
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [practiceNotes, setPracticeNotes] = useState('');
  const [practiceRating, setPracticeRating] = useState(3);
  const [logMistakeFromPractice, setLogMistakeFromPractice] = useState(false);
  const [mistakeDescription, setMistakeDescription] = useState('');

  // Media tabs state for cards and practice
  const [cardMediaMode, setCardMediaMode] = useState<Record<string, 'video' | 'audio'>>({});
  const [practiceMediaMode, setPracticeMediaMode] = useState<'video' | 'audio'>('video');

  // Timer effect for practice mode
  React.useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPracticeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Reset timer on open
  React.useEffect(() => {
    if (practiceModalQuestionId && activePracticeQuestion) {
      setPracticeSeconds(0);
      setIsTimerRunning(true);
      setPracticeNotes(activePracticeQuestion.myAnswer || '');
      setPracticeRating(activePracticeQuestion.confidence || 3);
      setLogMistakeFromPractice(false);
      setMistakeDescription('');
    } else {
      setIsTimerRunning(false);
    }
  }, [practiceModalQuestionId]);

  const questionCustomFields = (customFields || []).filter((f) => f.entityType === 'question');

  const filteredQuestions = (questions || []).filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.myAnswer && q.myAnswer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.companyName && q.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesCompany = selectedCompanyFilter === 'All' || q.companyId === selectedCompanyFilter || q.companyName === selectedCompanyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus && matchesCompany;
  });

  const handleFinishPractice = () => {
    if (!activePracticeQuestion) return;
    recordQuestionPractice(activePracticeQuestion.id, practiceRating, practiceNotes);
    triggerCelebration();

    if (logMistakeFromPractice && mistakeDescription.trim()) {
      addMistake({
        mistakeTitle: `Interview Prep: ${activePracticeQuestion.question.slice(0, 50)}...`,
        category: 'Interview',
        whatIDid: mistakeDescription,
        whatIShouldHaveDone: 'Structured answer clearly with STAR / MECE framework.',
        correctApproach: 'Maintain calm composure and structure delivery in 3 distinct parts.',
        whyIMadeIt: 'Time pressure or lack of structured delivery.',
        howToAvoid: 'Practice 30 seconds pause before speaking.',
        frequency: 1,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      });
    }

    setPracticeModalQuestionId(null);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="interview_prep_container" className="space-y-6">
      <CustomFieldsManager
        entityType="question"
        isOpen={isFieldManagerOpen}
        onClose={() => setIsFieldManagerOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2.5">
            <Mic2 className="w-6 h-6 text-[#0071e3]" />
            <span>Interview Prep & Question Bank</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Build, practice, and master your behavioral, technical, consulting, and HR stories. (
            <AnimatedCounter value={questions.length} suffix=" questions total" />
            )
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFieldManagerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1d1d1f] border border-black/10 transition-colors shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Fields</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            id="btn_add_new_question"
            onClick={() => {
              const newId = addQuestion({
                question: 'New Interview Question (Click edit to write question)',
                category: selectedCategory !== 'All' ? selectedCategory : 'HR',
                difficulty: 'Medium',
                confidence: 3,
                status: 'Needs Practice',
                practiceCount: 0
              });
              setEditingQuestionId(newId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </motion.button>
        </div>
      </div>

      {/* Category Pills & Dynamic Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All ({questions.length})
        </button>

        {categories.map((cat) => {
          const count = questions.filter((q) => q.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] opacity-70 font-mono">({count})</span>
            </button>
          );
        })}

        {showAddCat ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Category name..."
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg bg-neutral-950 border border-blue-500 text-white focus:outline-none"
            />
            <button
              onClick={() => {
                if (newCatInput.trim()) {
                  addCategory(newCatInput.trim());
                  setSelectedCategory(newCatInput.trim());
                  setNewCatInput('');
                  setShowAddCat(false);
                }
              }}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg font-bold"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddCat(false)}
              className="px-1.5 py-1 text-xs text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCat(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-blue-400 border border-dashed border-neutral-800 hover:border-blue-500/50 whitespace-nowrap flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>New Category</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search questions, answers, tags, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-neutral-400">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-neutral-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Needs Practice">Needs Practice</option>
              <option value="Practiced">Practiced</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-neutral-400">Company:</span>
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none"
            >
              <option value="All">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions Cards List */}
      <div className="space-y-3.5">
        {filteredQuestions.map((q, idx) => {
          const isCurrentlyEditing = editingQuestionId === q.id;
          const isBlack = idx % 2 === 0;

          return (
            <motion.div
              key={q.id}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className={`p-5 rounded-2xl space-y-3 group ${
                isBlack ? 'apple-card-black' : 'apple-card-white'
              }`}
            >
              <div className="specular-sheen" />
              {isCurrentlyEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs font-bold text-blue-400 uppercase">Editing Question</span>
                    <button
                      onClick={() => setEditingQuestionId(null)}
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white"
                    >
                      Done Editing
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Question</label>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                      <select
                        value={q.category}
                        onChange={(e) => updateQuestion(q.id, { category: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
                      <select
                        value={q.difficulty}
                        onChange={(e) => updateQuestion(q.id, { difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Company Name <span className="text-[10px] text-neutral-400">(Type or select)</span>
                      </label>
                      <input
                        type="text"
                        list="company-list-suggestions"
                        placeholder="e.g. McKinsey, Google, Goldman..."
                        value={q.companyName || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const matchedComp = companies.find(c => c.name.toLowerCase() === val.trim().toLowerCase());
                          updateQuestion(q.id, {
                            companyName: val,
                            companyId: matchedComp ? matchedComp.id : undefined
                          });
                        }}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                      <datalist id="company-list-suggestions">
                        {companies.map((c) => (
                          <option key={c.id} value={c.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-neutral-300">
                        My Answer / Story Formulation
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        {(() => {
                          const currentAnswer = q.myAnswer || '';
                          const hasStar = currentAnswer.includes('[Situation]:') || 
                                          currentAnswer.includes('[Task]:') || 
                                          currentAnswer.includes('[Action]:') || 
                                          currentAnswer.includes('[Result]:');
                          
                          if (hasStar) {
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  // Cleanly remove STAR structure headers while keeping user text if any
                                  const cleaned = currentAnswer
                                    .replace(/\[Situation\]:\s*/gi, '')
                                    .replace(/\[Task\]:\s*/gi, '')
                                    .replace(/\[Action\]:\s*/gi, '')
                                    .replace(/\[Result\]:\s*/gi, '')
                                    .trim();
                                  updateQuestion(q.id, { myAnswer: cleaned });
                                }}
                                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline"
                              >
                                ✕ Remove STAR Framework
                              </button>
                            );
                          } else {
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  const template = `[Situation]: \n[Task]: \n[Action]: \n[Result]: `;
                                  const newAnswer = currentAnswer.trim() 
                                    ? `${template}\n\n${currentAnswer}` 
                                    : template;
                                  updateQuestion(q.id, { myAnswer: newAnswer });
                                }}
                                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 hover:underline"
                              >
                                + Insert STAR Framework
                              </button>
                            );
                          }
                        })()}
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={q.myAnswer || ''}
                      onChange={(e) => updateQuestion(q.id, { myAnswer: e.target.value })}
                      placeholder="Write your bulletproof STAR/MECE answer..."
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                    />
                  </div>

                  {/* Audio & Video Answer Recording in Edit Mode */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-neutral-300">
                        Spoken Response Recording (Video & Audio)
                      </label>
                      <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                        <button
                          type="button"
                          onClick={() => setCardMediaMode(prev => ({ ...prev, [q.id]: 'video' }))}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            (cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'video'
                              ? 'bg-purple-600 text-white'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Webcam Video</span>
                          {q.hasVideoAnswer && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardMediaMode(prev => ({ ...prev, [q.id]: 'audio' }))}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            (cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'audio'
                              ? 'bg-blue-600 text-white'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Mic2 className="w-3.5 h-3.5" />
                          <span>Voice Note</span>
                          {q.audioAnswerUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {(cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'video' ? (
                      <VideoAnswerRecorder
                        questionId={q.id}
                        hasVideoAnswer={q.hasVideoAnswer}
                        videoAnswerDuration={q.videoAnswerDuration}
                        videoRecordedAt={q.videoRecordedAt}
                        onSaveVideo={(duration) => {
                          updateQuestion(q.id, {
                            hasVideoAnswer: true,
                            videoAnswerDuration: duration,
                            videoRecordedAt: new Date().toISOString()
                          });
                        }}
                        onDeleteVideo={() => {
                          updateQuestion(q.id, {
                            hasVideoAnswer: false,
                            videoAnswerDuration: undefined,
                            videoRecordedAt: undefined
                          });
                        }}
                        isDark={true}
                      />
                    ) : (
                      <AudioAnswerRecorder
                        audioUrl={q.audioAnswerUrl}
                        durationSeconds={q.audioAnswerDuration}
                        onSaveAudio={(audioDataUrl, duration) => {
                          updateQuestion(q.id, { 
                            audioAnswerUrl: audioDataUrl, 
                            audioAnswerDuration: duration,
                            audioRecordedAt: new Date().toISOString()
                          });
                        }}
                        onDeleteAudio={() => {
                          updateQuestion(q.id, { 
                            audioAnswerUrl: undefined, 
                            audioAnswerDuration: undefined,
                            audioRecordedAt: undefined
                          });
                        }}
                        isDark={true}
                      />
                    )}
                  </div>

                  {/* Custom fields in edit */}
                  {questionCustomFields.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                      {questionCustomFields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">
                            {field.name}
                          </label>
                          <CustomFieldInput
                            field={field}
                            value={q.customFields?.[field.id]}
                            onChange={(val) => {
                              const updated = { ...(q.customFields || {}), [field.id]: val };
                              updateQuestion(q.id, { customFields: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* READ-ONLY CARD VIEW */
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleQuestionFavorite(q.id)}
                          className="text-neutral-500 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${q.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>

                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                          {q.category}
                        </span>

                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                          q.difficulty === 'Hard'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        }`}>
                          {q.difficulty}
                        </span>

                        {q.companyName && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                            🏢 {q.companyName}
                          </span>
                        )}

                        {q.hasVideoAnswer && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/40 flex items-center gap-1 font-mono">
                            <Video className="w-3 h-3 text-purple-400" /> Video Mock
                          </span>
                        )}

                        {q.audioAnswerUrl && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/40 flex items-center gap-1 font-mono">
                            <Mic2 className="w-3 h-3 text-blue-400" /> Voice Note
                          </span>
                        )}

                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= (q.confidence || 0) ? 'text-amber-400' : 'text-neutral-700'}>
                              ★
                            </span>
                          ))}
                        </span>

                        <span className="text-xs text-neutral-500">
                          Practiced {q.practiceCount || 0} times
                        </span>
                      </div>

                      <h3 className={`text-base font-bold leading-snug ${isBlack ? 'text-white' : 'text-[#1d1d1f]'}`}>
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPracticeModalQuestionId(q.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all ${
                          isBlack ? 'bg-white hover:bg-neutral-200 text-black' : 'bg-[#0071e3] hover:bg-blue-600 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Practice Mode</span>
                      </button>
                    </div>
                  </div>

                  {q.myAnswer && (
                    <div className={`mt-3 p-3.5 rounded-xl border text-xs sm:text-sm whitespace-pre-wrap ${
                      isBlack ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' : 'bg-[#f5f5f7] border-black/[0.06] text-[#1d1d1f]'
                    }`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        isBlack ? 'text-neutral-400' : 'text-[#86868b]'
                      }`}>
                        Prepared Response / Framework:
                      </div>
                      {q.myAnswer}
                    </div>
                  )}

                  {/* Media Answer Section (Webcam Video & Voice Audio) */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/20 border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => setCardMediaMode(prev => ({ ...prev, [q.id]: 'video' }))}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            (cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'video'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : isBlack ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Webcam Video</span>
                          {q.hasVideoAnswer && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setCardMediaMode(prev => ({ ...prev, [q.id]: 'audio' }))}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            (cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'audio'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : isBlack ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <Mic2 className="w-3.5 h-3.5" />
                          <span>Voice Audio</span>
                          {q.audioAnswerUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {(cardMediaMode[q.id] || (q.hasVideoAnswer ? 'video' : 'audio')) === 'video' ? (
                      <VideoAnswerRecorder
                        questionId={q.id}
                        hasVideoAnswer={q.hasVideoAnswer}
                        videoAnswerDuration={q.videoAnswerDuration}
                        videoRecordedAt={q.videoRecordedAt}
                        onSaveVideo={(duration) => {
                          updateQuestion(q.id, {
                            hasVideoAnswer: true,
                            videoAnswerDuration: duration,
                            videoRecordedAt: new Date().toISOString()
                          });
                        }}
                        onDeleteVideo={() => {
                          updateQuestion(q.id, {
                            hasVideoAnswer: false,
                            videoAnswerDuration: undefined,
                            videoRecordedAt: undefined
                          });
                        }}
                        isDark={isBlack}
                      />
                    ) : (
                      <AudioAnswerRecorder
                        audioUrl={q.audioAnswerUrl}
                        durationSeconds={q.audioAnswerDuration}
                        onSaveAudio={(audioDataUrl, duration) => {
                          updateQuestion(q.id, { 
                            audioAnswerUrl: audioDataUrl, 
                            audioAnswerDuration: duration,
                            audioRecordedAt: new Date().toISOString()
                          });
                        }}
                        onDeleteAudio={() => {
                          updateQuestion(q.id, { 
                            audioAnswerUrl: undefined, 
                            audioAnswerDuration: undefined,
                            audioRecordedAt: undefined
                          });
                        }}
                        isDark={isBlack}
                      />
                    )}
                  </div>

                  {/* Render dynamic custom fields if any exist */}
                  {questionCustomFields.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {questionCustomFields.map((field) => (
                        <CustomFieldDisplay
                          key={field.id}
                          field={field}
                          value={q.customFields?.[field.id]}
                        />
                      ))}
                    </div>
                  )}

                  {/* Card footer controls */}
                  <div className="pt-3 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                        q.status === 'Mastered'
                          ? 'bg-emerald-950 text-emerald-300'
                          : q.status === 'Practiced'
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingQuestionId(q.id)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                        title="Edit question & answer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateQuestion(q.id)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <Mic2 className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
            <h3 className="text-sm font-bold text-neutral-300">No interview questions found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Click "+ Add Question" to register behavioral, consulting, or technical questions.
            </p>
          </div>
        )}
      </div>

      {/* PRACTICE MODE MODAL */}
      {activePracticeQuestion && (
        <div 
          id="practice_mode_modal_backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-2xl bg-neutral-900 border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Mock Practice Session
                </span>
              </div>

              {/* Stopwatch Timer */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-800 border border-neutral-700 font-mono text-sm font-bold text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(practiceSeconds)}</span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Question Prompter Box */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase">
                  <span>{activePracticeQuestion.category}</span>
                  {activePracticeQuestion.companyName && (
                    <span>• {activePracticeQuestion.companyName}</span>
                  )}
                  <span>• {activePracticeQuestion.difficulty}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  "{activePracticeQuestion.question}"
                </h2>

                {/* Apple Siri Voice Waveform Visualizer */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-rose-500 animate-ping' : 'bg-neutral-500'}`} />
                      <span>{isTimerRunning ? 'Recording delivery cadence...' : 'Paused'}</span>
                    </span>
                    <span className="text-neutral-500">Audio Frequency Wave</span>
                  </div>
                  <AudioVisualizer isActive={isTimerRunning} barCount={26} theme="dark" />
                </div>
              </div>

              {/* Practice Drill Media Suite (Webcam Video vs Voice Audio) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Record Live Mock Response:
                  </span>
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPracticeMediaMode('video')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        practiceMediaMode === 'video'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Webcam Video</span>
                      {activePracticeQuestion.hasVideoAnswer && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeMediaMode('audio')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        practiceMediaMode === 'audio'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Mic2 className="w-3.5 h-3.5" />
                      <span>Audio Voice</span>
                      {activePracticeQuestion.audioAnswerUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  </div>
                </div>

                {practiceMediaMode === 'video' ? (
                  <VideoAnswerRecorder
                    questionId={activePracticeQuestion.id}
                    hasVideoAnswer={activePracticeQuestion.hasVideoAnswer}
                    videoAnswerDuration={activePracticeQuestion.videoAnswerDuration}
                    videoRecordedAt={activePracticeQuestion.videoRecordedAt}
                    onSaveVideo={(duration) => {
                      updateQuestion(activePracticeQuestion.id, {
                        hasVideoAnswer: true,
                        videoAnswerDuration: duration,
                        videoRecordedAt: new Date().toISOString()
                      });
                    }}
                    onDeleteVideo={() => {
                      updateQuestion(activePracticeQuestion.id, {
                        hasVideoAnswer: false,
                        videoAnswerDuration: undefined,
                        videoRecordedAt: undefined
                      });
                    }}
                    isDark={true}
                  />
                ) : (
                  <AudioAnswerRecorder
                    audioUrl={activePracticeQuestion.audioAnswerUrl}
                    durationSeconds={activePracticeQuestion.audioAnswerDuration}
                    onSaveAudio={(audioDataUrl, duration) => {
                      updateQuestion(activePracticeQuestion.id, { 
                        audioAnswerUrl: audioDataUrl, 
                        audioAnswerDuration: duration,
                        audioRecordedAt: new Date().toISOString()
                      });
                    }}
                    onDeleteAudio={() => {
                      updateQuestion(activePracticeQuestion.id, { 
                        audioAnswerUrl: undefined, 
                        audioAnswerDuration: undefined,
                        audioRecordedAt: undefined
                      });
                    }}
                    isDark={true}
                  />
                )}
              </div>

              {/* Answer Notes / Live Refinements */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Live Practice Notes & Delivery Formulation:
                </label>
                <textarea
                  rows={4}
                  value={practiceNotes}
                  onChange={(e) => setPracticeNotes(e.target.value)}
                  placeholder="Draft or adjust your answer points while speaking..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Self Rating Confidence */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-neutral-300">Rate your answer delivery:</span>
                  <p className="text-[11px] text-neutral-500">How structured, crisp, and confident was your response?</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2, transition: { type: 'spring', stiffness: 450, damping: 20 } }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setPracticeRating(star)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        practiceRating >= star
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {star}★
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Log Mistake Option */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logMistakeFromPractice}
                    onChange={(e) => setLogMistakeFromPractice(e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-rose-500 focus:ring-0"
                  />
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Did you make a mistake or fumble? Log it directly to Mistake Bank
                  </span>
                </label>

                {logMistakeFromPractice && (
                  <input
                    type="text"
                    placeholder="Describe what went wrong (e.g. Ramble on task details, forgot quantification)..."
                    value={mistakeDescription}
                    onChange={(e) => setMistakeDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-rose-800/60 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 mt-2"
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
              <button
                type="button"
                onClick={() => setPracticeModalQuestionId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishPractice}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40"
              >
                <Check className="w-4 h-4" />
                <span>Save Practice Session & Increment Count</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
