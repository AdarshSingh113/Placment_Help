import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Filter, 
  Search,
  Droplet,
  HeartPulse,
  Sliders,
  CheckCheck,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Medicine, MedicineFrequency, MedicineTiming, MedicineType } from '../types';

export const MedicineView: React.FC = () => {
  const { 
    medicines, 
    medicineLogs, 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    toggleMedicineActive, 
    logMedicineDose, 
    toggleMedicineDose, 
    deleteMedicineLog 
  } = useData();

  // Selected date state (defaults to today YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const isToday = selectedDate === todayStr;

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [timingFilter, setTimingFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'schedule' | 'cabinet' | 'analytics' | 'guidelines'>('schedule');

  // Modal State for Add / Edit Medicine
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  
  // Form State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState<MedicineFrequency>('Daily');
  const [medTiming, setMedTiming] = useState<MedicineTiming>('Night');
  const [medType, setMedType] = useState<MedicineType>('Topical Solution');
  const [medPurpose, setMedPurpose] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medReminderTime, setMedReminderTime] = useState('22:30');
  const [medColor, setMedColor] = useState('emerald');
  const [medNotes, setMedNotes] = useState('');

  // Dose note modal state
  const [noteModalMed, setNoteModalMed] = useState<Medicine | null>(null);
  const [doseNoteText, setDoseNoteText] = useState('');

  // Date Navigation Helpers
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Active medicines list
  const activeMedicines = useMemo(() => {
    return medicines.filter(m => m.isActive);
  }, [medicines]);

  // Today's logs map for instant lookup
  const logsForSelectedDate = useMemo(() => {
    const map = new Map<string, typeof medicineLogs[0]>();
    medicineLogs.forEach(l => {
      if (l.date === selectedDate) {
        map.set(l.medicineId, l);
      }
    });
    return map;
  }, [medicineLogs, selectedDate]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalActive = activeMedicines.length;
    const takenCount = activeMedicines.filter(m => logsForSelectedDate.get(m.id)?.taken).length;
    const adherencePercent = totalActive > 0 ? Math.round((takenCount / totalActive) * 100) : 0;

    // Calculate streak for Minoxidil or overall
    const minoxidilMed = medicines.find(m => m.name.toLowerCase().includes('minoxidil'));
    let minoxidilStreak = 0;
    if (minoxidilMed) {
      const sortedDates = Array.from(new Set(
        medicineLogs
          .filter(l => l.medicineId === minoxidilMed.id && l.taken)
          .map(l => l.date)
      )).sort().reverse();

      const today = new Date();
      let checkDate = new Date(today);
      
      // If not taken today yet, check starting yesterday for streak continuity
      const todayIso = today.toISOString().split('T')[0];
      const hasToday = sortedDates.includes(todayIso);
      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const iso = checkDate.toISOString().split('T')[0];
        if (sortedDates.includes(iso)) {
          minoxidilStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate overall 30-day adherence rate
    const last30Days: string[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(d.toISOString().split('T')[0]);
    }
    let totalPossibleDoses = 0;
    let totalTakenDoses = 0;
    last30Days.forEach(day => {
      activeMedicines.forEach(m => {
        totalPossibleDoses++;
        const log = medicineLogs.find(l => l.medicineId === m.id && l.date === day);
        if (log?.taken) totalTakenDoses++;
      });
    });
    const monthlyRate = totalPossibleDoses > 0 ? Math.round((totalTakenDoses / totalPossibleDoses) * 100) : 100;

    return {
      totalActive,
      takenCount,
      adherencePercent,
      minoxidilStreak,
      monthlyRate
    };
  }, [activeMedicines, logsForSelectedDate, medicines, medicineLogs]);

  // Timing grouped items
  const timingOrder: MedicineTiming[] = ['Morning', 'Afternoon', 'Evening', 'Night', 'Anytime'];
  
  const groupedMedicines = useMemo(() => {
    const groups: { [key in MedicineTiming]?: Medicine[] } = {};
    timingOrder.forEach(t => { groups[t] = []; });

    activeMedicines.forEach(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (med.purpose && med.purpose.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTiming = timingFilter === 'All' || med.timing === timingFilter;

      if (matchesSearch && matchesTiming) {
        const timingKey = med.timing || 'Anytime';
        if (!groups[timingKey]) groups[timingKey] = [];
        groups[timingKey]!.push(med);
      }
    });

    return groups;
  }, [activeMedicines, searchQuery, timingFilter]);

  // Quick Preset Prescriptions for quick add
  const quickPresets = [
    {
      name: 'Minoxidil',
      dosage: '1 ml (5% Topical Solution)',
      type: 'Topical Solution',
      timing: 'Night',
      frequency: 'Daily',
      purpose: 'Hair Growth & Density Stimulation',
      instructions: 'Apply 1ml onto clean dry scalp. Massage gently and leave overnight.',
      color: 'emerald',
      reminderTime: '22:30'
    },
    {
      name: 'Finasteride',
      dosage: '1 mg',
      type: 'Tablet / Pill',
      timing: 'Morning',
      frequency: 'Daily',
      purpose: 'DHT Block & Hair Follicle Preservation',
      instructions: 'Take 1 tablet daily with water after morning breakfast.',
      color: 'blue',
      reminderTime: '09:00'
    },
    {
      name: 'Multivitamin & Zinc',
      dosage: '1 Tablet',
      type: 'Tablet / Pill',
      timing: 'Morning',
      frequency: 'Daily',
      purpose: 'Immune Defense, Micronutrients & Energy',
      instructions: 'Take 1 tablet with breakfast.',
      color: 'amber',
      reminderTime: '09:00'
    },
    {
      name: 'Omega-3 Fish Oil',
      dosage: '1000 mg (1 Capsule)',
      type: 'Capsule',
      timing: 'Lunch',
      frequency: 'Daily',
      purpose: 'Cognitive Focus & Anti-inflammatory Recovery',
      instructions: 'Take with or immediately after lunch meal.',
      color: 'cyan',
      reminderTime: '13:30'
    },
    {
      name: 'Vitamin D3 + K2',
      dosage: '60,000 IU / 2000 IU',
      type: 'Capsule',
      timing: 'Morning',
      frequency: 'Weekly',
      purpose: 'Bone Density, Testosterone & Mood Balance',
      instructions: 'Take with healthy fats post breakfast.',
      color: 'purple',
      reminderTime: '09:30'
    }
  ];

  const handleOpenAddModal = (preset?: typeof quickPresets[0]) => {
    setEditingMedId(null);
    if (preset) {
      setMedName(preset.name);
      setMedDosage(preset.dosage);
      setMedType(preset.type);
      setMedTiming(preset.timing);
      setMedFrequency(preset.frequency);
      setMedPurpose(preset.purpose);
      setMedInstructions(preset.instructions);
      setMedColor(preset.color);
      setMedReminderTime(preset.reminderTime);
      setMedNotes('');
    } else {
      setMedName('');
      setMedDosage('1 Tablet / 1 ml');
      setMedType('Tablet / Pill');
      setMedTiming('Morning');
      setMedFrequency('Daily');
      setMedPurpose('');
      setMedInstructions('');
      setMedColor('emerald');
      setMedReminderTime('09:00');
      setMedNotes('');
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (med: Medicine) => {
    setEditingMedId(med.id);
    setMedName(med.name);
    setMedDosage(med.dosage);
    setMedType(med.type);
    setMedTiming(med.timing);
    setMedFrequency(med.frequency);
    setMedPurpose(med.purpose || '');
    setMedInstructions(med.instructions || '');
    setMedColor(med.color || 'emerald');
    setMedReminderTime(med.reminderTime || '09:00');
    setMedNotes(med.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    if (editingMedId) {
      updateMedicine(editingMedId, {
        name: medName.trim(),
        dosage: medDosage.trim() || 'Standard Dose',
        type: medType,
        timing: medTiming,
        frequency: medFrequency,
        purpose: medPurpose.trim(),
        instructions: medInstructions.trim(),
        color: medColor,
        reminderTime: medReminderTime,
        notes: medNotes.trim()
      });
    } else {
      addMedicine({
        name: medName.trim(),
        dosage: medDosage.trim() || 'Standard Dose',
        type: medType,
        timing: medTiming,
        frequency: medFrequency,
        purpose: medPurpose.trim(),
        instructions: medInstructions.trim(),
        color: medColor,
        reminderTime: medReminderTime,
        isActive: true,
        notes: medNotes.trim(),
        startDate: selectedDate
      });
    }

    setIsModalOpen(false);
  };

  // Mark all active medicines for selected date as taken
  const handleMarkAllTaken = () => {
    activeMedicines.forEach(med => {
      const log = logsForSelectedDate.get(med.id);
      if (!log?.taken) {
        logMedicineDose(med.id, selectedDate, true, '', med.timing);
      }
    });
  };

  // Handle open dose note modal
  const handleOpenDoseNote = (med: Medicine) => {
    const existingLog = logsForSelectedDate.get(med.id);
    setNoteModalMed(med);
    setDoseNoteText(existingLog?.notes || '');
  };

  const handleSaveDoseNote = () => {
    if (!noteModalMed) return;
    const existingLog = logsForSelectedDate.get(noteModalMed.id);
    const taken = existingLog ? existingLog.taken : true;
    logMedicineDose(noteModalMed.id, selectedDate, taken, doseNoteText, noteModalMed.timing);
    setNoteModalMed(null);
  };

  // Color helpers
  const getColorClasses = (colorName: string = 'emerald') => {
    switch (colorName) {
      case 'blue':
        return {
          bgLight: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          btnActive: 'bg-blue-600 hover:bg-blue-500 text-white'
        };
      case 'purple':
        return {
          bgLight: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          btnActive: 'bg-purple-600 hover:bg-purple-500 text-white'
        };
      case 'amber':
        return {
          bgLight: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          btnActive: 'bg-amber-600 hover:bg-amber-500 text-white'
        };
      case 'rose':
        return {
          bgLight: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          btnActive: 'bg-rose-600 hover:bg-rose-500 text-white'
        };
      case 'cyan':
        return {
          bgLight: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          btnActive: 'bg-cyan-600 hover:bg-cyan-500 text-white'
        };
      default:
        return {
          bgLight: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          btnActive: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        };
    }
  };

  return (
    <div id="medicine_view_container" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Medicine & Supplements</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Tracker
                </span>
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Track daily Minoxidil application, prescription doses, vitamins & consistency streaks.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="mark_all_taken_btn"
            onClick={handleMarkAllTaken}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All Taken</span>
          </button>

          <button
            id="add_medicine_btn"
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Adherence */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-400">Today's Adherence</span>
            <div className="text-2xl font-bold text-white flex items-baseline gap-2">
              <span>{stats.adherencePercent}%</span>
              <span className="text-xs font-normal text-neutral-400">
                ({stats.takenCount}/{stats.totalActive} taken)
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${stats.adherencePercent === 100 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400'}`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Minoxidil & Med Streak */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-emerald-400/90 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Minoxidil Streak</span>
            </span>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
              <span>{stats.minoxidilStreak}</span>
              <span className="text-xs font-medium text-neutral-400">Days Active</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-400">Active Regimen</span>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
              <span>{stats.totalActive}</span>
              <span className="text-xs font-medium text-neutral-400">Medications</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        {/* 30-Day Adherence */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-400">30-Day Consistency</span>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
              <span>{stats.monthlyRate}%</span>
              <span className="text-xs font-medium text-emerald-400">Great track</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Date Navigation & View Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {formatDateDisplay(selectedDate)}
            </span>
            {isToday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                Today
              </span>
            )}
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 px-2 py-1 cursor-pointer"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800/80 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today's Schedule
          </button>
          <button
            onClick={() => setActiveTab('cabinet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cabinet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Medicine Cabinet ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Streak & History
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guidelines'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Minoxidil Guide
          </button>
        </div>
      </div>

      {/* TAB 1: TODAY'S SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Quick preset suggestion banner if very few medicines */}
          {medicines.length <= 1 && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-200">
                  <span className="font-semibold text-white">Custom Prescriptions:</span> You can add and customize any medicine or supplement anytime.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {quickPresets.slice(1, 4).map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleOpenAddModal(preset)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-500/40 transition-colors cursor-pointer"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search & Timing Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medication name, dosage or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              {['All', 'Morning', 'Afternoon', 'Evening', 'Night'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimingFilter(t)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    timingFilter === t
                      ? 'bg-neutral-200 text-neutral-900'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Grouped Cards */}
          <div className="space-y-6">
            {timingOrder.map((timing) => {
              const items = groupedMedicines[timing] || [];
              if (items.length === 0 && timingFilter !== 'All' && timingFilter !== timing) return null;
              if (items.length === 0 && timingFilter === 'All') return null;

              return (
                <div key={timing} className="space-y-3">
                  {/* Section Title */}
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        {timing} Doses
                      </h3>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  {/* Medicine List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((med) => {
                      const log = logsForSelectedDate.get(med.id);
                      const isTaken = !!log?.taken;
                      const colors = getColorClasses(med.color);
                      const isMinoxidil = med.name.toLowerCase().includes('minoxidil');

                      return (
                        <div
                          key={med.id}
                          id={`med_card_${med.id}`}
                          className={`p-5 rounded-2xl bg-neutral-900/90 border transition-all duration-200 relative flex flex-col justify-between space-y-4 ${
                            isTaken
                              ? 'border-emerald-500/50 bg-emerald-950/10'
                              : `${colors.border} hover:border-neutral-700`
                          }`}
                        >
                          {/* Top Row: Name, Badges & Checkmark */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                  {isMinoxidil && <Droplet className="w-4 h-4 text-emerald-400 shrink-0" />}
                                  <span>{med.name}</span>
                                </h4>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                                  {med.type}
                                </span>
                                {med.reminderTime && (
                                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-md border border-neutral-800">
                                    <Clock className="w-3 h-3 text-neutral-400" />
                                    {med.reminderTime}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-neutral-300">
                                Dosage: <span className="text-white font-mono">{med.dosage}</span> • {med.frequency}
                              </p>
                            </div>

                            {/* Tactile Toggle Button */}
                            <button
                              id={`toggle_dose_${med.id}`}
                              onClick={() => toggleMedicineDose(med.id, selectedDate, med.timing)}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                                isTaken
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                              }`}
                            >
                              {isTaken ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>Taken</span>
                                </>
                              ) : (
                                <>
                                  <Circle className="w-4 h-4 text-neutral-400" />
                                  <span>Take Dose</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Purpose & Instructions */}
                          <div className="space-y-2 pt-1 border-t border-neutral-800/60 text-xs">
                            {med.purpose && (
                              <p className="text-neutral-300">
                                <span className="font-semibold text-neutral-400">Target: </span>
                                {med.purpose}
                              </p>
                            )}

                            {med.instructions && (
                              <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-neutral-400 text-[11px] leading-relaxed">
                                <span className="font-semibold text-neutral-300 block mb-0.5">Instructions:</span>
                                {med.instructions}
                              </div>
                            )}

                            {/* Dose Log Note Display */}
                            {log?.notes && (
                              <p className="text-[11px] text-amber-300/90 italic bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                                📝 {log.notes}
                              </p>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                            <div className="text-[11px] text-neutral-400">
                              {isTaken && log?.takenAt ? (
                                <span className="text-emerald-400 font-mono">
                                  ✓ Taken at {log.takenAt}
                                </span>
                              ) : (
                                <span className="text-neutral-500">Scheduled for {med.timing}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenDoseNote(med)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Add dose note"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(med)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Edit medicine setup"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Empty state if nothing matches */}
            {activeMedicines.length === 0 && (
              <div className="p-10 text-center rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-white">No Medications Configured</h3>
                  <p className="text-xs text-neutral-400">
                    Add your daily Minoxidil regimen, vitamins, or supplements to start tracking intake and streaks.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddModal(quickPresets[0])}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  + Add Minoxidil (Default)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MEDICINE CABINET (ALL CUSTOMIZABLE MEDICATIONS) */}
      {activeTab === 'cabinet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white">Medicine Cabinet & Prescriptions</h3>
              <p className="text-xs text-neutral-400">
                Manage your active medications, formulation types, reminders, and custom supplements.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Prescription / Supplement</span>
            </button>
          </div>

          {/* Quick Presets row */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Preset Prescriptions (Click to add)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleOpenAddModal(preset)}
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                      {preset.name}
                    </span>
                    <Plus className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate">{preset.dosage} • {preset.timing}</p>
                </button>
              ))}
            </div>
          </div>

          {/* List of all medicines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicines.map((med) => {
              const colors = getColorClasses(med.color);
              return (
                <div
                  key={med.id}
                  className={`p-5 rounded-2xl bg-neutral-900 border ${
                    med.isActive ? colors.border : 'border-neutral-800 opacity-60'
                  } flex flex-col justify-between space-y-4 transition-all`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{med.name}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                            {med.type}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 font-mono mt-0.5">{med.dosage}</p>
                      </div>

                      {/* Active switch */}
                      <button
                        onClick={() => toggleMedicineActive(med.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          med.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {med.isActive ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-400">
                      <p><strong className="text-neutral-300">Timing:</strong> {med.timing} ({med.frequency})</p>
                      {med.reminderTime && <p><strong className="text-neutral-300">Reminder:</strong> {med.reminderTime}</p>}
                      {med.purpose && <p><strong className="text-neutral-300">Purpose:</strong> {med.purpose}</p>}
                      {med.instructions && (
                        <p className="text-[11px] text-neutral-400 line-clamp-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800/80">
                          {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                    <button
                      onClick={() => handleOpenEditModal(med)}
                      className="flex items-center gap-1 text-neutral-300 hover:text-white font-medium cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      onClick={() => deleteMedicine(med.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & STREAK MATRIX */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="pb-2 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white">Adherence Analytics & Habit Matrix</h3>
            <p className="text-xs text-neutral-400">
              Review your 14-day history and consistency rate across each individual medication.
            </p>
          </div>

          {/* Habit Heatmap Table */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="pb-3 font-semibold">Medicine</th>
                  <th className="pb-3 font-semibold">Timing</th>
                  {/* Last 10 Days Headers */}
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (9 - idx));
                    const dayNum = d.getDate();
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                    const isTodayHeader = d.toISOString().split('T')[0] === todayStr;
                    return (
                      <th key={idx} className={`pb-3 text-center font-mono ${isTodayHeader ? 'text-emerald-400 font-bold' : ''}`}>
                        <div className="text-[10px] text-neutral-400">{dayName}</div>
                        <div>{dayNum}</div>
                      </th>
                    );
                  })}
                  <th className="pb-3 text-right font-semibold">Adherence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {activeMedicines.map((med) => {
                  let takenIn10 = 0;
                  return (
                    <tr key={med.id} className="hover:bg-neutral-950/40">
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <span>{med.name}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">({med.dosage})</span>
                      </td>
                      <td className="py-3 text-neutral-400">{med.timing}</td>

                      {/* 10-day status dots */}
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (9 - idx));
                        const dateIso = d.toISOString().split('T')[0];
                        const log = medicineLogs.find(l => l.medicineId === med.id && l.date === dateIso);
                        const taken = !!log?.taken;
                        if (taken) takenIn10++;

                        return (
                          <td key={idx} className="py-3 text-center">
                            <button
                              onClick={() => toggleMedicineDose(med.id, dateIso, med.timing)}
                              className={`w-6 h-6 rounded-full inline-flex items-center justify-center transition-all cursor-pointer ${
                                taken
                                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                                  : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                              }`}
                              title={`${med.name} on ${dateIso}: ${taken ? 'Taken' : 'Missed / Pending'}`}
                            >
                              {taken ? '✓' : '•'}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-3 text-right font-mono font-bold text-emerald-400">
                        {Math.round((takenIn10 / 10) * 100)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MINOXIDIL CLINICAL & PROTOCOL GUIDE */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="pb-2 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-emerald-400" />
              <span>Minoxidil Application Protocol & Clinical Best Practices</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Evidence-based guidelines to maximize hair follicle stimulation and prevent scalp irritation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rule 1 */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Apply Only to 100% Dry Scalp</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Applying Minoxidil to a wet or damp scalp dramatically increases systemic absorption into the bloodstream, which can cause dizziness, heart palpitations, or headaches while reducing scalp efficacy.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Exact 1 ml Dosage (Dropper / 6 Sprays)</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Applying more than 1 ml does not yield faster hair regrowth, but increases greasy residue and product waste. Focus application directly onto target thinning scalp areas, not the hair strands.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
                  3
                </span>
                <span>4-Hour Absorption Window</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Allow at least 4 hours before washing hair, swimming, or sweating intensely. If applied at night, apply 30-45 minutes before lying down on pillows to avoid rubbing off onto bedding.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">
                  4
                </span>
                <span>Initial Shedding is Normal (Weeks 2–4)</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                A temporary increase in hair shedding during the first few weeks indicates old resting telogen hairs are being pushed out to make way for stronger anagen growth phase hairs. Do not stop application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEDICINE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {editingMedId ? 'Edit Medicine / Supplement' : 'Add Medicine / Supplement'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">Medicine / Supplement Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minoxidil 5%, Multivitamin, Finasteride, Creatine"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Dosage & Formulation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Dosage Amount *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 ml, 1 Tablet, 500 mg"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Formulation Type</label>
                  <select
                    value={medType}
                    onChange={(e) => setMedType(e.target.value as MedicineType)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Topical Solution">Topical Solution / Serum</option>
                    <option value="Tablet / Pill">Tablet / Pill</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Powder / Supplement">Powder / Supplement</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Drops">Drops</option>
                    <option value="Spray">Spray</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Timing & Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Timing of Day</label>
                  <select
                    value={medTiming}
                    onChange={(e) => setMedTiming(e.target.value as MedicineTiming)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Morning">Morning (Post Breakfast)</option>
                    <option value="Afternoon">Afternoon / Lunch</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night (Pre-bed)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Frequency</label>
                  <select
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value as MedicineFrequency)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Alternate Days">Alternate Days</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>
              </div>

              {/* Reminder Time & Accent Color */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Daily Reminder Time</label>
                  <input
                    type="time"
                    value={medReminderTime}
                    onChange={(e) => setMedReminderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Color Tag</label>
                  <select
                    value={medColor}
                    onChange={(e) => setMedColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="emerald">Emerald Green (Hair & Recovery)</option>
                    <option value="blue">Blue (Cognitive / Focus)</option>
                    <option value="purple">Purple (Vitamins & Longevity)</option>
                    <option value="amber">Amber (Daily Immunity & Zinc)</option>
                    <option value="cyan">Cyan (Supplements)</option>
                    <option value="rose">Rose (Prescription)</option>
                  </select>
                </div>
              </div>

              {/* Health Purpose */}
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">Health Goal / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Hair Density & Follicle Rejuvenation"
                  value={medPurpose}
                  onChange={(e) => setMedPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">Usage & Application Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Apply 1ml with dropper directly onto completely dry scalp. Leave overnight."
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-md shadow-emerald-950/50"
                >
                  {editingMedId ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOSE NOTE */}
      {noteModalMed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="text-sm font-bold text-white">
                Log Note for {noteModalMed.name} ({selectedDate})
              </h4>
              <button
                onClick={() => setNoteModalMed(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-300">Observation / Dose Details</label>
              <textarea
                rows={3}
                placeholder="e.g. Applied after evening shower. No scalp irritation."
                value={doseNoteText}
                onChange={(e) => setDoseNoteText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setNoteModalMed(null)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDoseNote}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
