import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  Database, 
  Star, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Scale,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  SlidersHorizontal,
  Bookmark,
  Quote,
  Lightbulb,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GDTopic, NewsItem, DataPoint } from '../types';
import { CustomFieldsManager } from '../components/CustomFieldsManager';
import { CustomFieldDisplay } from '../components/CustomFieldRenderer';

export const GDCurrectAffairsView: React.FC = () => {
  const { 
    gdTopics = [], 
    addGDTopic, 
    updateGDTopic, 
    deleteGDTopic, 
    toggleGDTopicFavorite,
    news = [], 
    newsItems = [],
    addNews, 
    deleteNews, 
    dataPoints = [], 
    addDataPoint, 
    deleteDataPoint,
    customFields = [],
    showToast
  } = useData();

  // Active articles list (supporting both news & newsItems)
  const currentNewsList = news && news.length > 0 ? news : (newsItems || []);

  const [activeTab, setActiveTab] = useState<'gd' | 'news' | 'facts'>('gd');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedGDId, setSelectedGDId] = useState<string | null>(() => (gdTopics && gdTopics.length > 0 ? gdTopics[0].id : null));
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Re-sync selected GD if none selected
  useEffect(() => {
    if ((!selectedGDId || !gdTopics.some(t => t.id === selectedGDId)) && gdTopics.length > 0) {
      setSelectedGDId(gdTopics[0].id);
    }
  }, [gdTopics, selectedGDId]);

  // Modals
  const [showGDModal, setShowGDModal] = useState(false);
  const [editingGDItem, setEditingGDItem] = useState<GDTopic | null>(null);
  const [confirmDeleteGDId, setConfirmDeleteGDId] = useState<string | null>(null);
  const [confirmDeleteNewsId, setConfirmDeleteNewsId] = useState<string | null>(null);
  const [confirmDeleteFactId, setConfirmDeleteFactId] = useState<string | null>(null);
  
  // GD Modal Form States
  const [gdTopicTitle, setGdTopicTitle] = useState('');
  const [gdCategory, setGdCategory] = useState('Business & Economy');
  const [gdSummary, setGdSummary] = useState('');
  const [gdPosition, setGdPosition] = useState<'For' | 'Against' | 'Neutral / Balanced'>('Neutral / Balanced');
  const [gdOpeningStatement, setGdOpeningStatement] = useState('');
  const [gdConclusion, setGdConclusion] = useState('');
  const [gdStatus, setGdStatus] = useState<'To Read' | 'In Progress' | 'Prepared' | 'Mastered'>('Prepared');
  const [gdConfidence, setGdConfidence] = useState(4);
  const [gdSource, setGdSource] = useState('');

  // News Modal States
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsCategory, setNewsCategory] = useState('Technology & Economy');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsWhyItMatters, setNewsWhyItMatters] = useState('');
  const [newsTakeawaysText, setNewsTakeawaysText] = useState('');
  const [newsSourceLink, setNewsSourceLink] = useState('');
  const [newsSourceName, setNewsSourceName] = useState('');
  const [newsPotentialQ, setNewsPotentialQ] = useState('');

  // Benchmark Fact Modal States
  const [showFactModal, setShowFactModal] = useState(false);
  const [newStatName, setNewStatName] = useState('');
  const [newNumberVal, setNewNumberVal] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newTopic, setNewTopic] = useState('Fintech / DPI');
  const [newContext, setNewContext] = useState('');
  const [newHowToUse, setNewHowToUse] = useState('');
  const [newSource, setNewSource] = useState('');

  // Inline Argument States
  const [newArgFor, setNewArgFor] = useState('');
  const [newArgAgainst, setNewArgAgainst] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newDataPoint, setNewDataPoint] = useState('');

  // Speech Rehearsal Timer for GD Opening
  const [isSpeechTimerActive, setIsSpeechTimerActive] = useState(false);
  const [speechSeconds, setSpeechSeconds] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (isSpeechTimerActive && speechSeconds > 0) {
      interval = setInterval(() => {
        setSpeechSeconds(prev => prev - 1);
      }, 1000);
    } else if (speechSeconds === 0) {
      setIsSpeechTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isSpeechTimerActive, speechSeconds]);

  const selectedGD = (gdTopics || []).find((t) => t.id === selectedGDId) || (gdTopics || [])[0];

  const gdCategories = ['All', 'Business & Economy', 'Technology & AI', 'Economy & Policy', 'Corporate Governance', 'Finance & Geopolitics'];
  const newsCategories = ['All', 'Technology & Economy', 'Finance & Macroeconomics', 'Manufacturing & Geopolitics', 'Fintech & Digital Public Infrastructure', 'Private Equity & M&A'];

  const filteredGDTopics = (gdTopics || []).filter((t) => {
    const matchesSearch = (t.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredNews = (currentNewsList || []).filter((n) => {
    const matchesSearch = (n.headline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredDataPoints = (dataPoints || []).filter((d) => {
    return (d.statName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.context || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCopyText = (text: string, id: string, message: string = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (showToast) showToast(message);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAddGD = () => {
    setEditingGDItem(null);
    setGdTopicTitle('');
    setGdCategory('Business & Economy');
    setGdSummary('');
    setGdPosition('Neutral / Balanced');
    setGdOpeningStatement('');
    setGdConclusion('');
    setGdStatus('Prepared');
    setGdConfidence(4);
    setGdSource('');
    setShowGDModal(true);
  };

  const handleOpenEditGD = (topic: GDTopic) => {
    setEditingGDItem(topic);
    setGdTopicTitle(topic.topic);
    setGdCategory(topic.category);
    setGdSummary(topic.summary);
    setGdPosition(topic.myPosition);
    setGdOpeningStatement(topic.openingStatement || '');
    setGdConclusion(topic.conclusion || '');
    setGdStatus(topic.status);
    setGdConfidence(topic.confidence || 4);
    setGdSource(topic.source || '');
    setShowGDModal(true);
  };

  const handleSaveGDModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdTopicTitle.trim()) return;

    if (editingGDItem) {
      updateGDTopic(editingGDItem.id, {
        topic: gdTopicTitle,
        category: gdCategory,
        summary: gdSummary,
        myPosition: gdPosition,
        openingStatement: gdOpeningStatement,
        conclusion: gdConclusion,
        status: gdStatus,
        confidence: gdConfidence,
        source: gdSource
      });
      if (showToast) showToast('GD topic updated successfully');
    } else {
      const newId = addGDTopic({
        topic: gdTopicTitle,
        category: gdCategory,
        dateAdded: new Date().toISOString().split('T')[0],
        summary: gdSummary || 'Discussion overview and scope notes.',
        myPosition: gdPosition,
        argumentsFor: ['Strong commercial acceleration and productivity lift'],
        argumentsAgainst: ['Regulatory oversight and transition friction concerns'],
        examples: ['Recent corporate pilot implementations'],
        dataPoints: ['Projected 25%+ CAGR'],
        openingStatement: gdOpeningStatement,
        conclusion: gdConclusion,
        status: gdStatus,
        confidence: gdConfidence,
        source: gdSource
      });
      setSelectedGDId(newId);
      if (showToast) showToast('New GD topic created');
    }
    setShowGDModal(false);
  };

  const handleAddArgFor = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const topic = selectedGD || (gdTopics && gdTopics.length > 0 ? gdTopics[0] : null);
    if (!topic) {
      if (showToast) showToast('Please select a GD topic first');
      return;
    }
    if (!newArgFor.trim()) {
      if (showToast) showToast('Please enter an argument in favor first');
      return;
    }
    const currentArgs = Array.isArray(topic.argumentsFor) ? topic.argumentsFor : [];
    const updated = [...currentArgs, newArgFor.trim()];
    updateGDTopic(topic.id, { argumentsFor: updated });
    setNewArgFor('');
    if (showToast) showToast('Added argument in favor');
  };

  const handleAddArgAgainst = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const topic = selectedGD || (gdTopics && gdTopics.length > 0 ? gdTopics[0] : null);
    if (!topic) {
      if (showToast) showToast('Please select a GD topic first');
      return;
    }
    if (!newArgAgainst.trim()) {
      if (showToast) showToast('Please enter a counter-argument first');
      return;
    }
    const currentArgs = Array.isArray(topic.argumentsAgainst) ? topic.argumentsAgainst : [];
    const updated = [...currentArgs, newArgAgainst.trim()];
    updateGDTopic(topic.id, { argumentsAgainst: updated });
    setNewArgAgainst('');
    if (showToast) showToast('Added counter-argument');
  };

  const handleAddExample = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const topic = selectedGD || (gdTopics && gdTopics.length > 0 ? gdTopics[0] : null);
    if (!topic) {
      if (showToast) showToast('Please select a GD topic first');
      return;
    }
    if (!newExample.trim()) {
      if (showToast) showToast('Please enter a case study or citation first');
      return;
    }
    const current = Array.isArray(topic.examples) ? topic.examples : [];
    const updated = [...current, newExample.trim()];
    updateGDTopic(topic.id, { examples: updated });
    setNewExample('');
    if (showToast) showToast('Added case study citation');
  };

  const handleAddDataPointTag = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const topic = selectedGD || (gdTopics && gdTopics.length > 0 ? gdTopics[0] : null);
    if (!topic) {
      if (showToast) showToast('Please select a GD topic first');
      return;
    }
    if (!newDataPoint.trim()) {
      if (showToast) showToast('Please enter a data metric first');
      return;
    }
    const current = Array.isArray(topic.dataPoints) ? topic.dataPoints : [];
    const updated = [...current, newDataPoint.trim()];
    updateGDTopic(topic.id, { dataPoints: updated });
    setNewDataPoint('');
    if (showToast) showToast('Added data metric citation');
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsHeadline.trim()) return;

    const takeaways = newsTakeawaysText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    addNews({
      headline: newsHeadline,
      category: newsCategory,
      date: new Date().toISOString().split('T')[0],
      summary: newsSummary || 'Summary of recent industry development.',
      whyItMatters: newsWhyItMatters || 'High strategic relevance for corporate strategy rounds.',
      gdRelevance: 'Can be cited to demonstrate sharp macro-economic awareness.',
      keyTakeaways: takeaways.length > 0 ? takeaways : ['Demonstrates ongoing sector transformation'],
      sourceLink: newsSourceLink || undefined,
      sourceName: newsSourceName || 'Industry Report',
      potentialInterviewQuestion: newsPotentialQ || undefined
    });

    setShowNewsModal(false);
    setNewsHeadline('');
    setNewsSummary('');
    setNewsWhyItMatters('');
    setNewsTakeawaysText('');
    setNewsSourceLink('');
    setNewsSourceName('');
    setNewsPotentialQ('');
    if (showToast) showToast('Added news article to database');
  };

  const handleSaveFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatName.trim()) return;

    addDataPoint({
      statName: newStatName,
      numberValue: newNumberVal || '100M+',
      unit: newUnit || 'metrics',
      topic: newTopic || 'Macro Economy',
      context: newContext || 'Key economic indicator for market sizing.',
      howToUse: newHowToUse || 'Cite as foundational metric in opening statements.',
      source: newSource || undefined,
      date: new Date().toISOString().split('T')[0]
    });

    setShowFactModal(false);
    setNewStatName('');
    setNewNumberVal('');
    setNewUnit('');
    setNewContext('');
    setNewHowToUse('');
    setNewSource('');
    if (showToast) showToast('Benchmark metric saved!');
  };

  const gdCustomFields = (customFields || []).filter(f => f.entityType === 'gdTopic');

  return (
    <div id="gd_current_affairs_container" className="space-y-6 animate-in fade-in duration-200">
      <CustomFieldsManager
        entityType="gdTopic"
        isOpen={isFieldManagerOpen}
        onClose={() => setIsFieldManagerOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-purple-600" />
            <span>GD Preparation & Current Affairs OS</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Master group discussions, structured debate cases, business news takeaways, and authoritative data benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'gd' && (
            <button
              onClick={handleOpenAddGD}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/30 transition-all cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add GD Topic</span>
            </button>
          )}

          {activeTab === 'news' && (
            <button
              onClick={() => setShowNewsModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add News Article</span>
            </button>
          )}

          {activeTab === 'facts' && (
            <button
              onClick={() => setShowFactModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Data Point</span>
            </button>
          )}

          <button
            onClick={() => setIsFieldManagerOpen(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors"
            title="Manage custom fields"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Custom Fields</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => { setActiveTab('gd'); setCategoryFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'gd'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <Scale className="w-4 h-4 text-purple-400" />
          <span>GD Topics & Debates</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-purple-950/80 text-purple-300 font-mono">
            {(gdTopics || []).length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('news'); setCategoryFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'news'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span>Daily News & Takeaways</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-950/80 text-blue-300 font-mono">
            {(currentNewsList || []).length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('facts'); setCategoryFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'facts'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Macro Data Bank</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-950/80 text-emerald-300 font-mono">
            {(dataPoints || []).length}
          </span>
        </button>
      </div>

      {/* TAB 1: GD TOPICS & DEBATES */}
      {activeTab === 'gd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topic List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search GD debate topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-neutral-800/80">
                {gdCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all ${
                      categoryFilter === cat
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Scrollable List */}
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto custom-scrollbar pr-1">
              {filteredGDTopics.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 text-neutral-500 text-xs">
                  No matching GD topics found. Click <strong>+ Add GD Topic</strong> above.
                </div>
              ) : (
                filteredGDTopics.map((topic) => {
                  const isSelected = selectedGD?.id === topic.id;
                  const totalPoints = (topic.argumentsFor || []).length + (topic.argumentsAgainst || []).length;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedGDId(topic.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/30 border-purple-500/60 text-white shadow-md'
                          : 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-950 text-purple-300 font-mono border border-neutral-800">
                          {topic.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {totalPoints} arguments
                          </span>
                          {topic.isFavorite && (
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold line-clamp-2 leading-snug">
                        {topic.topic}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2.5 pt-2 border-t border-neutral-800/60">
                        <span className="truncate">Stance: <strong className="text-neutral-200 font-medium">{topic.myPosition || 'Balanced'}</strong></span>
                        <span className="text-amber-400 font-mono shrink-0">{topic.confidence || 4}/5 ★</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected GD Workspace (8 cols) */}
          {selectedGD ? (
            <div className="lg:col-span-8 space-y-5">
              {/* Main Card Header */}
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800/40">
                        {selectedGD.category}
                      </span>
                      <span className="text-neutral-400">• Added: {selectedGD.dateAdded || '2026'}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {selectedGD.status}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                      {selectedGD.topic}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => toggleGDTopicFavorite && toggleGDTopicFavorite(selectedGD.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        selectedGD.isFavorite 
                          ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' 
                          : 'text-neutral-400 hover:text-white bg-neutral-800/60'
                      }`}
                      title={selectedGD.isFavorite ? 'Favorited' : 'Add to Favorites'}
                    >
                      <Star className={`w-4 h-4 ${selectedGD.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEditGD(selectedGD)}
                      className="p-2 text-neutral-300 hover:text-white rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
                      title="Edit Topic"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {confirmDeleteGDId === selectedGD.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-800/80 px-2 py-1 rounded-xl">
                        <span className="text-[11px] text-rose-200 font-medium whitespace-nowrap">Delete topic?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteGDTopic(selectedGD.id);
                            setConfirmDeleteGDId(null);
                          }}
                          className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteGDId(null)}
                          className="px-1.5 py-0.5 text-[11px] text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteGDId(selectedGD.id)}
                        className="p-2 text-neutral-400 hover:text-rose-400 rounded-xl bg-neutral-800/60 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete GD Topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Debate Scope Overview */}
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs sm:text-sm text-neutral-300 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Debate Overview & Scope:</span>
                  </span>
                  <p className="leading-relaxed">{selectedGD.summary || 'Analyze both sides of the debate with balanced economic framing.'}</p>
                </div>

                {/* Stance Selector */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-xs font-semibold text-neutral-300">My Adopted Stance:</span>
                  <div className="flex items-center gap-2">
                    {(['For', 'Neutral / Balanced', 'Against'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => updateGDTopic(selectedGD.id, { myPosition: pos })}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          selectedGD.myPosition === pos
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 60-Second Opening Statement & Speech Rehearsal Module */}
              {selectedGD.openingStatement && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                      <Quote className="w-4 h-4 text-purple-400" />
                      <span>Opening Pitch / Statement Rehearsal</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm font-bold text-amber-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                        {speechSeconds}s
                      </div>
                      <button
                        onClick={() => setIsSpeechTimerActive(!isSpeechTimerActive)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                          isSpeechTimerActive
                            ? 'bg-amber-600 text-white'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        {isSpeechTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isSpeechTimerActive ? 'Pause' : 'Start 60s Rehearsal'}</span>
                      </button>
                      <button
                        onClick={() => { setIsSpeechTimerActive(false); setSpeechSeconds(60); }}
                        className="p-1 text-neutral-400 hover:text-white rounded bg-neutral-800"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 italic leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                    "{selectedGD.openingStatement}"
                  </p>

                  {/* Speech Progress Bar */}
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${((60 - speechSeconds) / 60) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Arguments Split: FOR vs AGAINST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arguments FOR */}
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-emerald-800/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Arguments FOR (Proponents)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                      {(selectedGD.argumentsFor || []).length}
                    </span>
                  </div>

                  <form onSubmit={handleAddArgFor} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add argument in favor..."
                      value={newArgFor}
                      onChange={(e) => setNewArgFor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddArgFor(e);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddArgFor}
                      className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                      title="Add argument in favor"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {(selectedGD.argumentsFor || []).map((arg, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-200 group hover:border-emerald-800/50 transition-all"
                      >
                        <span className="leading-relaxed flex-1">{arg}</span>
                        <button
                          onClick={() => {
                            const updated = (selectedGD.argumentsFor || []).filter((_, i) => i !== idx);
                            updateGDTopic(selectedGD.id, { argumentsFor: updated });
                          }}
                          className="text-neutral-500 hover:text-rose-400 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                          title="Remove argument"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arguments AGAINST */}
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-rose-800/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-400">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4" />
                      <span>Arguments AGAINST (Opponents)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-rose-950 px-2 py-0.5 rounded text-rose-300">
                      {(selectedGD.argumentsAgainst || []).length}
                    </span>
                  </div>

                  <form onSubmit={handleAddArgAgainst} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add counter-argument..."
                      value={newArgAgainst}
                      onChange={(e) => setNewArgAgainst(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddArgAgainst(e);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddArgAgainst}
                      className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                      title="Add counter-argument"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {(selectedGD.argumentsAgainst || []).map((arg, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-200 group hover:border-rose-800/50 transition-all"
                      >
                        <span className="leading-relaxed flex-1">{arg}</span>
                        <button
                          onClick={() => {
                            const updated = (selectedGD.argumentsAgainst || []).filter((_, i) => i !== idx);
                            updateGDTopic(selectedGD.id, { argumentsAgainst: updated });
                          }}
                          className="text-neutral-500 hover:text-rose-400 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                          title="Remove counter-argument"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Studies, Real-World Examples & Data Citations */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    <span>Case Studies & Real-World Citations:</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(selectedGD.examples || []).map((ex, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-800/40 text-blue-300 text-xs font-medium"
                      >
                        <span>📌 {ex}</span>
                        <button
                          onClick={() => {
                            const updated = (selectedGD.examples || []).filter((_, idx) => idx !== i);
                            updateGDTopic(selectedGD.id, { examples: updated });
                          }}
                          className="text-blue-400 hover:text-rose-400 ml-1 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {(selectedGD.dataPoints || []).map((dp, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 text-xs font-medium"
                      >
                        <span>📊 {dp}</span>
                        <button
                          onClick={() => {
                            const updated = (selectedGD.dataPoints || []).filter((_, idx) => idx !== i);
                            updateGDTopic(selectedGD.id, { dataPoints: updated });
                          }}
                          className="text-emerald-400 hover:text-rose-400 ml-1 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Inline quick add tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                    <form onSubmit={handleAddExample} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Add case study (e.g. Klarna AI bot)..."
                        value={newExample}
                        onChange={(e) => setNewExample(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExample(e);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddExample}
                        className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                        title="Add case study citation"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    <form onSubmit={handleAddDataPointTag} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Add data metric (e.g. 60% workforce exposure)..."
                        value={newDataPoint}
                        onChange={(e) => setNewDataPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDataPointTag(e);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddDataPointTag}
                        className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                        title="Add data metric"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Conclusion & Strategic Wrap-up */}
              {selectedGD.conclusion && (
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                    Strategic Conclusion / Consensus Synthesis:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{selectedGD.conclusion}</p>
                </div>
              )}

              {/* Custom Fields */}
              {gdCustomFields.length > 0 && selectedGD.customFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {gdCustomFields.map((field) => (
                    <CustomFieldDisplay
                      key={field.id}
                      field={field}
                      value={selectedGD.customFields?.[field.id]}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-8 p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-400">
              Select a GD topic from the list to view its complete debate framework and practice drills.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DAILY NEWS & TAKEAWAYS */}
      {activeTab === 'news' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search market developments, policy updates & corporate news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-all ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 text-neutral-400 space-y-2">
              <Newspaper className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold">No news articles found.</p>
              <p className="text-xs text-neutral-500">Click "+ Add News Article" to log a fresh market development.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                        {article.category}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">{article.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {article.headline}
                    </h3>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* Key Takeaways */}
                    {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                      <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                          Key MBA Takeaways:
                        </span>
                        <ul className="space-y-1">
                          {article.keyTakeaways.map((t, idx) => (
                            <li key={idx} className="text-xs text-neutral-300 flex items-start gap-1.5">
                              <span className="text-purple-400 shrink-0">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Why It Matters */}
                    {article.whyItMatters && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                          Why It Matters for GD & Interviews:
                        </span>
                        <p>{article.whyItMatters}</p>
                      </div>
                    )}

                    {/* Potential Interview Question */}
                    {article.potentialInterviewQuestion && (
                      <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-200 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          <span>Interview Probe Question:</span>
                        </span>
                        <p className="italic">"{article.potentialInterviewQuestion}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                    <div className="flex items-center gap-2">
                      {article.sourceLink ? (
                        <a
                          href={article.sourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                        >
                          <span>{article.sourceName || 'Read Source'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-neutral-500">{article.sourceName || 'Internal Placement OS Note'}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyText(
                          `${article.headline}\n\nKey Takeaways:\n${(article.keyTakeaways || []).join('\n')}\n\nWhy It Matters:\n${article.whyItMatters}`,
                          article.id,
                          'Article summary copied!'
                        )}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                        title="Copy Summary"
                      >
                        {copiedId === article.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {confirmDeleteNewsId === article.id ? (
                        <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-800 px-1.5 py-0.5 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              deleteNews(article.id);
                              setConfirmDeleteNewsId(null);
                            }}
                            className="text-[10px] font-bold text-rose-300 hover:text-white"
                          >
                            Del
                          </button>
                          <span className="text-neutral-500 text-[10px]">/</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteNewsId(null)}
                            className="text-[10px] text-neutral-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteNewsId(article.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATA POINTS & MACRO BENCHMARK STATS */}
      {activeTab === 'facts' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search metrics, population stats, GDP indicators, penetration benchmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowFactModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer w-fit shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Benchmark Fact</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDataPoints.map((dp) => (
              <div
                key={dp.id}
                className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span className="font-semibold text-blue-400 uppercase font-mono text-[11px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800/30">
                      {dp.topic}
                    </span>
                    <span className="text-[11px]">{dp.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-100">{dp.statName}</h3>

                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono my-2 tracking-tight">
                    {dp.numberValue} <span className="text-xs text-neutral-400 font-normal font-sans">{dp.unit}</span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">{dp.context}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300">
                    <span className="font-bold text-amber-400 block mb-0.5">How To Quote in GD / Case:</span>
                    {dp.howToUse}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-500 truncate max-w-[150px]">
                      Source: {dp.source || 'Official Benchmark'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(
                          `${dp.statName}: ${dp.numberValue} ${dp.unit} (${dp.context})`,
                          dp.id,
                          'Metric citation copied!'
                        )}
                        className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1"
                        title="Copy formatted citation"
                      >
                        {copiedId === dp.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === dp.id ? 'Copied' : 'Quote'}</span>
                      </button>

                      {confirmDeleteFactId === dp.id ? (
                        <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-800 px-1.5 py-0.5 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              deleteDataPoint(dp.id);
                              setConfirmDeleteFactId(null);
                            }}
                            className="text-[10px] font-bold text-rose-300 hover:text-white"
                          >
                            Del
                          </button>
                          <span className="text-neutral-500 text-[10px]">/</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteFactId(null)}
                            className="text-[10px] text-neutral-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteFactId(dp.id)}
                          className="p-1 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40"
                          title="Delete data point"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT GD TOPIC */}
      {showGDModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-purple-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                <span>{editingGDItem ? 'Edit Group Discussion Topic' : 'Add New Group Discussion Topic'}</span>
              </h3>
              <button
                onClick={() => setShowGDModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGDModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Topic Title / Debate Motion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quick Commerce vs Kirana Stores: Is Hyperlocal Delivery Sustainable?"
                  value={gdTopicTitle}
                  onChange={(e) => setGdTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={gdCategory}
                    onChange={(e) => setGdCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Business & Economy">Business & Economy</option>
                    <option value="Technology & AI">Technology & AI</option>
                    <option value="Economy & Policy">Economy & Policy</option>
                    <option value="Corporate Governance">Corporate Governance</option>
                    <option value="Finance & Geopolitics">Finance & Geopolitics</option>
                    <option value="General / Abstract">General / Abstract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">My Position</label>
                  <select
                    value={gdPosition}
                    onChange={(e) => setGdPosition(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="For">For (Proponent)</option>
                    <option value="Neutral / Balanced">Neutral / Balanced</option>
                    <option value="Against">Against (Opponent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Confidence Rating</label>
                  <select
                    value={gdConfidence}
                    onChange={(e) => setGdConfidence(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value={5}>5 / 5 ★ (Mastered)</option>
                    <option value={4}>4 / 5 ★ (High)</option>
                    <option value={3}>3 / 5 ★ (Moderate)</option>
                    <option value={2}>2 / 5 ★ (Needs Reading)</option>
                    <option value={1}>1 / 5 ★ (New Topic)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Debate Scope & Context Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the core tension, stakeholders, and macro implications..."
                  value={gdSummary}
                  onChange={(e) => setGdSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  60-Second Opening Statement Pitch
                </label>
                <textarea
                  rows={3}
                  placeholder="Draft your opening hook, 3 issue pillars, and balanced transition..."
                  value={gdOpeningStatement}
                  onChange={(e) => setGdOpeningStatement(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Strategic Conclusion / Consensus Synthesis
                </label>
                <input
                  type="text"
                  placeholder="Summarize the balanced path forward..."
                  value={gdConclusion}
                  onChange={(e) => setGdConclusion(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Source / Citation</label>
                <input
                  type="text"
                  placeholder="e.g. Bain Retail Report & RBI Bulletin"
                  value={gdSource}
                  onChange={(e) => setGdSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowGDModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                >
                  {editingGDItem ? 'Update Topic' : 'Save GD Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEWS ITEM */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-blue-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-400" />
                <span>Log Business News & Takeaway</span>
              </h3>
              <button
                onClick={() => setShowNewsModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semiconductor Fab Ecosystem Breaks Ground with $18B Capital Outlay"
                  value={newsHeadline}
                  onChange={(e) => setNewsHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Technology & Economy">Technology & Economy</option>
                    <option value="Finance & Macroeconomics">Finance & Macroeconomics</option>
                    <option value="Manufacturing & Geopolitics">Manufacturing & Geopolitics</option>
                    <option value="Fintech & Digital Public Infrastructure">Fintech & Digital Public Infrastructure</option>
                    <option value="Private Equity & M&A">Private Equity & M&A</option>
                    <option value="General Business">General Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Source Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Economic Times / Reuters"
                    value={newsSourceName}
                    onChange={(e) => setNewsSourceName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Summary Overview</label>
                <textarea
                  rows={2}
                  placeholder="What is the factual announcement or market shift?"
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Key Takeaways (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="• Strategic implications&#10;• Operational cost impact&#10;• Competitive landscape shift"
                  value={newsTakeawaysText}
                  onChange={(e) => setNewsTakeawaysText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Why It Matters for GD & Interviews
                </label>
                <input
                  type="text"
                  placeholder="e.g. Proof point for India manufacturing PLI and supply chain de-risking..."
                  value={newsWhyItMatters}
                  onChange={(e) => setNewsWhyItMatters(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Source URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newsSourceLink}
                  onChange={(e) => setNewsSourceLink(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Potential Interview Probe Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. How does this policy affect capital allocation across tier-2 cities?"
                  value={newsPotentialQ}
                  onChange={(e) => setNewsPotentialQ(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                >
                  Save News Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD BENCHMARK FACT */}
      {showFactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-emerald-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Add Macro Benchmark Metric</span>
              </h3>
              <button
                onClick={() => setShowFactModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Metric / Statistic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India UPI Monthly Transactions"
                  value={newStatName}
                  onChange={(e) => setNewStatName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Value / Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15.4 Billion"
                    value={newNumberVal}
                    onChange={(e) => setNewNumberVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Unit / Period</label>
                  <input
                    type="text"
                    placeholder="e.g. txns / month or %"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Domain / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Fintech / DPI"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Source (e.g. NPCI/RBI)</label>
                  <input
                    type="text"
                    placeholder="e.g. NPCI August 2026 Report"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Context & Significance</label>
                <textarea
                  rows={2}
                  placeholder="Explain the background or baseline..."
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">How To Quote in GD / Case</label>
                <input
                  type="text"
                  placeholder="e.g. Quote when demonstrating cash displacement velocity..."
                  value={newHowToUse}
                  onChange={(e) => setNewHowToUse(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowFactModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
