import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Mic2, 
  Calculator, 
  Newspaper, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Database,
  Plus,
  Pill
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const QuickAddModal: React.FC = () => {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    quickAddDefaultType,
    addCompany,
    addQuestion,
    addGuesstimate,
    addGDTopic,
    addNews,
    addDataPoint,
    addMistake,
    addDailyTask,
    addMedicine,
    categories,
    companies
  } = useData();

  const [activeTab, setActiveTab] = useState(quickAddDefaultType || 'company');

  // Medicine Form State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 ml / 1 Tablet');
  const [medType, setMedType] = useState<any>('Topical Solution');
  const [medTiming, setMedTiming] = useState<any>('Night');
  const [medPurpose, setMedPurpose] = useState('');

  // Company Form State
  const [compName, setCompName] = useState('');
  const [compIndustry, setCompIndustry] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compRole, setCompRole] = useState('');
  const [compInterviewDate, setCompInterviewDate] = useState('');
  const [compWhy, setCompWhy] = useState('');

  // Question Form State
  const [qTitle, setQTitle] = useState('');
  const [qCategory, setQCategory] = useState(categories[0] || 'HR');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qAnswer, setQAnswer] = useState('');
  const [qCompanyId, setQCompanyId] = useState('');

  // Guesstimate Form State
  const [gQuestion, setGQuestion] = useState('');
  const [gCategory, setGCategory] = useState('Market Sizing');
  const [gDifficulty, setGDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [gApproach, setGApproach] = useState('');

  // GD Topic Form State
  const [gdTopic, setGdTopic] = useState('');
  const [gdCategory, setGdCategory] = useState('Economy');
  const [gdPosition, setGdPosition] = useState<'For' | 'Against' | 'Neutral / Balanced'>('Neutral / Balanced');
  const [gdSummary, setGdSummary] = useState('');

  // News Form State
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsCategory, setNewsCategory] = useState('Business');
  const [newsLink, setNewsLink] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsTakeaway, setNewsTakeaway] = useState('');

  // Data Point Form State
  const [dpStatName, setDpStatName] = useState('');
  const [dpNumber, setDpNumber] = useState('');
  const [dpUnit, setDpUnit] = useState('');
  const [dpTopic, setDpTopic] = useState('Fintech');
  const [dpHowToUse, setDpHowToUse] = useState('GD / Interview');

  // Mistake Form State
  const [mTitle, setMTitle] = useState('');
  const [mCategory, setMCategory] = useState('Interview');
  const [mWhatIDid, setMWhatIDid] = useState('');
  const [mCorrectApproach, setMCorrectApproach] = useState('');
  const [mHowToAvoid, setMHowToAvoid] = useState('');

  // Daily Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Interview Prep');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [taskMinutes, setTaskMinutes] = useState(20);

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'company') {
      if (!compName.trim()) return;
      addCompany({
        name: compName,
        industry: compIndustry || 'General Management',
        website: compWebsite,
        role: compRole,
        interviewDate: compInterviewDate || undefined,
        status: compInterviewDate ? 'Interview Scheduled' : 'Target',
        prepProgress: 20,
        whyThisCompany: compWhy
      });
    } else if (activeTab === 'question') {
      if (!qTitle.trim()) return;
      const compObj = companies.find(c => c.id === qCompanyId);
      addQuestion({
        question: qTitle,
        category: qCategory,
        difficulty: qDifficulty,
        myAnswer: qAnswer,
        companyId: qCompanyId || undefined,
        companyName: compObj?.name,
        confidence: 3,
        status: qAnswer ? 'Practiced' : 'Needs Practice',
        practiceCount: qAnswer ? 1 : 0,
        tags: [qCategory]
      });
    } else if (activeTab === 'guesstimate') {
      if (!gQuestion.trim()) return;
      addGuesstimate({
        question: gQuestion,
        category: gCategory,
        difficulty: gDifficulty,
        approachNotes: gApproach,
        variables: [
          { id: 'v1', name: 'Base Variable', value: 1000000, unit: 'units', notes: 'Initial baseline' }
        ],
        formula: 'v1',
        confidence: 3,
        practiceCount: 0,
        status: 'In Progress',
        keyAssumptions: []
      });
    } else if (activeTab === 'gd') {
      if (!gdTopic.trim()) return;
      addGDTopic({
        topic: gdTopic,
        category: gdCategory,
        dateAdded: new Date().toISOString().split('T')[0],
        summary: gdSummary || 'Summary under formulation...',
        myPosition: gdPosition,
        argumentsFor: [],
        argumentsAgainst: [],
        examples: [],
        dataPoints: [],
        status: 'In Progress',
        confidence: 3
      });
    } else if (activeTab === 'news') {
      if (!newsHeadline.trim()) return;
      addNews({
        headline: newsHeadline,
        category: newsCategory,
        sourceLink: newsLink,
        date: new Date().toISOString().split('T')[0],
        summary: newsSummary,
        keyTakeaways: newsTakeaway ? [newsTakeaway] : [],
        whyItMatters: 'Direct impact on industry margins and macro trends.',
        gdRelevance: 'Relevant for business & economy discussion rounds.'
      });
    } else if (activeTab === 'datapoint') {
      if (!dpStatName.trim()) return;
      addDataPoint({
        statName: dpStatName,
        numberValue: dpNumber,
        unit: dpUnit,
        topic: dpTopic,
        date: new Date().toISOString().split('T')[0],
        context: 'Placement repository metric.',
        howToUse: dpHowToUse
      });
    } else if (activeTab === 'mistake') {
      if (!mTitle.trim()) return;
      addMistake({
        mistakeTitle: mTitle,
        category: mCategory,
        whatIDid: mWhatIDid,
        whatIShouldHaveDone: mCorrectApproach,
        correctApproach: mCorrectApproach,
        whyIMadeIt: 'Lack of preparation or pressure.',
        howToAvoid: mHowToAvoid,
        frequency: 1,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      });
    } else if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      addDailyTask({
        title: taskTitle,
        category: taskCategory,
        priority: taskPriority,
        targetMinutes: taskMinutes,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      });
    } else if (activeTab === 'medicine') {
      if (!medName.trim()) return;
      addMedicine({
        name: medName.trim(),
        dosage: medDosage.trim() || '1 Dose',
        type: medType,
        timing: medTiming,
        frequency: 'Daily',
        purpose: medPurpose.trim(),
        instructions: '',
        color: 'emerald',
        reminderTime: '22:30',
        isActive: true,
        startDate: new Date().toISOString().split('T')[0]
      });
    }

    setIsQuickAddOpen(false);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Target },
    { id: 'question', label: 'Question', icon: Mic2 },
    { id: 'guesstimate', label: 'Guesstimate', icon: Calculator },
    { id: 'gd', label: 'GD Topic', icon: Newspaper },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'datapoint', label: 'Data Point', icon: Database },
    { id: 'mistake', label: 'Mistake', icon: AlertTriangle },
    { id: 'task', label: 'Daily Task', icon: Sparkles },
    { id: 'medicine', label: 'Medicine', icon: Pill }
  ];

  return (
    <div 
      id="quick_add_modal_backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Plus className="w-5 h-5 text-blue-400" />
            <span>Quick Add to Placement OS</span>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entity Selector Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-neutral-950/40 border-b border-neutral-800 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {activeTab === 'company' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boston Consulting Group (BCG)"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Strategy Consulting, FMCG, Tech"
                    value={compIndustry}
                    onChange={(e) => setCompIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Associate, Product Manager"
                    value={compRole}
                    onChange={(e) => setCompRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={compWebsite}
                    onChange={(e) => setCompWebsite(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Interview Date (Optional)</label>
                  <input
                    type="date"
                    value={compInterviewDate}
                    onChange={(e) => setCompInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Why This Company?</label>
                <textarea
                  rows={2}
                  placeholder="Key attraction points, differentiators, and culture alignment..."
                  value={compWhy}
                  onChange={(e) => setCompWhy(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'question' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Interview Question <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Walk me through a time you failed and what you learned."
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Link to Company</label>
                  <select
                    value={qCompanyId}
                    onChange={(e) => setQCompanyId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- General / No Company --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Draft Answer (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Structure your answer using STAR or MECE framework..."
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'guesstimate' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Guesstimate Question <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Estimate the number of electric buses required in Bangalore."
                  value={gQuestion}
                  onChange={(e) => setGQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={gCategory}
                    onChange={(e) => setGCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
                  <select
                    value={gDifficulty}
                    onChange={(e) => setGDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Initial Approach Notes</label>
                <textarea
                  rows={2}
                  placeholder="Outline demographic splits or capacity limits..."
                  value={gApproach}
                  onChange={(e) => setGApproach(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'gd' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  GD Topic <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Should India adopt a Universal Basic Income (UBI)?"
                  value={gdTopic}
                  onChange={(e) => setGdTopic(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={gdCategory}
                    onChange={(e) => setGdCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">My Position</label>
                  <select
                    value={gdPosition}
                    onChange={(e) => setGdPosition(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Neutral / Balanced">Neutral / Balanced</option>
                    <option value="For">For (Proponent)</option>
                    <option value="Against">Against (Opponent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Brief Summary</label>
                <textarea
                  rows={2}
                  placeholder="Core theme and context of the debate..."
                  value={gdSummary}
                  onChange={(e) => setGdSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Headline <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global trade corridors reroute as freight rates climb"
                  value={newsHeadline}
                  onChange={(e) => setNewsHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Source URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newsLink}
                    onChange={(e) => setNewsLink(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Key Takeaway</label>
                <textarea
                  rows={2}
                  placeholder="What is the critical insight for interviews or GDs?"
                  value={newsTakeaway}
                  onChange={(e) => setNewsTakeaway(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'datapoint' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Statistic / Metric Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India's Digital Payments Volume"
                  value={dpStatName}
                  onChange={(e) => setDpStatName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Number / Figure</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15.4 Billion"
                    value={dpNumber}
                    onChange={(e) => setDpNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. transactions / month"
                    value={dpUnit}
                    onChange={(e) => setDpUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={dpTopic}
                    onChange={(e) => setDpTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">How To Use</label>
                  <input
                    type="text"
                    value={dpHowToUse}
                    onChange={(e) => setDpHowToUse(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mistake' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Mistake Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forgot to state hypothesis upfront in profitability case"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <select
                  value={mCategory}
                  onChange={(e) => setMCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Interview">Interview</option>
                  <option value="Guesstimate">Guesstimate</option>
                  <option value="Case">Case / GTM</option>
                  <option value="GD">GD & Current Affairs</option>
                  <option value="Communication">Communication</option>
                  <option value="Domain">Domain Knowledge</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">What I Did</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the error made..."
                    value={mWhatIDid}
                    onChange={(e) => setMWhatIDid(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Correct Approach</label>
                  <textarea
                    rows={2}
                    placeholder="What should have been done instead..."
                    value={mCorrectApproach}
                    onChange={(e) => setMCorrectApproach(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">How To Avoid in Future</label>
                <input
                  type="text"
                  placeholder="Actionable trigger rule..."
                  value={mHowToAvoid}
                  onChange={(e) => setMHowToAvoid(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'task' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Task Description <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Practice 3 HR questions & record audio"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Guesstimate Lab">Guesstimate Lab</option>
                    <option value="Company Research">Company Research</option>
                    <option value="GD & Current Affairs">GD & Current Affairs</option>
                    <option value="Daily Growth">Daily Growth</option>
                    <option value="Mistake Bank">Mistake Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Minutes</label>
                  <input
                    type="number"
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medicine' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Medicine / Supplement Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minoxidil 5%, Multivitamin, Finasteride"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Dosage Amount</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 ml, 1 Tablet"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Formulation Type</label>
                  <select
                    value={medType}
                    onChange={(e) => setMedType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Topical Solution">Topical Solution / Serum</option>
                    <option value="Tablet / Pill">Tablet / Pill</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Powder / Supplement">Powder / Supplement</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Timing</label>
                  <select
                    value={medTiming}
                    onChange={(e) => setMedTiming(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Night">Night (Pre-bed)</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon / Lunch</option>
                    <option value="Evening">Evening</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Health Purpose / Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Hair Density Stimulation, Immune Support"
                  value={medPurpose}
                  onChange={(e) => setMedPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40"
            >
              <Check className="w-4 h-4" />
              <span>Create Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
