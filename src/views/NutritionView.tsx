import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Zap, 
  Wheat, 
  Droplet, 
  Leaf, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Award, 
  Settings, 
  ArrowUpDown,
  PlusCircle,
  Copy,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { FoodItem, FoodLogEntry } from '../types';
import { AiNutritionModal } from '../components/AiNutritionModal';

export const NutritionView: React.FC = () => {
  const { 
    foodItems = [], 
    foodLogs = [], 
    nutritionGoals, 
    addFoodItem, 
    updateFoodItem, 
    deleteFoodItem,
    addFoodLog, 
    updateFoodLog, 
    deleteFoodLog, 
    updateNutritionGoals,
    showToast 
  } = useData();

  // Selected Date State (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // AI Nutrition Modal State
  const [isAiNutritionModalOpen, setIsAiNutritionModalOpen] = useState(false);
  const [aiNutritionInitialQuery, setAiNutritionInitialQuery] = useState('');

  // Slidedown & Quick Add State
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [servingQuantity, setServingQuantity] = useState<number>(1);
  const [foodSearchQuery, setFoodSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedDietFilter, setSelectedDietFilter] = useState<string>('All');

  // Custom Food Modal State
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customHindiName, setCustomHindiName] = useState('');
  const [customCategory, setCustomCategory] = useState('North Indian');
  const [customServingUnit, setCustomServingUnit] = useState('1 serving (150g)');
  const [customCalories, setCustomCalories] = useState<number>(200);
  const [customProtein, setCustomProtein] = useState<number>(10);
  const [customCarbs, setCustomCarbs] = useState<number>(25);
  const [customFat, setCustomFat] = useState<number>(6);
  const [customFiber, setCustomFiber] = useState<number>(4);
  const [customDietType, setCustomDietType] = useState<'Veg' | 'Non-Veg' | 'Vegan' | 'Egg'>('Veg');
  const [customNotes, setCustomNotes] = useState('');

  // Goals Modal State
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [goalCalories, setGoalCalories] = useState(nutritionGoals?.targetCalories || 2200);
  const [goalProtein, setGoalProtein] = useState(nutritionGoals?.targetProtein || 130);
  const [goalCarbs, setGoalCarbs] = useState(nutritionGoals?.targetCarbs || 240);
  const [goalFat, setGoalFat] = useState(nutritionGoals?.targetFat || 60);
  const [goalFiber, setGoalFiber] = useState(nutritionGoals?.targetFiber || 35);

  // Edit Entry Modal State
  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [editServings, setEditServings] = useState<number>(1);
  const [editMealType, setEditMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');

  // Database Explorer Filter / Sort
  const [dbSearch, setDbSearch] = useState('');
  const [dbSortBy, setDbSortBy] = useState<'name' | 'protein' | 'calories' | 'fiber'>('name');

  // Filtered Food Logs for the selected date
  const dayLogs = useMemo(() => {
    return foodLogs.filter(log => log.date === selectedDate);
  }, [foodLogs, selectedDate]);

  // Aggregate macros for selected date
  const dayTotals = useMemo(() => {
    return dayLogs.reduce((acc, log) => {
      return {
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbs) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
        fiber: acc.fiber + (Number(log.fiber) || 0),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  }, [dayLogs]);

  // Active Goals
  const currentGoals = nutritionGoals || {
    targetCalories: 2200,
    targetProtein: 130,
    targetCarbs: 240,
    targetFat: 60,
    targetFiber: 35
  };

  // Categories list derived from foodItems
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    foodItems.forEach(f => {
      if (f.category) cats.add(f.category);
    });
    return ['All', ...Array.from(cats).sort()];
  }, [foodItems]);

  // Filtered 100+ Food Items for slidedown/search
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesQuery = 
        item.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
        (item.hindiName && item.hindiName.toLowerCase().includes(foodSearchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(foodSearchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
      const matchesDiet = selectedDietFilter === 'All' || item.dietaryType === selectedDietFilter;

      return matchesQuery && matchesCategory && matchesDiet;
    });
  }, [foodItems, foodSearchQuery, selectedCategoryFilter, selectedDietFilter]);

  // Currently selected food item in add drawer
  const activeSelectedFood = useMemo(() => {
    if (!selectedFoodId) {
      return filteredFoodItems[0] || foodItems[0] || null;
    }
    return foodItems.find(f => f.id === selectedFoodId) || foodItems[0] || null;
  }, [foodItems, selectedFoodId, filteredFoodItems]);

  // Computed nutritional preview for current selection * serving quantity
  const previewNutrition = useMemo(() => {
    if (!activeSelectedFood) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    const q = Number(servingQuantity) || 1;
    return {
      calories: Math.round(activeSelectedFood.calories * q),
      protein: Math.round(activeSelectedFood.protein * q * 10) / 10,
      carbs: Math.round(activeSelectedFood.carbs * q * 10) / 10,
      fat: Math.round(activeSelectedFood.fat * q * 10) / 10,
      fiber: Math.round(activeSelectedFood.fiber * q * 10) / 10
    };
  }, [activeSelectedFood, servingQuantity]);

  // Date Navigation handlers
  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Add Log Entry Handler
  const handleAddFoodToLog = () => {
    if (!activeSelectedFood) {
      if (showToast) showToast('Please select a food item');
      return;
    }

    const q = Number(servingQuantity) || 1;
    addFoodLog({
      date: selectedDate,
      mealType: selectedMealType,
      foodItemId: activeSelectedFood.id,
      foodName: activeSelectedFood.name,
      servingQuantity: q,
      servingUnit: activeSelectedFood.servingUnit,
      calories: previewNutrition.calories,
      protein: previewNutrition.protein,
      carbs: previewNutrition.carbs,
      fat: previewNutrition.fat,
      fiber: previewNutrition.fiber,
      notes: activeSelectedFood.category
    });

    setIsAddEntryOpen(false);
    setServingQuantity(1);
  };

  // Quick Log direct from database item
  const handleQuickLogItem = (item: FoodItem, meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' = 'Lunch') => {
    addFoodLog({
      date: selectedDate,
      mealType: meal,
      foodItemId: item.id,
      foodName: item.name,
      servingQuantity: 1,
      servingUnit: item.servingUnit,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      notes: item.category
    });
  };

  // Save Custom Food Item
  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      if (showToast) showToast('Please enter food name');
      return;
    }

    const newFood: FoodItem = {
      id: `food-custom-${Date.now()}`,
      name: customName.trim(),
      hindiName: customHindiName.trim() || undefined,
      category: customCategory,
      servingUnit: customServingUnit.trim() || '1 serving',
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      dietaryType: customDietType,
      isCustom: true,
      notes: customNotes.trim() || undefined
    };

    addFoodItem(newFood);
    setSelectedFoodId(newFood.id);
    setIsCustomFoodModalOpen(false);

    // Reset fields
    setCustomName('');
    setCustomHindiName('');
    setCustomServingUnit('1 serving (150g)');
    setCustomCalories(200);
    setCustomProtein(10);
    setCustomCarbs(25);
    setCustomFat(6);
    setCustomFiber(4);
    setCustomNotes('');
  };

  // Save Goals
  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateNutritionGoals({
      targetCalories: Number(goalCalories) || 2200,
      targetProtein: Number(goalProtein) || 130,
      targetCarbs: Number(goalCarbs) || 240,
      targetFat: Number(goalFat) || 60,
      targetFiber: Number(goalFiber) || 35
    });
    setIsGoalsModalOpen(false);
  };

  // Edit Log Entry Save
  const handleSaveEditEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const baseFood = foodItems.find(f => f.id === editingEntry.foodItemId);
    const q = Number(editServings) || 1;

    let cal = editingEntry.calories;
    let pro = editingEntry.protein;
    let carb = editingEntry.carbs;
    let fat = editingEntry.fat;
    let fib = editingEntry.fiber;

    if (baseFood) {
      cal = Math.round(baseFood.calories * q);
      pro = Math.round(baseFood.protein * q * 10) / 10;
      carb = Math.round(baseFood.carbs * q * 10) / 10;
      fat = Math.round(baseFood.fat * q * 10) / 10;
      fib = Math.round(baseFood.fiber * q * 10) / 10;
    } else {
      const ratio = q / (editingEntry.servingQuantity || 1);
      cal = Math.round(cal * ratio);
      pro = Math.round(pro * ratio * 10) / 10;
      carb = Math.round(carb * ratio * 10) / 10;
      fat = Math.round(fat * ratio * 10) / 10;
      fib = Math.round(fib * ratio * 10) / 10;
    }

    updateFoodLog(editingEntry.id, {
      mealType: editMealType,
      servingQuantity: q,
      calories: cal,
      protein: pro,
      carbs: carb,
      fat: fat,
      fiber: fib
    });

    setEditingEntry(null);
  };

  // Copy previous day's food log
  const handleCopyYesterdayLog = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yLogs = foodLogs.filter(l => l.date === yesterdayStr);

    if (yLogs.length === 0) {
      if (showToast) showToast('No food logs found for previous day');
      return;
    }

    yLogs.forEach(yl => {
      addFoodLog({
        date: selectedDate,
        mealType: yl.mealType,
        foodItemId: yl.foodItemId,
        foodName: yl.foodName,
        servingQuantity: yl.servingQuantity,
        servingUnit: yl.servingUnit,
        calories: yl.calories,
        protein: yl.protein,
        carbs: yl.carbs,
        fat: yl.fat,
        fiber: yl.fiber,
        notes: yl.notes
      });
    });

    if (showToast) showToast(`Copied ${yLogs.length} items from ${yesterdayStr}`);
  };

  // Grouped meals
  const mealSections: Array<{ type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'; title: string; desc: string; iconColor: string }> = [
    { type: 'Breakfast', title: 'Breakfast', desc: 'Morning fuel & high-protein kickstart', iconColor: 'text-amber-400' },
    { type: 'Lunch', title: 'Lunch', desc: 'Midday balanced macro sustenance', iconColor: 'text-emerald-400' },
    { type: 'Dinner', title: 'Dinner', desc: 'Evening recovery & balanced nutrition', iconColor: 'text-indigo-400' },
    { type: 'Snacks', title: 'Snacks & Pre-Workout', desc: 'Healthy bites, nuts, chai & shakes', iconColor: 'text-purple-400' }
  ];

  // Macro % calculations
  const calPercent = Math.min(100, Math.round((dayTotals.calories / (currentGoals.targetCalories || 2200)) * 100));
  const proPercent = Math.min(100, Math.round((dayTotals.protein / (currentGoals.targetProtein || 130)) * 100));
  const carbPercent = Math.min(100, Math.round((dayTotals.carbs / (currentGoals.targetCarbs || 240)) * 100));
  const fatPercent = Math.min(100, Math.round((dayTotals.fat / (currentGoals.targetFat || 60)) * 100));
  const fibPercent = Math.min(100, Math.round((dayTotals.fiber / (currentGoals.targetFiber || 35)) * 100));

  // Sorted items for Database Explorer
  const explorerItems = useMemo(() => {
    return [...foodItems]
      .filter(item => {
        if (!dbSearch) return true;
        const q = dbSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.hindiName && item.hindiName.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (dbSortBy === 'protein') return b.protein - a.protein;
        if (dbSortBy === 'calories') return a.calories - b.calories;
        if (dbSortBy === 'fiber') return b.fiber - a.fiber;
        return a.name.localeCompare(b.name);
      });
  }, [foodItems, dbSearch, dbSortBy]);

  return (
    <div id="nutrition_view_container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 shadow-md">
              <Utensils className="w-6 h-6" />
            </div>
            <span>Indian Nutrition & Food Tracker</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track daily Calories, Protein, Carbohydrates, Fats, and Fiber with 100+ authentic Indian food items.
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Control */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-neutral-200 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleShiftDate(1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {selectedDate !== todayStr && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="px-2 py-1 text-[10px] font-bold uppercase rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 transition-colors ml-1"
              >
                Today
              </button>
            )}
          </div>

          {/* Quick Copy Yesterday */}
          <button
            onClick={handleCopyYesterdayLog}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer"
            title="Copy all meals from yesterday"
          >
            <Copy className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Copy Yesterday</span>
          </button>

          {/* AI Web Nutrition Finder Button */}
          <button
            id="btn_open_ai_nutrition_finder"
            onClick={() => {
              setAiNutritionInitialQuery('');
              setIsAiNutritionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-950/40 transition-all cursor-pointer select-none"
            title="Chat with AI to search Indian nutrition metrics on web and add items"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>✨ AI Nutrition Finder</span>
          </button>

          {/* Goals Settings Button */}
          <button
            onClick={() => {
              setGoalCalories(currentGoals.targetCalories || 2200);
              setGoalProtein(currentGoals.targetProtein || 130);
              setGoalCarbs(currentGoals.targetCarbs || 240);
              setGoalFat(currentGoals.targetFat || 60);
              setGoalFiber(currentGoals.targetFiber || 35);
              setIsGoalsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer"
            title="Configure Daily Targets"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Goals</span>
          </button>

          {/* + Log Food Item Button */}
          <button
            onClick={() => {
              if (foodItems.length > 0 && !selectedFoodId) {
                setSelectedFoodId(foodItems[0].id);
              }
              setIsAddEntryOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-950/40 transition-all cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Food</span>
          </button>
        </div>
      </div>

      {/* MACRO SUMMARY BANNER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Calories Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-neutral-900 border border-amber-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Calories</span>
            </span>
            <span className="text-[10px] text-amber-300/80 font-mono font-bold">
              {calPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
              {dayTotals.calories}
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              / {currentGoals.targetCalories || 2200} kcal target
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, calPercent)}%` }} 
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-neutral-900 border border-blue-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-blue-400" />
              <span>Protein</span>
            </span>
            <span className="text-[10px] text-blue-300/80 font-mono font-bold">
              {proPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-300 font-mono tracking-tight">
              {Math.round(dayTotals.protein * 10) / 10}g
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              / {currentGoals.targetProtein || 130}g target
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, proPercent)}%` }} 
            />
          </div>
        </div>

        {/* Carbs Card */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5" />
              <span>Carbs</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono font-bold">
              {carbPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-200 font-mono tracking-tight">
              {Math.round(dayTotals.carbs * 10) / 10}g
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              / {currentGoals.targetCarbs || 240}g target
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, carbPercent)}%` }} 
            />
          </div>
        </div>

        {/* Fats Card */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5" />
              <span>Fats</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono font-bold">
              {fatPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300 font-mono tracking-tight">
              {Math.round(dayTotals.fat * 10) / 10}g
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              / {currentGoals.targetFat || 60}g target
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, fatPercent)}%` }} 
            />
          </div>
        </div>

        {/* Fiber Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-neutral-900 border border-emerald-800/40 space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Fiber</span>
            </span>
            <span className="text-[10px] text-emerald-300/80 font-mono font-bold">
              {fibPercent}%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
              {Math.round(dayTotals.fiber * 10) / 10}g
            </div>
            <div className="text-[11px] text-neutral-400 font-medium">
              / {currentGoals.targetFiber || 35}g target
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full" 
              style={{ width: `${Math.min(100, fibPercent)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* MAIN TWO COLUMN WORKSPACE: Logged Meals vs 100+ Food Database */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Daily Meals by Category */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Meals for {selectedDate === todayStr ? 'Today' : selectedDate}</span>
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              {dayLogs.length} items logged ({dayTotals.calories} kcal)
            </span>
          </div>

          {mealSections.map((meal) => {
            const mealLogs = dayLogs.filter(l => l.mealType === meal.type);
            const mealCals = mealLogs.reduce((sum, l) => sum + (l.calories || 0), 0);
            const mealProt = Math.round(mealLogs.reduce((sum, l) => sum + (l.protein || 0), 0) * 10) / 10;
            const mealCarbs = Math.round(mealLogs.reduce((sum, l) => sum + (l.carbs || 0), 0) * 10) / 10;
            const mealFat = Math.round(mealLogs.reduce((sum, l) => sum + (l.fat || 0), 0) * 10) / 10;
            const mealFib = Math.round(mealLogs.reduce((sum, l) => sum + (l.fiber || 0), 0) * 10) / 10;

            return (
              <div
                key={meal.type}
                className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 space-y-3 shadow-xs"
              >
                {/* Meal Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      meal.type === 'Breakfast' ? 'bg-amber-400' :
                      meal.type === 'Lunch' ? 'bg-emerald-400' :
                      meal.type === 'Dinner' ? 'bg-indigo-400' : 'bg-purple-400'
                    }`} />
                    <h3 className="text-sm font-bold text-white">{meal.title}</h3>
                    <span className="text-[11px] text-neutral-400 hidden sm:inline">• {meal.desc}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 font-mono bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800">
                      {mealCals} kcal
                    </span>
                    <span className="text-[11px] font-semibold text-blue-400 font-mono bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-800/40">
                      {mealProt}g P
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMealType(meal.type);
                        setIsAddEntryOpen(true);
                      }}
                      className="p-1 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-neutral-800 transition-colors"
                      title={`Add to ${meal.title}`}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Logged items in this meal */}
                {mealLogs.length === 0 ? (
                  <div 
                    onClick={() => {
                      setSelectedMealType(meal.type);
                      setIsAddEntryOpen(true);
                    }}
                    className="p-3 text-center rounded-xl bg-neutral-950/40 border border-dashed border-neutral-800 text-neutral-400 text-xs hover:border-emerald-700/60 hover:text-neutral-300 transition-all cursor-pointer"
                  >
                    + Click to add food item to {meal.title}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mealLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-neutral-100 truncate">
                                {log.foodName}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-mono">
                                ({log.servingQuantity} × {log.servingUnit})
                              </span>
                            </div>

                            {/* Macro Badges */}
                            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 flex-wrap">
                              <span className="text-amber-400 font-bold">{log.calories} kcal</span>
                              <span>•</span>
                              <span className="text-blue-400 font-semibold">{log.protein}g Protein</span>
                              <span>•</span>
                              <span className="text-neutral-300">{log.carbs}g Carbs</span>
                              <span>•</span>
                              <span className="text-rose-400">{log.fat}g Fat</span>
                              <span>•</span>
                              <span className="text-emerald-400">{log.fiber}g Fiber</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingEntry(log);
                              setEditServings(log.servingQuantity);
                              setEditMealType(log.mealType);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Edit Quantity"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteFoodLog(log.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right 5 cols: 100+ Indian Food Database & Quick Explorer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">100+ Indian Food Library</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="btn_ai_lookup_library"
                  onClick={() => {
                    setAiNutritionInitialQuery(dbSearch || '');
                    setIsAiNutritionModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs hover:from-emerald-500 hover:to-teal-400 transition-all cursor-pointer select-none"
                  title="Ask AI to search web nutrition metrics"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>✨ AI Lookup</span>
                </button>
                <button
                  onClick={() => setIsCustomFoodModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 transition-all cursor-pointer select-none"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Custom</span>
                </button>
              </div>
            </div>

            {/* Explorer Search & Quick Sort Controls */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search 100+ dishes (Paneer, Roti, Idli, Dal Makhani)..."
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Sort pills */}
              <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto custom-scrollbar pb-1">
                <span className="text-neutral-400 shrink-0">Sort by:</span>
                {(['name', 'protein', 'fiber', 'calories'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDbSortBy(s)}
                    className={`px-2 py-0.5 rounded-lg capitalize transition-all shrink-0 font-medium ${
                      dbSortBy === s
                        ? 'bg-neutral-800 text-emerald-400 border border-emerald-800/50'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {s === 'protein' ? 'High Protein' : s === 'fiber' ? 'High Fiber' : s === 'calories' ? 'Low Calories' : 'A-Z'}
                  </button>
                ))}
              </div>
            </div>

            {/* List of items */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto custom-scrollbar pr-1">
              {explorerItems.length === 0 ? (
                <div className="p-5 text-center rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                  <p className="text-neutral-400 text-xs">
                    No listed food item found for <strong className="text-white">"{dbSearch}"</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setAiNutritionInitialQuery(dbSearch);
                      setIsAiNutritionModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Search web metrics for "{dbSearch}"</span>
                  </button>
                </div>
              ) : (
                explorerItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 hover:border-emerald-800/60 hover:bg-emerald-950/10 transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {item.name}
                          </span>
                          {item.hindiName && (
                            <span className="text-[10px] text-amber-400/80 font-medium">
                              ({item.hindiName})
                            </span>
                          )}
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            item.dietaryType === 'Non-Veg' ? 'bg-rose-950/60 text-rose-300' :
                            item.dietaryType === 'Vegan' ? 'bg-emerald-950/60 text-emerald-300' :
                            item.dietaryType === 'Egg' ? 'bg-amber-950/60 text-amber-300' :
                            'bg-green-950/60 text-green-300'
                          }`}>
                            {item.dietaryType}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          {item.servingUnit} • <span className="text-neutral-400">{item.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickLogItem(item, 'Lunch')}
                          className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer shrink-0"
                          title="Log 1 serving to Lunch"
                        >
                          + Log
                        </button>
                      </div>
                    </div>

                    {/* Macro pill summary */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-900">
                      <span className="text-amber-400 font-bold">{item.calories} kcal</span>
                      <span>•</span>
                      <span className="text-blue-400 font-semibold">{item.protein}g Protein</span>
                      <span>•</span>
                      <span className="text-neutral-300">{item.carbs}g Carbs</span>
                      <span>•</span>
                      <span className="text-rose-400">{item.fat}g Fat</span>
                      <span>•</span>
                      <span className="text-emerald-400">{item.fiber}g Fiber</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDEDOWN / DRAWER: LOG FOOD FROM 100+ INDIAN DATABASE */}
      {/* ========================================================================= */}
      {isAddEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-emerald-500/40 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Log Food Item</h3>
              </div>
              <button
                onClick={() => setIsAddEntryOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Meal Type & Date Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Target Meal</label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks & Pre-Workout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
            </div>

            {/* 100+ Items Slidedown / Searchable Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                Choose from 100+ Indian Food Items *
              </label>

              {/* Filters for Slidedown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search dishes (e.g. Dosa, Rajma, Chicken Tikka)..."
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="flex-1 px-2 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-300"
                  >
                    {allCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDietFilter}
                    onChange={(e) => setSelectedDietFilter(e.target.value)}
                    className="w-24 px-2 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-300"
                  >
                    <option value="All">All Diets</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Egg">Egg</option>
                  </select>
                </div>
              </div>

              {/* Slidedown List Box */}
              <div className="max-h-48 overflow-y-auto border border-neutral-700 rounded-xl bg-neutral-950 divide-y divide-neutral-850 custom-scrollbar">
                {filteredFoodItems.length === 0 ? (
                  <div className="p-4 text-center text-xs space-y-2">
                    <p className="text-neutral-400">
                      No dishes matching "{foodSearchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAiNutritionInitialQuery(foodSearchQuery);
                        setIsAiNutritionModalOpen(true);
                        setIsAddEntryOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI to find nutrition from web</span>
                    </button>
                  </div>
                ) : (
                  filteredFoodItems.map((item) => {
                    const isSelected = activeSelectedFood?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedFoodId(item.id)}
                        className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/80 text-white font-semibold border-l-4 border-emerald-500'
                            : 'hover:bg-neutral-900 text-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.hindiName && (
                              <span className="text-[10px] text-amber-400">({item.hindiName})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-normal">
                            {item.servingUnit} • {item.category}
                          </div>
                        </div>

                        <div className="text-right text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">{item.calories} kcal</span>
                          <span className="text-neutral-500 mx-1">|</span>
                          <span className="text-blue-400">{item.protein}g P</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Serving Quantity input */}
            {activeSelectedFood && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">Selected Dish:</span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{activeSelectedFood.name}</span>
                      {activeSelectedFood.hindiName && (
                        <span className="text-xs font-normal text-amber-400">({activeSelectedFood.hindiName})</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Standard unit: 1 serving = {activeSelectedFood.servingUnit}
                    </p>
                  </div>

                  <div className="w-28 text-right">
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Servings</label>
                    <input
                      type="number"
                      min={0.25}
                      max={20}
                      step={0.25}
                      value={servingQuantity}
                      onChange={(e) => setServingQuantity(Number(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-center font-mono font-bold text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Instant Live Macro Breakdown Calculation */}
                <div className="grid grid-cols-5 gap-2 pt-2 border-t border-neutral-800 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-neutral-900">
                    <div className="text-[10px] text-amber-400 font-bold uppercase">Calories</div>
                    <div className="text-xs font-black text-white">{previewNutrition.calories} kcal</div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-neutral-900">
                    <div className="text-[10px] text-blue-400 font-bold uppercase">Protein</div>
                    <div className="text-xs font-black text-white">{previewNutrition.protein}g</div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-neutral-900">
                    <div className="text-[10px] text-neutral-400 font-bold uppercase">Carbs</div>
                    <div className="text-xs font-black text-white">{previewNutrition.carbs}g</div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-neutral-900">
                    <div className="text-[10px] text-rose-400 font-bold uppercase">Fats</div>
                    <div className="text-xs font-black text-white">{previewNutrition.fat}g</div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-neutral-900">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Fiber</div>
                    <div className="text-xs font-black text-white">{previewNutrition.fiber}g</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddEntryOpen(false);
                  setIsCustomFoodModalOpen(true);
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                + Add New Custom Food to Database
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEntryOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFoodToLog}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer"
                >
                  Add to {selectedMealType}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOM FOOD ITEM TO DATABASE */}
      {/* ========================================================================= */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-emerald-500/40 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Custom Indian Food</h3>
              </div>
              <button
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomFood} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Food Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paneer Bhurji"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Hindi / Regional Name</label>
                  <input
                    type="text"
                    placeholder="e.g. पनीर भुर्जी"
                    value={customHindiName}
                    onChange={(e) => setCustomHindiName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Lentils & Dal">Lentils & Dal</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Rice & Breads">Rice & Breads</option>
                    <option value="Snacks & Street Food">Snacks & Street Food</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Beverages & Shakes">Beverages & Shakes</option>
                    <option value="Desserts & Sweets">Desserts & Sweets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Diet Type</label>
                  <select
                    value={customDietType}
                    onChange={(e) => setCustomDietType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Egg">Eggitarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Serving Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl (150g)"
                    value={customServingUnit}
                    onChange={(e) => setCustomServingUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              {/* 5 Macro Inputs */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-neutral-300 block">Macros Per 1 Serving:</span>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 mb-1">Calories</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={customCalories}
                      onChange={(e) => setCustomCalories(Number(e.target.value))}
                      className="w-full px-2 py-1 text-center text-xs font-mono font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-blue-400 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.5}
                      value={customProtein}
                      onChange={(e) => setCustomProtein(Number(e.target.value))}
                      className="w-full px-2 py-1 text-center text-xs font-mono font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.5}
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(Number(e.target.value))}
                      className="w-full px-2 py-1 text-center text-xs font-mono font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-400 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.5}
                      value={customFat}
                      onChange={(e) => setCustomFat(Number(e.target.value))}
                      className="w-full px-2 py-1 text-center text-xs font-mono font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.5}
                      value={customFiber}
                      onChange={(e) => setCustomFiber(Number(e.target.value))}
                      className="w-full px-2 py-1 text-center text-xs font-mono font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCustomFoodModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer"
                >
                  Save Food to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT LOGGED ENTRY SERVINGS */}
      {/* ========================================================================= */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl border border-emerald-500/40 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white">Edit Entry Quantity</h3>
              <button onClick={() => setEditingEntry(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEntry} className="space-y-3">
              <div>
                <span className="text-xs text-neutral-400 block">Food:</span>
                <span className="text-sm font-bold text-white">{editingEntry.foodName}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Meal</label>
                <select
                  value={editMealType}
                  onChange={(e) => setEditMealType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks & Pre-Workout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Number of Servings ({editingEntry.servingUnit})
                </label>
                <input
                  type="number"
                  min={0.25}
                  max={20}
                  step={0.25}
                  required
                  value={editServings}
                  onChange={(e) => setEditServings(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIGURE NUTRITION GOALS */}
      {/* ========================================================================= */}
      {isGoalsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-emerald-500/40 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Daily Nutrition Targets</h3>
              </div>
              <button
                onClick={() => setIsGoalsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoals} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">Target Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    max={10000}
                    value={goalCalories}
                    onChange={(e) => setGoalCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-400 mb-1">Target Protein (g)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={500}
                    value={goalProtein}
                    onChange={(e) => setGoalProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={1000}
                    value={goalCarbs}
                    onChange={(e) => setGoalCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={300}
                    value={goalFat}
                    onChange={(e) => setGoalFat(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={200}
                    value={goalFiber}
                    onChange={(e) => setGoalFiber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsGoalsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer"
                >
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Indian Nutrition Web Lookup & Chat Modal */}
      <AiNutritionModal
        isOpen={isAiNutritionModalOpen}
        onClose={() => setIsAiNutritionModalOpen(false)}
        initialQuery={aiNutritionInitialQuery}
        selectedDate={selectedDate}
        onAddFoodItem={addFoodItem}
        onAddFoodLog={addFoodLog}
      />
    </div>
  );
};
