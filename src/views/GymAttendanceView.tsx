import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GymLog } from '../types';

export const GymAttendanceView: React.FC = () => {
  const { gymLogs, addGymLog, updateGymLog, deleteGymLog, toggleGymAttendance, showToast } = useData();

  // Helper for today's date in YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form states - Strictly the 3 fields
  const [formDate, setFormDate] = useState<string>(getTodayString());
  const [formAttended, setFormAttended] = useState<boolean>(true);
  const [formWeight, setFormWeight] = useState<string>('74.0');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Hovered data point for chart
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    weight: number;
    attended: boolean;
    x: number;
    y: number;
  } | null>(null);

  // In-app delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter state
  const [filterAttendance, setFilterAttendance] = useState<'all' | 'yes' | 'no'>('all');

  // Sorted gym logs (most recent first)
  const sortedLogs = useMemo(() => {
    return [...gymLogs].sort((a, b) => b.date.localeCompare(a.date));
  }, [gymLogs]);

  // Today's log if present
  const todayString = getTodayString();
  const todayLog = useMemo(() => {
    return gymLogs.find(l => l.date === todayString);
  }, [gymLogs, todayString]);

  // Set latest weight when loading or adding
  const latestWeight = useMemo(() => {
    if (sortedLogs.length === 0) return 74.0;
    return sortedLogs[0].weight;
  }, [sortedLogs]);

  // When clicking edit on a log
  const handleStartEdit = (log: GymLog) => {
    setEditingId(log.id);
    setFormDate(log.date);
    setFormAttended(log.attended);
    setFormWeight(log.weight.toString());
    const formEl = document.getElementById('gym_log_form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormDate(getTodayString());
    setFormAttended(true);
    setFormWeight(latestWeight ? latestWeight.toString() : '74.0');
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDate) {
      showToast('Please pick a date');
      return;
    }
    const weightNum = parseFloat(formWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      showToast('Please enter a valid weight in kg');
      return;
    }

    if (editingId) {
      updateGymLog(editingId, {
        date: formDate,
        attended: formAttended,
        weight: Math.round(weightNum * 10) / 10
      });
      setEditingId(null);
    } else {
      addGymLog({
        date: formDate,
        attended: formAttended,
        weight: Math.round(weightNum * 10) / 10
      });
    }

    setFormDate(getTodayString());
    setFormAttended(true);
  };

  // Quick adjustment of weight input
  const adjustWeight = (delta: number) => {
    const current = parseFloat(formWeight) || 74.0;
    const updated = Math.max(20, Math.min(300, current + delta));
    setFormWeight((Math.round(updated * 10) / 10).toString());
  };

  // Statistics derived purely from the 3 fields
  const stats = useMemo(() => {
    const totalDays = gymLogs.length;
    const attendedDays = gymLogs.filter(l => l.attended).length;
    const restDays = totalDays - attendedDays;
    const attendanceRate = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    // Calculate current streak of attended days
    let currentStreak = 0;
    const dateSorted = [...gymLogs].sort((a, b) => b.date.localeCompare(a.date));
    for (let i = 0; i < dateSorted.length; i++) {
      if (dateSorted[i].attended) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Weight stats
    const weights = gymLogs.map(l => l.weight).filter(w => !isNaN(w) && w > 0);
    const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
    const currentWeight = dateSorted.length > 0 ? dateSorted[0].weight : 0;
    const initialWeight = dateSorted.length > 0 ? dateSorted[dateSorted.length - 1].weight : 0;
    const weightDiff = currentWeight && initialWeight ? Math.round((currentWeight - initialWeight) * 10) / 10 : 0;

    return {
      totalDays,
      attendedDays,
      restDays,
      attendanceRate,
      currentStreak,
      minWeight,
      maxWeight,
      currentWeight,
      weightDiff
    };
  }, [gymLogs]);

  // Chart data sorted chronologically
  const chronologicalLogs = useMemo(() => {
    return [...gymLogs].sort((a, b) => a.date.localeCompare(b.date));
  }, [gymLogs]);

  // Filtered logs for the table
  const filteredLogs = useMemo(() => {
    if (filterAttendance === 'yes') {
      return sortedLogs.filter(l => l.attended);
    }
    if (filterAttendance === 'no') {
      return sortedLogs.filter(l => !l.attended);
    }
    return sortedLogs;
  }, [sortedLogs, filterAttendance]);

  // SVG Chart Calculations
  const chartPoints = useMemo(() => {
    if (chronologicalLogs.length === 0) return [];
    const weights = chronologicalLogs.map(l => l.weight);
    const rawMin = Math.min(...weights);
    const rawMax = Math.max(...weights);
    const minVal = Math.floor(rawMin - 0.5);
    const maxVal = Math.ceil(rawMax + 0.5);
    const range = maxVal - minVal || 1;

    const width = 600;
    const height = 200;
    const paddingLeft = 45;
    const paddingRight = 25;
    const paddingTop = 20;
    const paddingBottom = 35;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    return chronologicalLogs.map((log, index) => {
      const x = chronologicalLogs.length === 1 
        ? paddingLeft + chartWidth / 2 
        : paddingLeft + (index / (chronologicalLogs.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((log.weight - minVal) / range) * chartHeight;
      return {
        ...log,
        x,
        y,
        minVal,
        maxVal,
        width,
        height,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        chartHeight,
        chartWidth
      };
    });
  }, [chronologicalLogs]);

  // SVG Path generator
  const { linePath, areaPath } = useMemo(() => {
    if (chartPoints.length === 0) return { linePath: '', areaPath: '' };
    if (chartPoints.length === 1) {
      const p = chartPoints[0];
      return {
        linePath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y}`,
        areaPath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y} L ${p.x + 20} ${p.height - p.paddingBottom} L ${p.x - 20} ${p.height - p.paddingBottom} Z`
      };
    }

    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const bottomY = first.height - first.paddingBottom;

    let path = `M ${first.x} ${first.y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      path += ` L ${chartPoints[i].x} ${chartPoints[i].y}`;
    }

    const area = `${path} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
    return { linePath: path, areaPath: area };
  }, [chartPoints]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Gym Attendance & Weight Tracker</h1>
              <p className="text-xs text-neutral-400">
                Daily 3-field log: <span className="text-neutral-200 font-medium">Date</span>, <span className="text-emerald-400 font-medium">Attended (Yes/No)</span>, and <span className="text-blue-400 font-medium">Weight (kg)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Today Action */}
        <div className="flex items-center gap-2">
          {todayLog ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-neutral-400">Today ({todayString}):</span>
              <button
                onClick={() => toggleGymAttendance(todayString)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  todayLog.attended 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60' 
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700'
                }`}
                title="Click to toggle Yes / No"
              >
                {todayLog.attended ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attended (Yes)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Rest Day (No)</span>
                  </>
                )}
              </button>
              <span className="text-blue-400 font-bold ml-1">{todayLog.weight} kg</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setFormDate(todayString);
                setFormAttended(true);
                setFormWeight(latestWeight ? latestWeight.toString() : '74.0');
                const formEl = document.getElementById('gym_log_form');
                if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-900/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Today's Gym</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Attendance Rate */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Attendance Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.attendanceRate}%</span>
              <span className="text-xs text-emerald-400 font-medium">{stats.attendedDays} of {stats.totalDays} days</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Current Streak */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gym Streak</span>
            <div className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{stats.currentStreak}</span>
              <span className="text-xs text-neutral-400 font-medium">days in a row</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              {stats.currentStreak > 0 ? 'Consistent discipline!' : 'Mark Yes to restart streak'}
            </p>
          </div>
        </div>

        {/* Metric 3: Latest Weight */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Latest Weight</span>
            <div className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.currentWeight || '--'}</span>
              <span className="text-xs font-semibold text-neutral-400">kg</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {stats.weightDiff === 0 ? (
                <span className="text-neutral-400 flex items-center gap-0.5">
                  <Minus className="w-3 h-3" /> Stable weight
                </span>
              ) : stats.weightDiff < 0 ? (
                <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(stats.weightDiff)} kg since start
                </span>
              ) : (
                <span className="text-blue-400 font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +{stats.weightDiff} kg since start
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 4: Weight Range */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Weight Range</span>
            <div className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Min: <strong className="text-white">{stats.minWeight || '--'} kg</strong></span>
              <span className="text-neutral-400">Max: <strong className="text-white">{stats.maxWeight || '--'} kg</strong></span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-2">
              Total logs: <span className="text-neutral-300 font-medium">{stats.totalDays} entries</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left = 3-Field Daily Log Form, Right = Weight Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Focused 3-Field Entry Card */}
        <div className="lg:col-span-5">
          <div 
            id="gym_log_form"
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <h2 className="text-base font-bold text-white">
                  {editingId ? 'Edit Gym Entry' : 'Daily Gym & Weight Log'}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Date */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    1. Date
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormDate(getTodayString())}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        formDate === getTodayString() 
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                          : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormDate(getYesterdayString())}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        formDate === getYesterdayString() 
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                          : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Yesterday
                    </button>
                  </div>
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Field 2: Gym Attendance (Yes or No) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                  2. Gym Attendance (Yes / No)
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option Yes */}
                  <button
                    type="button"
                    onClick={() => setFormAttended(true)}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      formAttended
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-xs shadow-emerald-950/60 ring-1 ring-emerald-500/30'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${formAttended ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    <span>Yes (Attended)</span>
                  </button>

                  {/* Option No */}
                  <button
                    type="button"
                    onClick={() => setFormAttended(false)}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      !formAttended
                        ? 'bg-neutral-800 border-neutral-600 text-neutral-200 shadow-xs ring-1 ring-neutral-500/30'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${!formAttended ? 'text-neutral-300' : 'text-neutral-500'}`} />
                    <span>No (Rest / Skip)</span>
                  </button>
                </div>
              </div>

              {/* Field 3: Weight */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    3. Weight (kg)
                  </span>
                  <span className="text-[11px] text-neutral-400 font-normal">Daily body weight</span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    placeholder="e.g. 74.5"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base font-bold text-white focus:outline-hidden focus:border-blue-500 pr-12 transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    kg
                  </span>
                </div>

                {/* Quick Increment/Decrement Buttons for Weight */}
                <div className="flex items-center justify-between gap-1.5 mt-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Quick adjust:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustWeight(-0.5)}
                      className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
                      title="Decrease 0.5 kg"
                    >
                      -0.5
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustWeight(-0.1)}
                      className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
                      title="Decrease 0.1 kg"
                    >
                      -0.1
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustWeight(0.1)}
                      className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
                      title="Increase 0.1 kg"
                    >
                      +0.1
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustWeight(0.5)}
                      className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
                      title="Increase 0.5 kg"
                    >
                      +0.5
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-900/30 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? 'Update Gym Entry' : 'Save Daily Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Weight Progression & Attendance Chart */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Weight Trend & Progression
                </h3>
                <p className="text-xs text-neutral-400">Daily weight readings plotted with gym attendance markers</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-neutral-300">Yes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-500"></span>
                  <span className="text-neutral-400">No</span>
                </div>
              </div>
            </div>

            {/* Custom Responsive SVG Chart Area */}
            <div className="h-64 w-full pt-2 relative">
              {chartPoints.length > 0 ? (
                <div className="w-full h-full flex flex-col justify-between">
                  <svg 
                    viewBox="0 0 600 200" 
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="45" y1="20" x2="575" y2="20" stroke="#262626" strokeDasharray="3 3" />
                    <line x1="45" y1="92" x2="575" y2="92" stroke="#262626" strokeDasharray="3 3" />
                    <line x1="45" y1="165" x2="575" y2="165" stroke="#333333" />

                    {/* Y-Axis labels */}
                    {chartPoints.length > 0 && (
                      <>
                        <text x="38" y="24" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {chartPoints[0].maxVal}kg
                        </text>
                        <text x="38" y="96" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {Math.round(((chartPoints[0].maxVal + chartPoints[0].minVal) / 2) * 10) / 10}kg
                        </text>
                        <text x="38" y="168" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {chartPoints[0].minVal}kg
                        </text>
                      </>
                    )}

                    {/* Area fill */}
                    {areaPath && (
                      <path d={areaPath} fill="url(#weightGrad)" />
                    )}

                    {/* Line stroke */}
                    {linePath && (
                      <path 
                        d={linePath} 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    )}

                    {/* Data Points */}
                    {chartPoints.map((point) => (
                      <g 
                        key={point.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint({
                          date: point.date,
                          weight: point.weight,
                          attended: point.attended,
                          x: point.x,
                          y: point.y
                        })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        {/* Target hit zone */}
                        <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                        {/* Outer ring */}
                        <circle 
                          cx={point.x} 
                          cy={point.y} 
                          r="6" 
                          fill="#171717"
                          stroke={point.attended ? '#10b981' : '#737373'}
                          strokeWidth="2.5"
                        />
                        {/* Inner dot */}
                        <circle 
                          cx={point.x} 
                          cy={point.y} 
                          r="3" 
                          fill={point.attended ? '#34d399' : '#a3a3a3'}
                        />

                        {/* X-axis date labels for subset */}
                        <text 
                          x={point.x} 
                          y="185" 
                          fill="#737373" 
                          fontSize="9" 
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {point.date.slice(5)}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Tooltip Overlay */}
                  {hoveredPoint && (
                    <div 
                      className="absolute bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-xl shadow-xl text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-20"
                      style={{
                        left: `${(hoveredPoint.x / 600) * 100}%`,
                        top: `${(hoveredPoint.y / 200) * 100}%`
                      }}
                    >
                      <div className="font-bold text-white whitespace-nowrap">{hoveredPoint.date}</div>
                      <div className="text-blue-400 font-black text-sm">{hoveredPoint.weight} kg</div>
                      <div className={`font-semibold text-[11px] ${hoveredPoint.attended ? 'text-emerald-400' : 'text-neutral-400'}`}>
                        {hoveredPoint.attended ? '✓ Attended (Yes)' : '✗ Rest Day (No)'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                  <Scale className="w-8 h-8 mb-2 opacity-40 text-blue-400" />
                  <p className="text-sm">Log your daily weight to visualize your progress curve</p>
                </div>
              )}
            </div>

            {/* Attendance Legend & Info */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Attended Gym (Yes)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-500"></span>
                  Rest / Skip (No)
                </span>
              </div>
              <span className="text-neutral-500">Hover points for details</span>
            </div>
          </div>
        </div>

      </div>

      {/* History Log Table & Records */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Daily Attendance & Weight History
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click on any attendance badge to toggle Yes/No directly
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setFilterAttendance('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterAttendance === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({gymLogs.length})
            </button>
            <button
              onClick={() => setFilterAttendance('yes')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterAttendance === 'yes' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-neutral-400 hover:text-emerald-400'
              }`}
            >
              Attended Yes ({stats.attendedDays})
            </button>
            <button
              onClick={() => setFilterAttendance('no')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterAttendance === 'no' 
                  ? 'bg-neutral-700 text-white' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Rest / Skip No ({stats.restDays})
            </button>
          </div>
        </div>

        {/* Table View */}
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950/80 text-neutral-400 text-xs uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Date</th>
                  <th className="py-3 px-4 sm:px-6">Gym Attendance (Yes / No)</th>
                  <th className="py-3 px-4 sm:px-6">Weight</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredLogs.map((log, index) => {
                  const isToday = log.date === todayString;
                  const prevLog = sortedLogs[index + 1];
                  const diffFromPrev = prevLog ? Math.round((log.weight - prevLog.weight) * 10) / 10 : 0;

                  return (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-neutral-800/40 transition-colors ${
                        isToday ? 'bg-blue-950/15' : ''
                      }`}
                    >
                      {/* 1. Date Field */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white font-mono text-xs sm:text-sm">
                            {log.date}
                          </span>
                          {isToday && (
                            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                              Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Attended (Yes/No) Field */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <button
                          type="button"
                          onClick={() => toggleGymAttendance(log.date, log.weight)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            log.attended
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60 shadow-xs'
                              : 'bg-neutral-800/90 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                          }`}
                          title="Click to toggle Yes/No"
                        >
                          {log.attended ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Yes (Attended)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                              <span>No (Rest Day)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* 3. Weight Field */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {log.weight} <span className="text-xs text-neutral-400 font-normal">kg</span>
                          </span>
                          {prevLog && diffFromPrev !== 0 && (
                            <span className={`text-[11px] font-medium flex items-center ${
                              diffFromPrev < 0 ? 'text-emerald-400' : 'text-blue-400'
                            }`}>
                              {diffFromPrev > 0 ? `+${diffFromPrev}` : diffFromPrev}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(log)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {confirmDeleteId === log.id ? (
                            <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-800 px-2 py-1 rounded-xl">
                              <span className="text-[10px] text-rose-200 font-medium">Delete?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteGymLog(log.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1 py-0.5 text-[10px] text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(log.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-500">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
            <p className="text-sm font-medium">No gym attendance logs match the selected filter</p>
            <button
              onClick={() => setFilterAttendance('all')}
              className="mt-2 text-xs text-blue-400 hover:underline cursor-pointer"
            >
              Show all logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
