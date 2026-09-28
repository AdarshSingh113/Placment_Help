import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Plus, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Square, 
  Trash2, 
  TrendingUp, 
  Sparkles, 
  Award,
  ChevronRight,
  BookOpen,
  Target,
  Smile,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ListTodo,
  Star,
  Activity,
  Edit2,
  Check,
  X,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DailyLog, DailyFocusTask } from '../types';

export const DailyGrowthView: React.FC = () => {
  const { 
    dailyLogs = [], 
    addDailyLog, 
    updateDailyLog,
    deleteDailyLog, 
    dailyTasks = [], 
    toggleDailyTask, 
    addDailyTask, 
    updateDailyTask,
    deleteDailyTask, 
    streakDays = 1,
    showToast
  } = useData();

  const [isLoggingToday, setIsLoggingToday] = useState(false);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [minutesSpent, setMinutesSpent] = useState<number>(90);
  const [accomplishedText, setAccomplishedText] = useState('');
  const [learnedText, setLearnedText] = useState('');
  const [struggledWithText, setStruggledWithText] = useState('');
  const [tomorrowFocusText, setTomorrowFocusText] = useState('');
  const [scoreRating, setScoreRating] = useState<number>(8.5);
  const [selectedCategory, setSelectedCategory] = useState('Case Practice');

  // Task filter & creation state
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newTaskCategory, setNewTaskCategory] = useState('Placement Prep');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);

  // Task editing modal state
  const [editingTask, setEditingTask] = useState<DailyFocusTask | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [editCategory, setEditCategory] = useState('Placement Prep');
  const [editMinutes, setEditMinutes] = useState(30);
  const [editDate, setEditDate] = useState('');

  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();

    const activityLines = accomplishedText
      .split('\n')
      .map(a => a.trim())
      .filter(Boolean);

    const takeawayLines = learnedText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const activitiesList = activityLines.length > 0 
      ? activityLines 
      : ['Practiced structured problem solving and mock interview drills'];

    const activitiesCompletedFormatted = [
      {
        category: selectedCategory,
        description: accomplishedText || 'Daily practice and placement preparation drills',
        minutes: Number(minutesSpent)
      }
    ];

    addDailyLog({
      date: logDate || new Date().toISOString().split('T')[0],
      minutesSpent: Number(minutesSpent),
      hoursSpent: Math.round((Number(minutesSpent) / 60) * 10) / 10,
      activities: activitiesList,
      activitiesCompleted: activitiesCompletedFormatted,
      keyTakeaways: takeawayLines.length > 0 ? takeawayLines : [learnedText || 'Consistent deliberate practice builds compounding interview readiness.'],
      accomplished: accomplishedText || activitiesList.join('. '),
      learned: learnedText || (takeawayLines.length > 0 ? takeawayLines.join('. ') : 'Maintained strong structural discipline.'),
      struggledWith: struggledWithText || undefined,
      tomorrowFocus: tomorrowFocusText || 'Deep-dive business case frameworks',
      tomorrowImprovement: tomorrowFocusText || 'Deep-dive business case frameworks',
      scoreOutOf10: Number(scoreRating),
      mood: Number(scoreRating) >= 8 ? 'Energized' : Number(scoreRating) >= 6 ? 'Productive' : 'Reflective'
    });

    setIsLoggingToday(false);
    setAccomplishedText('');
    setLearnedText('');
    setStruggledWithText('');
    setTomorrowFocusText('');
    setMinutesSpent(90);
    setScoreRating(8.5);
  };

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = newTaskTitle.trim();
    if (!cleanTitle) {
      if (showToast) showToast('Please enter a task title');
      return;
    }

    addDailyTask({
      title: cleanTitle,
      category: newTaskCategory || 'Placement Prep',
      priority: newTaskPriority,
      targetMinutes: Number(newTaskMinutes) || 30,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    });

    setNewTaskTitle('');
  };

  // Handle task completion toggle with automatic reflection log synchronization
  const handleToggleTaskWithReflectionSync = (task: DailyFocusTask) => {
    const willBeCompleted = !task.completed;
    toggleDailyTask(task.id);

    if (willBeCompleted) {
      const todayStr = new Date().toISOString().split('T')[0];
      const taskDate = task.date || todayStr;
      
      // Look for existing daily log on taskDate or today
      const existingLog = dailyLogs.find(l => l.date === taskDate || l.date === todayStr);

      if (existingLog) {
        const currentActivities = Array.isArray(existingLog.activities) ? [...existingLog.activities] : (existingLog.accomplished ? [existingLog.accomplished] : []);
        const taskEntryText = `[Checklist Completed] ${task.title} (${task.targetMinutes || 30}m • ${task.category || 'Prep'})`;
        
        if (!currentActivities.some(a => a.includes(task.title))) {
          const updatedActivities = [...currentActivities, taskEntryText];
          updateDailyLog(existingLog.id, {
            activities: updatedActivities,
            accomplished: updatedActivities.join(' • '),
            minutesSpent: (existingLog.minutesSpent || 60) + (task.targetMinutes || 30)
          });
          if (showToast) showToast(`Completed "${task.title}" & updated today's reflection!`);
        }
      } else {
        // Create new daily log entry with this completed task
        const taskEntryText = `Completed: ${task.title} (${task.targetMinutes || 30}m)`;
        addDailyLog({
          date: todayStr,
          minutesSpent: task.targetMinutes || 30,
          hoursSpent: Math.round(((task.targetMinutes || 30) / 60) * 10) / 10,
          activities: [taskEntryText],
          accomplished: taskEntryText,
          keyTakeaways: ['Deliberate focus task execution.'],
          scoreOutOf10: 8.5,
          tomorrowFocus: 'Continue high-priority placement checklist drills'
        });
        if (showToast) showToast(`Completed "${task.title}" & recorded in Daily Reflection Log!`);
      }
    }
  };

  // Handle task edit save
  const handleOpenEditTask = (task: DailyFocusTask) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority || 'High');
    setEditCategory(task.category || 'Placement Prep');
    setEditMinutes(task.targetMinutes || 30);
    setEditDate(task.date || new Date().toISOString().split('T')[0]);
  };

  const handleSaveEditedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    updateDailyTask(editingTask.id, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory.trim() || 'Placement Prep',
      targetMinutes: Number(editMinutes) || 30,
      date: editDate || new Date().toISOString().split('T')[0]
    });

    setEditingTask(null);
  };

  // Helper to extract duration from any log format
  const getLogMinutes = (log: DailyLog): number => {
    if (typeof log.minutesSpent === 'number' && log.minutesSpent > 0) return log.minutesSpent;
    if (Array.isArray(log.activitiesCompleted) && log.activitiesCompleted.length > 0) {
      return log.activitiesCompleted.reduce((sum, act) => sum + (act.minutes || 0), 0);
    }
    if (typeof log.hoursSpent === 'number' && log.hoursSpent > 0) return Math.round(log.hoursSpent * 60);
    return 60;
  };

  const totalMinutesStudied = (dailyLogs || []).reduce((acc, l) => acc + getLogMinutes(l), 0);
  const totalHours = (totalMinutesStudied / 60).toFixed(1);

  const completedTasksCount = (dailyTasks || []).filter(t => t.completed).length;
  const totalTasksCount = (dailyTasks || []).length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Dynamic Average Performance calculation based on actual logged reflections
  const scoredLogs = useMemo(() => {
    return (dailyLogs || []).filter(l => typeof l.scoreOutOf10 === 'number' && l.scoreOutOf10 > 0);
  }, [dailyLogs]);

  const avgPerformance = useMemo(() => {
    if (scoredLogs.length === 0) return null;
    const sum = scoredLogs.reduce((acc, l) => acc + (l.scoreOutOf10 || 0), 0);
    return (sum / scoredLogs.length).toFixed(1);
  }, [scoredLogs]);

  // Priority counts for filter pills
  const priorityCounts = useMemo(() => {
    const high = (dailyTasks || []).filter(t => (t.priority || 'High').toLowerCase() === 'high').length;
    const med = (dailyTasks || []).filter(t => (t.priority || '').toLowerCase() === 'medium').length;
    const low = (dailyTasks || []).filter(t => (t.priority || '').toLowerCase() === 'low').length;
    return { all: (dailyTasks || []).length, High: high, Medium: med, Low: low };
  }, [dailyTasks]);

  // Combined Status & Priority Filtered Tasks
  const filteredTasks = useMemo(() => {
    return (dailyTasks || []).filter(t => {
      // 1. Status Filter
      if (taskFilter === 'pending' && t.completed) return false;
      if (taskFilter === 'completed' && !t.completed) return false;

      // 2. Priority Filter (case-insensitive)
      if (priorityFilter !== 'all') {
        const taskP = (t.priority || 'High').toLowerCase();
        const targetP = priorityFilter.toLowerCase();
        if (taskP !== targetP) return false;
      }

      return true;
    });
  }, [dailyTasks, taskFilter, priorityFilter]);

  return (
    <div id="daily_growth_container" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-3">
            <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>Daily Growth & Reflection OS</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Build compounding placement momentum. Track daily study sessions, core takeaways, and tomorrow's focus targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLoggingToday(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-950/40 transition-all cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Today's Reflection</span>
          </button>
        </div>
      </div>

      {/* Streak & Key Metric Cards - Alternating Black & White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak - Black Card */}
        <div className="apple-card-black p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Current Streak</span>
            <div className="text-3xl font-black text-amber-300 mt-1 flex items-center gap-1 font-mono">
              {streakDays} <span className="text-xs font-normal text-neutral-400 font-sans">days continuous</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Consistency creates competitive edge.</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Flame className="w-7 h-7 fill-current" />
          </div>
        </div>

        {/* Total Time - White Card */}
        <div className="apple-card-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Total Practice Logged</span>
            <div className="text-3xl font-black text-[#1d1d1f] mt-1 font-mono">
              {totalHours} <span className="text-xs font-normal text-[#86868b] font-sans">hours ({totalMinutesStudied}m)</span>
            </div>
            <p className="text-[11px] text-[#86868b] mt-1">Across all logged sessions</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        {/* Focus Tasks - Black Card */}
        <div className="apple-card-black p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Focus Task Progress</span>
            <div className="text-3xl font-black text-white mt-1 font-mono">
              {completedTasksCount} <span className="text-sm font-normal text-neutral-400 font-sans">/ {totalTasksCount} ({taskCompletionRate}%)</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">
              {totalTasksCount - completedTasksCount === 0 ? 'All tasks complete!' : `${totalTasksCount - completedTasksCount} pending tasks`}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Average Rating - White Card */}
        <div className="apple-card-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Avg Performance</span>
            {avgPerformance !== null ? (
              <>
                <div className="text-3xl font-black text-amber-500 mt-1 font-mono flex items-center gap-1">
                  {avgPerformance} <span className="text-xs font-normal text-[#86868b] font-sans">/ 10 ★</span>
                </div>
                <p className="text-[11px] text-[#86868b] mt-1">
                  Based on {scoredLogs.length} evaluation{scoredLogs.length === 1 ? '' : 's'}
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-neutral-400 mt-1 font-mono flex items-center gap-1">
                  — <span className="text-xs font-normal text-[#86868b] font-sans">/ 10 ★</span>
                </div>
                <p className="text-[11px] text-[#86868b] mt-1">No evaluations logged yet</p>
              </>
            )}
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Star className="w-7 h-7 fill-current" />
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks (Left 5 cols) vs Timeline Logs (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Focus Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="space-y-3 pb-2 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">Daily Focus Checklist</h3>
                </div>

                {/* Status Filter (All / Pending / Completed) */}
                <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[11px]">
                  {(['all', 'pending', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTaskFilter(filter)}
                      className={`px-2.5 py-0.5 rounded-lg capitalize transition-all font-medium cursor-pointer ${
                        taskFilter === filter
                          ? 'bg-neutral-800 text-white font-bold'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter Bar */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                  <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3 text-amber-400" />
                    <span>Filter by Priority:</span>
                  </span>

                  {(['all', 'High', 'Medium', 'Low'] as const).map((p) => {
                    const isSelected = priorityFilter === p;
                    const count = priorityCounts[p];
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriorityFilter(p)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? p === 'High'
                              ? 'bg-rose-950 text-rose-300 border border-rose-700/80 font-bold shadow-xs'
                              : p === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/80 font-bold shadow-xs'
                              : p === 'Low'
                              ? 'bg-blue-950 text-blue-300 border border-blue-700/80 font-bold shadow-xs'
                              : 'bg-neutral-800 text-white border border-neutral-700 font-bold'
                            : 'bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-850'
                        }`}
                        title={`Filter list to ${p === 'all' ? 'all priorities' : `${p} priority tasks`}`}
                      >
                        <span>{p === 'all' ? 'All' : p}</span>
                        <span className="text-[9px] opacity-75 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {(priorityFilter !== 'all' || taskFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setPriorityFilter('all');
                      setTaskFilter('all');
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-medium underline shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddTask} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add high-priority task (e.g. Master McKinsey PEI story)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTask()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all shrink-0 cursor-pointer select-none"
                >
                  Add Task
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-400 text-[11px] font-medium">New Task Priority:</span>
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      newTaskPriority === p
                        ? p === 'High' 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/50' 
                          : p === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/50'
                        : 'bg-neutral-950 text-neutral-500 hover:text-neutral-300 border border-neutral-850'
                    }`}
                    title={`Set priority of next added task to ${p}`}
                  >
                    {p}
                  </button>
                ))}

                <span className="text-neutral-400 text-[11px] ml-auto">Duration:</span>
                <select
                  value={newTaskMinutes}
                  onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                  className="px-2 py-0.5 text-[11px] rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-300"
                >
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={45}>45m</option>
                  <option value={60}>60m</option>
                  <option value={90}>90m</option>
                </select>

                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="px-2 py-0.5 text-[11px] rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-300"
                >
                  <option value="Placement Prep">Placement Prep</option>
                  <option value="Case Practice">Case Practice</option>
                  <option value="Guesstimates">Guesstimates</option>
                  <option value="GD Prep">GD Prep</option>
                  <option value="HR & Behavioral">HR & Behavioral</option>
                  <option value="Domain">Domain Prep</option>
                </select>
              </div>
            </form>

            {/* Task Items List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-neutral-950/60 border border-neutral-800 text-neutral-500 text-xs space-y-1">
                  <p>No tasks matching this filter.</p>
                  {(priorityFilter !== 'all' || taskFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setPriorityFilter('all');
                        setTaskFilter('all');
                      }}
                      className="text-amber-400 hover:text-amber-300 underline font-semibold text-xs cursor-pointer"
                    >
                      Clear filters to view all ({dailyTasks.length}) tasks
                    </button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      task.completed
                        ? 'bg-neutral-950/40 border-neutral-800/40 opacity-75'
                        : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleTaskWithReflectionSync(task)}
                      className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          task.completed 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-neutral-900 border border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-0.5 flex-1">
                        <p className={`text-xs sm:text-sm leading-snug ${
                          task.completed ? 'line-through text-neutral-400' : 'text-neutral-200 font-medium'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPriorityFilter(task.priority || 'High');
                            }}
                            className={`px-1.5 py-0.2 rounded font-mono border transition-transform hover:scale-105 cursor-pointer ${
                              task.priority === 'High' 
                                ? 'text-rose-400 bg-rose-950/70 border-rose-800/50' 
                                : task.priority === 'Low'
                                ? 'text-blue-400 bg-blue-950/70 border-blue-800/50'
                                : 'text-amber-400 bg-amber-950/70 border-amber-800/50'
                            }`}
                            title={`Click to filter by ${task.priority || 'High'} priority`}
                          >
                            {task.priority || 'High'}
                          </button>
                          <span>• {task.targetMinutes || 30} mins</span>
                          <span>• {task.category || 'Placement'}</span>
                          {task.completed && (
                            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                              ✓ Completed & Synced
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditTask(task);
                        }}
                        className="text-neutral-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDailyTask(task.id);
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Log Presets */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Routine Shortcuts:</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addDailyTask({
                    title: 'Practice 1 GD opening statement + 3 counterpoints',
                    category: 'GD Prep',
                    priority: 'High',
                    targetMinutes: 20,
                    completed: false,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="p-2 text-left rounded-xl bg-neutral-950 border border-neutral-800 hover:border-purple-800/60 hover:bg-purple-950/20 text-xs text-purple-300 font-medium transition-all"
              >
                + 20m GD Rehearsal
              </button>

              <button
                onClick={() => {
                  addDailyTask({
                    title: 'Solve 1 Market Sizing Guesstimate (Starbucks / EV)',
                    category: 'Guesstimate',
                    priority: 'High',
                    targetMinutes: 25,
                    completed: false,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="p-2 text-left rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-800/60 hover:bg-emerald-950/20 text-xs text-emerald-300 font-medium transition-all"
              >
                + 25m Guesstimate Drill
              </button>

              <button
                onClick={() => {
                  addDailyTask({
                    title: 'Record 2 STAR behavioral interview answers on video',
                    category: 'Interview Prep',
                    priority: 'High',
                    targetMinutes: 30,
                    completed: false,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="p-2 text-left rounded-xl bg-neutral-950 border border-neutral-800 hover:border-blue-800/60 hover:bg-blue-950/20 text-xs text-blue-300 font-medium transition-all"
              >
                + 30m Mock Video Answer
              </button>

              <button
                onClick={() => {
                  addDailyTask({
                    title: 'Read & summarize 2 macro economy articles from FT / Mint',
                    category: 'Current Affairs',
                    priority: 'Medium',
                    targetMinutes: 20,
                    completed: false,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="p-2 text-left rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-800/60 hover:bg-amber-950/20 text-xs text-amber-300 font-medium transition-all"
              >
                + 20m News Reading
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Reflections Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Daily Reflection Logs</h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {(dailyLogs || []).length} logs recorded
              </span>
            </div>

            {/* Daily Logs Timeline */}
            <div className="space-y-4 max-h-[640px] overflow-y-auto custom-scrollbar pr-1">
              {(dailyLogs || []).length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-950/60 border border-neutral-800 text-neutral-500 text-xs space-y-2">
                  <Flame className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-semibold text-neutral-400">No daily logs recorded yet.</p>
                  <p>Click "+ Log Today's Reflection" to record your first study sprint.</p>
                </div>
              ) : (
                (dailyLogs || []).map((log) => {
                  const minutes = getLogMinutes(log);
                  const score = log.scoreOutOf10 || 8.0;

                  // Resolve activities list safely
                  const activitiesList: string[] = 
                    Array.isArray(log.activities) && log.activities.length > 0
                      ? log.activities
                      : Array.isArray(log.activitiesCompleted) && log.activitiesCompleted.length > 0
                      ? log.activitiesCompleted.map(a => `${a.category}: ${a.description} (${a.minutes}m)`)
                      : log.accomplished
                      ? [log.accomplished]
                      : ['Daily placement preparation session'];

                  // Resolve takeaways safely
                  const takeawaysList: string[] = 
                    Array.isArray(log.keyTakeaways) && log.keyTakeaways.length > 0
                      ? log.keyTakeaways
                      : log.learned
                      ? [log.learned]
                      : [];

                  const tomorrowTarget = log.tomorrowFocus || log.tomorrowImprovement;

                  return (
                    <div
                      key={log.id}
                      className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3.5"
                    >
                      {/* Top Bar of Log */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{log.date}</span>
                          </span>

                          <span className="text-xs text-neutral-300 font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{minutes}m practice</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/30">
                            {score} / 10 ★
                          </span>

                          {deleteDailyLog && (
                            confirmDeleteLogId === log.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-800/80 px-2 py-1 rounded-xl animate-in fade-in duration-150">
                                <span className="text-[11px] text-rose-200 font-medium whitespace-nowrap">Delete?</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteDailyLog(log.id);
                                    setConfirmDeleteLogId(null);
                                  }}
                                  className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteLogId(null);
                                  }}
                                  className="px-1.5 py-0.5 text-[11px] text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteLogId(log.id);
                                }}
                                className="text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Delete Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Accomplishments & Activities */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
                          Accomplished & Practiced:
                        </span>
                        <div className="space-y-1">
                          {activitiesList.map((act, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-neutral-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Learning / Takeaways */}
                      {takeawaysList.length > 0 && (
                        <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80 text-xs text-neutral-200 space-y-1">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Key Takeaway & Formula Learned:</span>
                          </span>
                          <div className="space-y-1 pl-1">
                            {takeawaysList.map((t, i) => (
                              <p key={i} className="leading-relaxed text-neutral-300">
                                {t}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Struggled With Callout */}
                      {log.struggledWith && (
                        <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/30 text-xs text-rose-200/90 space-y-0.5">
                          <span className="font-bold text-rose-400 text-[10px] uppercase tracking-wider block">
                            Areas of Friction / Review Needed:
                          </span>
                          <p>{log.struggledWith}</p>
                        </div>
                      )}

                      {/* Tomorrow's Target */}
                      {tomorrowTarget && (
                        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200 flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-400 shrink-0" />
                          <div className="truncate">
                            <strong className="text-amber-300 font-semibold">Tomorrow's #1 Target: </strong>
                            <span>{tomorrowTarget}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: LOG TODAY'S STUDY */}
      {isLoggingToday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-amber-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Log Study Session & Daily Reflection</span>
              </h3>
              <button
                onClick={() => setIsLoggingToday(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDailyLog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Duration: <span className="text-amber-400 font-mono font-bold">{minutesSpent} mins ({Math.round(minutesSpent / 60 * 10)/10} hrs)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={15}
                      max={360}
                      step={15}
                      value={minutesSpent}
                      onChange={(e) => setMinutesSpent(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Performance Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Focus Area</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Case Practice">Case Practice</option>
                    <option value="Guesstimates">Guesstimate Lab</option>
                    <option value="Interview Practice">Behavioral / HR Drill</option>
                    <option value="GD Practice">GD & Current Affairs</option>
                    <option value="Company Research">Company & Industry Research</option>
                    <option value="Resume & STAR">Resume Work & STAR Stories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Self-Rating: <span className="text-amber-400 font-bold">{scoreRating} / 10 ★</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={scoreRating}
                    onChange={(e) => setScoreRating(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  What did you accomplish today? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Practiced 2 mock case interviews on pricing strategy, solved EV market sizing model, and revised 3 GD topics."
                  value={accomplishedText}
                  onChange={(e) => setAccomplishedText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Key Learnings & Takeaways (What clicked today?)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. When structuring market entry, always evaluate regulatory licensing barriers first before unit economics."
                  value={learnedText}
                  onChange={(e) => setLearnedText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Areas of Struggle (Where did you get stuck?)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mental math speed for compound interest in guesstimates..."
                  value={struggledWithText}
                  onChange={(e) => setStruggledWithText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tomorrow's #1 Focus Target
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master McKinsey PEI conflict leadership scenario and deliver 2 live mock answers."
                  value={tomorrowFocusText}
                  onChange={(e) => setTomorrowFocusText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsLoggingToday(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TASK */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-amber-500/40 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Edit Daily Focus Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Duration</label>
                  <select
                    value={editMinutes}
                    onChange={(e) => setEditMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                    <option value={120}>120 mins</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="Case Practice">Case Practice</option>
                    <option value="Guesstimates">Guesstimates</option>
                    <option value="GD Prep">GD Prep</option>
                    <option value="HR & Behavioral">HR & Behavioral</option>
                    <option value="Domain">Domain Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
