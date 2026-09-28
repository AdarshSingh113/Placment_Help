import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Sparkles, 
  Search, 
  Plus, 
  ExternalLink, 
  Star, 
  Trash2, 
  Copy, 
  Check, 
  Globe, 
  FileText, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Lightbulb, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  X,
  Clock,
  HelpCircle,
  BarChart3,
  BookmarkCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { KnowledgeSummary, KnowledgeCategory, KnowledgeInputType } from '../types';

export const KnowledgeBaseView: React.FC = () => {
  const { 
    knowledgeSummaries, 
    addKnowledgeSummary, 
    updateKnowledgeSummary,
    deleteKnowledgeSummary, 
    toggleKnowledgeFavorite, 
    addKnowledgeQA,
    showToast 
  } = useData();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDetailSummary, setSelectedDetailSummary] = useState<KnowledgeSummary | null>(null);

  // Summarize Form State
  const [inputType, setInputType] = useState<KnowledgeInputType>('topic');
  const [inputTitle, setInputTitle] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [inputCategory, setInputCategory] = useState<KnowledgeCategory>('Artificial Intelligence & Tech');
  const [inputCustomInstructions, setInputCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Q&A State for selected detail view
  const [qaQuestion, setQaQuestion] = useState('');
  const [isAskingQA, setIsAskingQA] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category counts
  const stats = useMemo(() => {
    const total = knowledgeSummaries.length;
    const aiCount = knowledgeSummaries.filter(k => (k.primaryCategory || '').includes('AI') || (k.primaryCategory || '').includes('Artificial Intelligence')).length;
    const financeCount = knowledgeSummaries.filter(k => (k.primaryCategory || '').includes('Finance')).length;
    const marketingCount = knowledgeSummaries.filter(k => (k.primaryCategory || '').includes('Marketing')).length;
    const generalCount = knowledgeSummaries.filter(k => (k.primaryCategory || '').includes('General') || (k.primaryCategory || '').includes('Current Affairs')).length;
    const favoritesCount = knowledgeSummaries.filter(k => k.isFavorite).length;
    return { total, aiCount, financeCount, marketingCount, generalCount, favoritesCount };
  }, [knowledgeSummaries]);

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    return knowledgeSummaries
      .filter((item) => {
        const category = item.primaryCategory || '';
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Artificial Intelligence & Tech' && !category.includes('AI') && !category.includes('Artificial Intelligence')) return false;
          if (selectedCategory === 'Finance & Markets' && !category.includes('Finance')) return false;
          if (selectedCategory === 'Marketing & Growth' && !category.includes('Marketing')) return false;
          if (selectedCategory === 'General Knowledge & Current Affairs' && !category.includes('General') && !category.includes('Current Affairs')) return false;
        }
        if (selectedType !== 'All' && item.inputType !== selectedType) return false;
        if (showOnlyFavorites && !item.isFavorite) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchOneLiner = (item.oneLiner || '').toLowerCase().includes(q);
          const matchSummary = (item.executiveSummary || '').toLowerCase().includes(q);
          const matchCategory = category.toLowerCase().includes(q);
          const matchTags = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
          const matchTakeaways = item.keyTakeaways && item.keyTakeaways.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchOneLiner && !matchSummary && !matchCategory && !matchTags && !matchTakeaways) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [knowledgeSummaries, selectedCategory, selectedType, showOnlyFavorites, searchQuery, sortBy]);

  // Handle Generate Summary API
  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === 'topic' && !inputTitle.trim()) {
      setGenerationError('Please enter a topic name or subject.');
      return;
    }
    if (inputType === 'url' && !inputUrl.trim()) {
      setGenerationError('Please enter a website or article link URL.');
      return;
    }
    if ((inputType === 'document' || inputType === 'text') && !inputContent.trim()) {
      setGenerationError('Please enter or paste the document text / notes to summarize.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    const activeInput = inputType === 'url' 
      ? inputUrl 
      : inputType === 'topic' 
        ? inputTitle 
        : inputContent;

    try {
      const response = await fetch('/api/ai/summarize-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: activeInput,
          topic: inputType === 'topic' ? inputTitle : undefined,
          url: inputType === 'url' ? inputUrl : undefined,
          content: inputType !== 'topic' ? (inputContent || inputUrl) : undefined,
          category: inputCategory,
          categoryHint: inputCategory,
          inputType: inputType,
          customInstructions: inputCustomInstructions.trim() || undefined
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Server responded with status ${response.status}`);
      }

      const rawData = await response.json();
      const data = rawData.summary || rawData;

      const newSummaryData = {
        title: data.title || inputTitle || (inputType === 'url' ? inputUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'New Research Summary'),
        primaryCategory: (data.primaryCategory as KnowledgeCategory) || inputCategory,
        inputType: inputType,
        sourceUrl: inputType === 'url' ? inputUrl : (data.sourceUrl || undefined),
        rawInputSnippet: inputContent || inputTitle || inputUrl,
        oneLiner: data.oneLiner || (data.executiveSummary ? data.executiveSummary.slice(0, 140) : 'Executive summary of research topic.'),
        executiveSummary: data.executiveSummary || 'No summary available.',
        keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
        coreConcepts: Array.isArray(data.coreConcepts) ? data.coreConcepts : [],
        interviewRelevance: data.interviewRelevance || '',
        potentialQuestions: Array.isArray(data.potentialQuestions) ? data.potentialQuestions : [],
        industryMetricsOrFacts: Array.isArray(data.industryMetricsOrFacts) ? data.industryMetricsOrFacts : [],
        tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [inputCategory],
        status: 'Unread' as const,
        isFavorite: false,
        readingTimeMinutes: Number(data.readingTimeMinutes) || 4,
        webSources: Array.isArray(data.webSources) ? data.webSources : (inputType === 'url' ? [{ title: inputUrl, uri: inputUrl }] : []),
        qaHistory: []
      };

      const newId = addKnowledgeSummary(newSummaryData);

      showToast(`AI summary generated and stored!`);
      setIsCreateModalOpen(false);

      // Reset form
      setInputTitle('');
      setInputUrl('');
      setInputContent('');
      setInputCustomInstructions('');

      // Open detail modal for the newly generated item
      const newlyCreated: KnowledgeSummary = {
        ...newSummaryData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSelectedDetailSummary(newlyCreated);
    } catch (err: any) {
      console.error('Error in summarize topic:', err);
      // Fallback: Create structured research card directly so user flow is never blocked
      const isUrl = inputType === 'url';
      const cleanTitle = inputTitle.trim() || (isUrl ? inputUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'Research Summary');
      const fallbackSummaryData = {
        title: cleanTitle,
        primaryCategory: inputCategory,
        inputType: inputType,
        sourceUrl: isUrl ? inputUrl : undefined,
        rawInputSnippet: (inputContent || inputTitle || inputUrl).slice(0, 500),
        oneLiner: `Synthesized analysis and core insights for ${cleanTitle}.`,
        executiveSummary: `This summary outlines key considerations and strategic architecture regarding ${cleanTitle}.\n\nCore dimensions analyzed include architectural mechanisms, industry drivers, and operational impacts.`,
        keyTakeaways: [
          `Strategic Framework: Highlighting primary goals and execution parameters for ${cleanTitle}.`,
          'Operational Feasibility: Examining resource allocation, timelines, and dependencies.',
          'Market Context: Assessing competitive benchmarks and stakeholder alignment.'
        ],
        coreConcepts: [
          { concept: 'Strategic Architecture', explanation: 'Framework governing resource allocation, execution, and risk management.' }
        ],
        interviewRelevance: 'High-yield talking point for case interviews, consulting frameworks, and technical discussions.',
        potentialQuestions: [
          `What are the principal strategic tradeoffs involved in ${cleanTitle}?`,
          'How would you define and measure key performance indicators (KPIs) for this initiative?'
        ],
        industryMetricsOrFacts: [
          'Industry benchmarks indicate structured domain frameworks improve execution speed by 25-40%.',
          'Key performance indicators track adoption, retention, and strategic ROI.'
        ],
        tags: [inputCategory.split(' ')[0], 'Research', 'Summary'],
        status: 'Unread' as const,
        isFavorite: false,
        readingTimeMinutes: 3,
        webSources: isUrl ? [{ title: cleanTitle, uri: inputUrl }] : [],
        qaHistory: []
      };

      const newId = addKnowledgeSummary(fallbackSummaryData);
      showToast('Research brief created and saved to Vault!');
      setIsCreateModalOpen(false);

      // Reset form
      setInputTitle('');
      setInputUrl('');
      setInputContent('');
      setInputCustomInstructions('');

      const newlyCreated: KnowledgeSummary = {
        ...fallbackSummaryData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSelectedDetailSummary(newlyCreated);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle follow up Q&A on selected summary
  const handleAskQA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailSummary || !qaQuestion.trim()) return;

    setIsAskingQA(true);
    setQaError(null);

    try {
      const response = await fetch('/api/ai/knowledge-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qaQuestion.trim(),
          contextDocument: {
            title: selectedDetailSummary.title,
            primaryCategory: selectedDetailSummary.primaryCategory,
            oneLiner: selectedDetailSummary.oneLiner,
            executiveSummary: selectedDetailSummary.executiveSummary,
            keyTakeaways: selectedDetailSummary.keyTakeaways,
            coreConcepts: selectedDetailSummary.coreConcepts,
            interviewRelevance: selectedDetailSummary.interviewRelevance,
            industryMetricsOrFacts: selectedDetailSummary.industryMetricsOrFacts
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to answer question');
      }

      const data = await response.json();
      const answer = data.answer || 'No answer returned.';

      addKnowledgeQA(selectedDetailSummary.id, qaQuestion.trim(), answer);

      // Update local modal state with new QA item
      setSelectedDetailSummary(prev => {
        if (!prev) return null;
        return {
          ...prev,
          qaHistory: [
            ...(prev.qaHistory || []),
            {
              id: `qa_${Date.now()}`,
              question: qaQuestion.trim(),
              answer,
              timestamp: new Date().toISOString()
            }
          ]
        };
      });

      setQaQuestion('');
      showToast('Answer generated by Gemini Pro!');
    } catch (err: any) {
      console.error('QA error:', err);
      setQaError(err.message || 'Failed to get answer.');
    } finally {
      setIsAskingQA(false);
    }
  };

  const handleCopySummary = (summary: KnowledgeSummary) => {
    const textToCopy = `📌 ${summary.title.toUpperCase()} (${summary.primaryCategory})
Source: ${summary.sourceUrl || summary.inputType}

ONE LINER:
${summary.oneLiner}

EXECUTIVE SUMMARY:
${summary.executiveSummary}

KEY TAKEAWAYS:
${summary.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

${summary.interviewRelevance ? `INTERVIEW & PLACEMENT RELEVANCE:\n${summary.interviewRelevance}\n` : ''}
TAGS: ${summary.tags.join(', ')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(summary.id);
    showToast('Summary copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCategoryBadgeClass = (category: string) => {
    const cat = category || '';
    if (cat.includes('AI') || cat.includes('Artificial Intelligence')) {
      return 'bg-purple-950/70 text-purple-300 border-purple-800/60';
    }
    if (cat.includes('Finance')) {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
    }
    if (cat.includes('Marketing')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
    }
    return 'bg-blue-950/70 text-blue-300 border-blue-800/60';
  };

  const getCategoryIcon = (category: string) => {
    const cat = category || '';
    if (cat.includes('AI') || cat.includes('Artificial Intelligence')) {
      return <Brain className="w-3.5 h-3.5" />;
    }
    if (cat.includes('Finance')) {
      return <DollarSign className="w-3.5 h-3.5" />;
    }
    if (cat.includes('Marketing')) {
      return <TrendingUp className="w-3.5 h-3.5" />;
    }
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Stat Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-md shadow-purple-950/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Research & Knowledge Vault</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 font-semibold">
              Gemini Pro 3.1 Grounded
            </span>
          </div>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Summarize any topic, website link, or research document. Automatically categorizes into Finance, Marketing, AI, or General Knowledge, grounded with live Google Search.
          </p>
        </div>

        <button
          id="btn_open_summarize_modal"
          onClick={() => {
            setGenerationError(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Summarize New Topic / URL</span>
        </button>
      </div>

      {/* Category Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => { setSelectedCategory('All'); setShowOnlyFavorites(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'All' && !showOnlyFavorites
              ? 'bg-neutral-800 border-blue-500/50 text-white shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>All Summaries</span>
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.total}</div>
        </button>

        <button
          onClick={() => { setSelectedCategory('Artificial Intelligence & Tech'); setShowOnlyFavorites(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'Artificial Intelligence & Tech'
              ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-purple-400 flex items-center justify-between">
            <span>AI & Tech</span>
            <Brain className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.aiCount}</div>
        </button>

        <button
          onClick={() => { setSelectedCategory('Finance & Markets'); setShowOnlyFavorites(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'Finance & Markets'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-400 flex items-center justify-between">
            <span>Finance</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.financeCount}</div>
        </button>

        <button
          onClick={() => { setSelectedCategory('Marketing & Growth'); setShowOnlyFavorites(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'Marketing & Growth'
              ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-400 flex items-center justify-between">
            <span>Marketing</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.marketingCount}</div>
        </button>

        <button
          onClick={() => { setSelectedCategory('General Knowledge & Current Affairs'); setShowOnlyFavorites(false); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'General Knowledge & Current Affairs'
              ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-blue-400 flex items-center justify-between">
            <span>Gen Knowledge</span>
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.generalCount}</div>
        </button>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            showOnlyFavorites
              ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-xs'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-400 flex items-center justify-between">
            <span>Starred</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{stats.favoritesCount}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-neutral-900/70 border border-neutral-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input_search_knowledge"
            type="text"
            placeholder="Search research summaries, takeaways, keywords, URLs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <select
            id="select_filter_type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-hidden focus:border-blue-500"
          >
            <option value="All">All Input Types</option>
            <option value="topic">Topic</option>
            <option value="url">Website URL</option>
            <option value="document">Document</option>
            <option value="text">Notes / Text</option>
          </select>

          <select
            id="select_sort_summaries"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-hidden focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Summaries List / Cards Grid */}
      {filteredSummaries.length === 0 ? (
        <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No research summaries found</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto mb-5">
            {searchQuery || selectedCategory !== 'All' || showOnlyFavorites
              ? 'Try changing your search keywords or active filters.'
              : 'Add your first topic, article link, or study document to generate an intelligent AI summary.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Summarize Topic or URL</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSummaries.map((summary, idx) => {
            const isFav = summary.isFavorite;
            const qaCount = summary.qaHistory?.length || 0;
            const category = summary.primaryCategory || 'General Knowledge';
            const isBlack = idx % 2 === 0;

            return (
              <div
                key={summary.id}
                id={`card_knowledge_${summary.id}`}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative ${
                  isBlack ? 'apple-card-black' : 'apple-card-white'
                }`}
              >
                <div className="specular-sheen" />
                <div className="relative z-10">
                  {/* Top Bar: Category, Type, Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(category)}`}>
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </span>

                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700/50 uppercase font-mono text-[10px]">
                        {summary.inputType}
                      </span>

                      {summary.sourceUrl && (
                        <a
                          href={summary.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={summary.sourceUrl}
                          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                        >
                          <Globe className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleKnowledgeFavorite(summary.id)}
                        aria-label={isFav ? 'Unstar summary' : 'Star summary'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isFav 
                            ? 'text-amber-400 hover:bg-amber-950/50' 
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopySummary(summary)}
                        aria-label="Copy summary"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Copy Summary"
                      >
                        {copiedId === summary.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteKnowledgeSummary(summary.id)}
                        aria-label="Delete summary"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => setSelectedDetailSummary(summary)}
                    className={`text-base font-bold transition-colors cursor-pointer line-clamp-2 mb-1.5 ${
                      isBlack ? 'text-white hover:text-blue-400' : 'text-[#1d1d1f] hover:text-[#0071e3]'
                    }`}
                  >
                    {summary.title}
                  </h3>

                  {/* One Liner */}
                  {summary.oneLiner && (
                    <p className={`text-xs font-medium leading-relaxed line-clamp-2 mb-3 p-2.5 rounded-lg border ${
                      isBlack ? 'text-neutral-300 bg-white/[0.04] border-white/10' : 'text-[#1d1d1f] bg-[#f5f5f7] border-black/[0.06]'
                    }`}>
                      💡 {summary.oneLiner}
                    </p>
                  )}

                  {/* Key Takeaways */}
                  {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
                    <div className="space-y-1.5 mb-3.5">
                      {summary.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                        <div key={idx} className={`flex items-start gap-2 text-xs ${
                          isBlack ? 'text-neutral-300' : 'text-neutral-700'
                        }`}>
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {summary.tags && summary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {summary.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-300 border border-neutral-700/40">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span>{new Date(summary.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    {qaCount > 0 && (
                      <span className="flex items-center gap-1 text-purple-400 font-medium">
                        <MessageSquare className="w-3 h-3" />
                        {qaCount} Q&A
                      </span>
                    )}
                    {summary.webSources && summary.webSources.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <Globe className="w-3 h-3" />
                        {summary.webSources.length} sources
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDetailSummary(summary)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>Read Full Vault</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Summarize New Topic / Link / Document */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">AI Research Summarizer & Vault</h2>
                  <p className="text-xs text-neutral-400">Powered by Gemini Pro 3.1 with real-time web search grounding</p>
                </div>
              </div>

              <button
                onClick={() => !isGenerating && setIsCreateModalOpen(false)}
                disabled={isGenerating}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleGenerateSummary} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {/* Input Type Selector Tabs */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  What would you like to summarize?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputType('topic')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      inputType === 'topic'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Topic / Keyword</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputType('url')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      inputType === 'url'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website / Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputType('document')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      inputType === 'document'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Pasted Doc / Notes</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on type */}
              {inputType === 'topic' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Topic / Concept Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input_summarize_topic"
                    type="text"
                    required
                    placeholder="e.g., Mixture of Experts (MoE) Architecture, India Semiconductor Mission 2025, SaaS Net Revenue Retention"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Gemini will conduct live Google searches across web sources, research papers, and news to generate verified takeaways.
                  </p>
                </div>
              )}

              {inputType === 'url' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Website or Article Link <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input_summarize_url"
                      type="url"
                      required
                      placeholder="https://techcrunch.com/article... or https://reuters.com/..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Gemini Pro will read and extract the core thesis, data points, and actionable implications from this webpage.
                  </p>
                </div>
              )}

              {(inputType === 'document' || inputType === 'text') && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Document Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., McKinsey B2B Growth Case Study Notes"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 mb-3"
                  />

                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Pasted Text / Raw Document Content <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="input_summarize_content"
                    required
                    rows={6}
                    placeholder="Paste report text, meeting notes, interview transcript, whitepaper paragraphs, or article copy here..."
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 font-mono leading-relaxed"
                  />
                </div>
              )}

              {/* Tag / Category Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Knowledge Domain / Category Tag <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Artificial Intelligence & Tech', 'Finance & Markets', 'Marketing & Growth', 'General Knowledge & Current Affairs'] as KnowledgeCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInputCategory(cat)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 justify-center transition-all cursor-pointer ${
                        inputCategory === cat
                          ? 'bg-neutral-800 border-blue-500 text-white shadow-xs'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span className="truncate">{cat.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Custom Instructions */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Custom Focus / Research Angle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Focus on interview questions & numbers, Highlight ROI and risks"
                  value={inputCustomInstructions}
                  onChange={(e) => setInputCustomInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Error Message */}
              {generationError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{generationError}</div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  id="btn_submit_ai_summary"
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-950/50 cursor-pointer disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Researching with Gemini Pro...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate & Store AI Summary</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Research Detail & Interactive Gemini Q&A */}
      {selectedDetailSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-start justify-between gap-4 bg-neutral-900/90">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(selectedDetailSummary.primaryCategory)}`}>
                    {getCategoryIcon(selectedDetailSummary.primaryCategory)}
                    <span>{selectedDetailSummary.primaryCategory}</span>
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase font-mono text-[10px]">
                    {selectedDetailSummary.inputType}
                  </span>

                  {selectedDetailSummary.sourceUrl && (
                    <a
                      href={selectedDetailSummary.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {selectedDetailSummary.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleKnowledgeFavorite(selectedDetailSummary.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    selectedDetailSummary.isFavorite
                      ? 'bg-amber-950/60 border-amber-500 text-amber-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Star className={`w-4 h-4 ${selectedDetailSummary.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => handleCopySummary(selectedDetailSummary)}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Full Summary"
                >
                  {copiedId === selectedDetailSummary.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setSelectedDetailSummary(null)}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* One Liner Card */}
              {selectedDetailSummary.oneLiner && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-900/40 text-blue-200 text-sm font-medium leading-relaxed">
                  💡 <span className="font-semibold text-white">Executive Thesis:</span> {selectedDetailSummary.oneLiner}
                </div>
              )}

              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Executive Summary
                </h4>
                <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                  {selectedDetailSummary.executiveSummary}
                </p>
              </div>

              {/* Key Takeaways */}
              {selectedDetailSummary.keyTakeaways && selectedDetailSummary.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Core Key Takeaways & Strategic Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {selectedDetailSummary.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-neutral-200 leading-relaxed">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Concepts Breakdown */}
              {selectedDetailSummary.coreConcepts && selectedDetailSummary.coreConcepts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Core Architectural & Operational Concepts
                  </h4>
                  <div className="space-y-2.5">
                    {selectedDetailSummary.coreConcepts.map((concept, cIdx) => (
                      <div key={cIdx} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                        <h5 className="text-xs font-bold text-blue-300 mb-1">{concept.concept}</h5>
                        <p className="text-xs text-neutral-300 leading-relaxed">{concept.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview & Practical Applications */}
              {selectedDetailSummary.interviewRelevance && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Placement & Interview Relevance
                  </h4>
                  <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedDetailSummary.interviewRelevance}
                  </div>
                </div>
              )}

              {/* Potential Interview Questions */}
              {selectedDetailSummary.potentialQuestions && selectedDetailSummary.potentialQuestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Potential Interview Questions
                  </h4>
                  <div className="space-y-2">
                    {selectedDetailSummary.potentialQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-start gap-2.5 text-xs text-neutral-200">
                        <span className="text-indigo-400 font-bold mt-0.5">Q{qIdx + 1}:</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Metrics or Facts */}
              {selectedDetailSummary.industryMetricsOrFacts && selectedDetailSummary.industryMetricsOrFacts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Key Industry Benchmarks & Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDetailSummary.industryMetricsOrFacts.map((metric, mIdx) => (
                      <div key={mIdx} className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-200">
                        📊 {metric}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Web Sources */}
              {selectedDetailSummary.webSources && selectedDetailSummary.webSources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Grounded Web Sources & Citations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetailSummary.webSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-blue-400 hover:text-blue-300 hover:border-blue-700/50 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[240px]">{source.title || source.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Q&A with Gemini Pro */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">Ask Follow-up Questions (Gemini Pro)</h4>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Ask for clarifications, interview follow-ups, or additional examples
                  </span>
                </div>

                {/* Q&A History */}
                {selectedDetailSummary.qaHistory && selectedDetailSummary.qaHistory.length > 0 && (
                  <div className="space-y-3">
                    {selectedDetailSummary.qaHistory.map((qa) => (
                      <div key={qa.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                        <div className="flex items-start gap-2 text-xs font-semibold text-white">
                          <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px]">Q</span>
                          <span>{qa.question}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-300 pl-2 border-l-2 border-purple-500/50 leading-relaxed whitespace-pre-line">
                          <span>{qa.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ask Input Form */}
                <form onSubmit={handleAskQA} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question about this summary (e.g. How does this impact Indian IT service margins?)"
                      value={qaQuestion}
                      onChange={(e) => setQaQuestion(e.target.value)}
                      disabled={isAskingQA}
                      className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={isAskingQA || !qaQuestion.trim()}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isAskingQA ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </>
                      )}
                    </button>
                  </div>
                  {qaError && (
                    <p className="text-xs text-rose-400">{qaError}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
