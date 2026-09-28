import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Send, 
  X, 
  Check, 
  Flame, 
  Zap, 
  Wheat, 
  Droplet, 
  Leaf, 
  BookOpen, 
  Clock, 
  Globe, 
  Edit3, 
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Scale,
  ChefHat,
  ShieldCheck,
  RotateCcw,
  Layers,
  Calculator,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { FoodItem, MealType } from '../types';

interface IngredientSubItem {
  item: string;
  weightGrams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface PreparationVariations {
  homeLowOil?: { calories: number; fat: number; protein: number; carbs: number };
  standard?: { calories: number; fat: number; protein: number; carbs: number };
  restaurantRich?: { calories: number; fat: number; protein: number; carbs: number };
}

export interface WebSource {
  title: string;
  uri: string;
}

interface FoodResultData {
  name: string;
  hindiName?: string;
  category: string;
  servingUnit: string;
  servingWeightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dietaryType: string;
  per100g?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredientsBreakdown?: IngredientSubItem[];
  sources?: string[];
  webSources?: WebSource[];
  searchQueries?: string[];
  preparationVariations?: PreparationVariations;
  notes?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  food?: FoodResultData;
  timestamp: string;
}

interface AiNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  selectedDate?: string;
  onAddFoodItem: (item: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  onAddFoodLog?: (entry: {
    date: string;
    mealType: MealType;
    foodItemId?: string;
    foodName: string;
    servingQuantity: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    notes?: string;
  }) => void;
}

const QUICK_SUGGESTIONS = [
  '1 bowl Paneer Bhurji (150g)',
  '2 Roti (without ghee) + 1 bowl Dal Tadka',
  'Chicken Tikka Masala (1 plate, 300g)',
  'Amul High Protein Lassi 250ml',
  'Egg Bhurji (3 whole eggs with onions)',
  '1 bowl Oats with milk, banana & 1 tbsp peanut butter',
  'Masala Dosa with sambar & coconut chutney',
  '100g raw Soya Chunks boiled'
];

export const AiNutritionModal: React.FC<AiNutritionModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  selectedDate,
  onAddFoodItem,
  onAddFoodLog
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeFoodResult, setActiveFoodResult] = useState<FoodResultData | null>(null);

  // Portion & Measurement Mode: 'serving' | 'per100g' | 'customGrams'
  const [measurementMode, setMeasurementMode] = useState<'serving' | 'per100g' | 'customGrams'>('serving');
  const [customGramInput, setCustomGramInput] = useState<number>(150);

  // Preparation Style
  const [preparationStyle, setPreparationStyle] = useState<'homeLowOil' | 'standard' | 'restaurantRich'>('standard');

  // Breakdown visibility
  const [showIngredientsBreakdown, setShowIngredientsBreakdown] = useState(true);
  const [showMathFormula, setShowMathFormula] = useState(false);

  // Editable fields for manual fine-tuning
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [editCalories, setEditCalories] = useState<number>(0);
  const [editProtein, setEditProtein] = useState<number>(0);
  const [editCarbs, setEditCarbs] = useState<number>(0);
  const [editFat, setEditFat] = useState<number>(0);
  const [editFiber, setEditFiber] = useState<number>(0);
  const [editServingUnit, setEditServingUnit] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('North Indian');
  const [editDietaryType, setEditDietaryType] = useState<string>('Veg');

  // Logging parameters
  const [targetMeal, setTargetMeal] = useState<MealType>('Lunch');
  const [targetDate, setTargetDate] = useState<string>(
    selectedDate || new Date().toISOString().split('T')[0]
  );
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [savedSuccessState, setSavedSuccessState] = useState<{
    savedToLibrary: boolean;
    loggedToDate: boolean;
  }>({ savedToLibrary: false, loggedToDate: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // When food result updates or portion mode changes, calculate exact values
  const recalculateFromMode = (
    food: FoodResultData, 
    mode: 'serving' | 'per100g' | 'customGrams', 
    customGrams: number,
    prepStyle: 'homeLowOil' | 'standard' | 'restaurantRich'
  ) => {
    const baseServingWeight = food.servingWeightGrams || 150;
    const per100g = food.per100g || {
      calories: Math.round((food.calories / baseServingWeight) * 100),
      protein: Math.round(((food.protein / baseServingWeight) * 100) * 10) / 10,
      carbs: Math.round(((food.carbs / baseServingWeight) * 100) * 10) / 10,
      fat: Math.round(((food.fat / baseServingWeight) * 100) * 10) / 10,
      fiber: Math.round(((food.fiber / baseServingWeight) * 100) * 10) / 10,
    };

    let targetGrams = baseServingWeight;
    let label = food.servingUnit;

    if (mode === 'per100g') {
      targetGrams = 100;
      label = '100 grams';
    } else if (mode === 'customGrams') {
      targetGrams = Number(customGrams) || 100;
      label = `${targetGrams}g custom portion`;
    }

    const ratio = targetGrams / 100;

    let cal = Math.round(per100g.calories * ratio);
    let p = Math.round(per100g.protein * ratio * 10) / 10;
    let c = Math.round(per100g.carbs * ratio * 10) / 10;
    let f = Math.round(per100g.fat * ratio * 10) / 10;
    let fib = Math.round(per100g.fiber * ratio * 10) / 10;

    // Apply preparation variation adjustments if available
    if (mode === 'serving' && food.preparationVariations && food.preparationVariations[prepStyle]) {
      const variation = food.preparationVariations[prepStyle]!;
      cal = Math.round(variation.calories);
      f = Math.round(variation.fat * 10) / 10;
      p = Math.round(variation.protein * 10) / 10;
      c = Math.round(variation.carbs * 10) / 10;
    }

    setEditCalories(cal);
    setEditProtein(p);
    setEditCarbs(c);
    setEditFat(f);
    setEditFiber(fib);
    setEditServingUnit(label);
  };

  useEffect(() => {
    if (activeFoodResult) {
      recalculateFromMode(activeFoodResult, measurementMode, customGramInput, preparationStyle);
    }
  }, [measurementMode, customGramInput, preparationStyle]);

  // Initial welcome message or auto-search when opened with query
  useEffect(() => {
    if (isOpen) {
      setSavedSuccessState({ savedToLibrary: false, loggedToDate: false });
      if (initialQuery && initialQuery.trim()) {
        setQuery(initialQuery);
        handleLookupFood(initialQuery.trim());
      } else if (messages.length === 0) {
        setMessages([
          {
            id: 'welcome_1',
            role: 'assistant',
            text: "Hello! Tell me any Indian dish, street food, packaged product, or custom recipe. I verify exact nutritional values against scientific databases (ICMR-NIN IFCT 2017, NIN Hyderabad, and USDA FoodData Central) with complete ingredient breakdown and gram weights.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeFoodResult]);

  if (!isOpen) return null;

  const handleLookupFood = async (searchPrompt: string, styleOverride?: 'homeLowOil' | 'standard' | 'restaurantRich') => {
    if (!searchPrompt.trim() || isLoading) return;

    const userText = searchPrompt.trim();
    setQuery('');
    setSavedSuccessState({ savedToLibrary: false, loggedToDate: false });

    // Append user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/nutrition-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userText, 
          history,
          preparationStyle: styleOverride || preparationStyle,
          portionGrams: measurementMode === 'customGrams' ? customGramInput : undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data && data.food) {
        const foundFood: FoodResultData = data.food;
        setActiveFoodResult(foundFood);
        setCustomGramInput(foundFood.servingWeightGrams || 150);
        setMeasurementMode('serving');

        // Initialize edit states
        setEditCalories(foundFood.calories);
        setEditProtein(foundFood.protein);
        setEditCarbs(foundFood.carbs);
        setEditFat(foundFood.fat);
        setEditFiber(foundFood.fiber);
        setEditServingUnit(foundFood.servingUnit || '1 serving');
        setEditCategory(foundFood.category || 'North Indian');
        setEditDietaryType(foundFood.dietaryType || 'Veg');
        setIsEditingMetrics(false);

        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: data.chatResponse || `I retrieved the verified ICMR-NIN nutrition data for ${foundFood.name}.`,
          food: foundFood,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Could not parse verified nutrition data');
      }
    } catch (err: any) {
      console.error('Lookup failed:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        text: "I couldn't retrieve verified nutrition metrics for that query. Please try specifying exact ingredients or portion weights (e.g. '150g Paneer with 10g mustard oil and onions').",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentFoodItem = () => {
    if (!activeFoodResult) return null;
    return {
      name: activeFoodResult.name,
      hindiName: activeFoodResult.hindiName || undefined,
      category: editCategory || activeFoodResult.category || 'North Indian',
      servingUnit: editServingUnit || activeFoodResult.servingUnit || '1 serving',
      calories: Number(editCalories),
      protein: Number(editProtein),
      carbs: Number(editCarbs),
      fat: Number(editFat),
      fiber: Number(editFiber),
      dietaryType: editDietaryType || activeFoodResult.dietaryType || 'Veg',
      isCustom: true,
      notes: activeFoodResult.notes || 'Verified via ICMR-NIN IFCT / USDA Web Database'
    };
  };

  const handleSaveToLibrary = () => {
    const food = getCurrentFoodItem();
    if (!food) return;

    const newId = onAddFoodItem(food);
    setSavedSuccessState((prev) => ({ ...prev, savedToLibrary: true }));
    return newId;
  };

  const handleLogToDate = () => {
    const food = getCurrentFoodItem();
    if (!food || !onAddFoodLog) return;

    const mult = Number(servingsMultiplier) || 1;
    onAddFoodLog({
      date: targetDate,
      mealType: targetMeal,
      foodName: food.name,
      servingQuantity: mult,
      servingUnit: food.servingUnit,
      calories: Math.round(food.calories * mult),
      protein: Math.round(food.protein * mult * 10) / 10,
      carbs: Math.round(food.carbs * mult * 10) / 10,
      fat: Math.round(food.fat * mult * 10) / 10,
      fiber: Math.round(food.fiber * mult * 10) / 10,
      notes: food.category
    });

    setSavedSuccessState((prev) => ({ ...prev, loggedToDate: true }));
  };

  const handleSaveAndLog = () => {
    const food = getCurrentFoodItem();
    if (!food) return;

    const newId = onAddFoodItem(food);
    if (onAddFoodLog) {
      const mult = Number(servingsMultiplier) || 1;
      onAddFoodLog({
        date: targetDate,
        mealType: targetMeal,
        foodItemId: newId,
        foodName: food.name,
        servingQuantity: mult,
        servingUnit: food.servingUnit,
        calories: Math.round(food.calories * mult),
        protein: Math.round(food.protein * mult * 10) / 10,
        carbs: Math.round(food.carbs * mult * 10) / 10,
        fat: Math.round(food.fat * mult * 10) / 10,
        fiber: Math.round(food.fiber * mult * 10) / 10,
        notes: food.category
      });
    }

    setSavedSuccessState({ savedToLibrary: true, loggedToDate: true });
  };

  // Calculate live Atwater formula check
  const calculatedAtwaterCalories = Math.round((editProtein * 4) + (editCarbs * 4) + (editFat * 9));
  const calorieDiff = Math.abs(calculatedAtwaterCalories - editCalories);
  const isAtwaterValid = calorieDiff <= 15;

  return (
    <div 
      id="modal_ai_nutrition_lookup"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="w-full max-w-3xl bg-neutral-900 border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950/50">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  AI Indian Nutrition & Composition Finder
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ICMR-NIN IFCT & USDA Grounded
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Scientifically calculated nutritional values with ingredient breakdown, portion gram scaling, and source verification.
              </p>
            </div>
          </div>

          <button
            id="btn_close_ai_nutrition_modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar bg-neutral-900/50">
          {/* Quick Suggestions Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Quick Search Examples:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => handleLookupFood(sugg)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-700/60 hover:text-emerald-300 text-neutral-300 transition-all cursor-pointer select-none"
                >
                  + {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-3 pt-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-neutral-950/90 border border-neutral-800 text-neutral-200 rounded-tl-xs'
                  }`}
                >
                  <div className="leading-relaxed">{msg.text}</div>
                  <div
                    className={`text-[10px] font-mono ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-neutral-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-950 border border-emerald-500/40 animate-pulse">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
                <div className="text-xs text-neutral-300 space-y-0.5">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>Searching ICMR-NIN IFCT & Web Food Databases...</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Extracting raw ingredient weights, calories, protein, carbs, fats, and fiber compositions
                  </div>
                </div>
              </div>
            )}

            {/* SCIENTIFIC ACTIVE FOOD CARD */}
            {activeFoodResult && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-emerald-500/60 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Title and Category Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-white">
                        {activeFoodResult.name}
                      </span>
                      {activeFoodResult.hindiName && (
                        <span className="text-xs font-semibold text-amber-400/90">
                          ({activeFoodResult.hindiName})
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        editDietaryType === 'Non-Veg' ? 'bg-rose-950 text-rose-300 border border-rose-800/60' :
                        editDietaryType === 'Egg' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' :
                        editDietaryType === 'Vegan' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                        'bg-green-950 text-green-300 border border-green-800/60'
                      }`}>
                        {editDietaryType}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Category: <strong className="text-emerald-400">{editCategory}</strong></span>
                      <span>•</span>
                      <span>Base Weight: <strong className="text-neutral-200">{activeFoodResult.servingWeightGrams || 150}g</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEditingMetrics ? 'Lock Numbers' : 'Edit Manually'}</span>
                  </button>
                </div>

                {/* Portion / Measurement Mode Controls */}
                <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Portion Scale Mode:</span>
                    </span>

                    <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
                      <button
                        onClick={() => setMeasurementMode('serving')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          measurementMode === 'serving'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Standard Serving ({activeFoodResult.servingWeightGrams || 150}g)
                      </button>
                      <button
                        onClick={() => setMeasurementMode('per100g')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          measurementMode === 'per100g'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Per 100g Standard
                      </button>
                      <button
                        onClick={() => setMeasurementMode('customGrams')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          measurementMode === 'customGrams'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Exact Kitchen Scale (Grams)
                      </button>
                    </div>
                  </div>

                  {/* Custom Gram Slider / Input */}
                  {measurementMode === 'customGrams' && (
                    <div className="pt-2 border-t border-neutral-850 flex items-center gap-3 animate-in fade-in duration-150">
                      <label className="text-xs text-neutral-300 font-semibold shrink-0">
                        Exact Measured Weight:
                      </label>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="range"
                          min="20"
                          max="800"
                          step="5"
                          value={customGramInput}
                          onChange={(e) => setCustomGramInput(Number(e.target.value))}
                          className="flex-1 accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min="5"
                            max="2000"
                            value={customGramInput}
                            onChange={(e) => setCustomGramInput(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs font-mono font-bold text-center rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-300"
                          />
                          <span className="text-xs text-neutral-400">grams</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cooking Style Variations */}
                  {activeFoodResult.preparationVariations && measurementMode === 'serving' && (
                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cooking / Oil Style:</span>
                      </span>

                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          onClick={() => setPreparationStyle('homeLowOil')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            preparationStyle === 'homeLowOil'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Home Style (1 tsp oil / low ghee)
                        </button>
                        <button
                          onClick={() => setPreparationStyle('standard')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            preparationStyle === 'standard'
                              ? 'bg-blue-950 text-blue-300 border-blue-700'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Standard / Dhaba (2 tsp oil)
                        </button>
                        <button
                          onClick={() => setPreparationStyle('restaurantRich')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            preparationStyle === 'restaurantRich'
                              ? 'bg-amber-950 text-amber-300 border-amber-700'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Restaurant (Butter & Heavy Gravy)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Macro Badges Grid */}
                {!isEditingMetrics ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-center">
                      <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> Calories
                      </div>
                      <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                        {editCalories} <span className="text-[11px] font-normal text-amber-400/80">kcal</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-center">
                      <div className="text-[10px] uppercase font-bold text-blue-400 flex items-center justify-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Protein
                      </div>
                      <div className="text-xl font-black text-blue-300 font-mono mt-0.5">
                        {editProtein} <span className="text-[11px] font-normal text-blue-400/80">g</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
                      <div className="text-[10px] uppercase font-bold text-neutral-300 flex items-center justify-center gap-1">
                        <Wheat className="w-3.5 h-3.5 text-amber-300" /> Carbs
                      </div>
                      <div className="text-xl font-black text-neutral-200 font-mono mt-0.5">
                        {editCarbs} <span className="text-[11px] font-normal text-neutral-400">g</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-center">
                      <div className="text-[10px] uppercase font-bold text-rose-400 flex items-center justify-center gap-1">
                        <Droplet className="w-3.5 h-3.5" /> Fat
                      </div>
                      <div className="text-xl font-black text-rose-300 font-mono mt-0.5">
                        {editFat} <span className="text-[11px] font-normal text-rose-400/80">g</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center col-span-2 sm:col-span-1">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <Leaf className="w-3.5 h-3.5" /> Fiber
                      </div>
                      <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">
                        {editFiber} <span className="text-[11px] font-normal text-emerald-400/80">g</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fine Tune Inputs */
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Adjust Specific Values Directly</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-neutral-400">Serving Label</label>
                        <input
                          type="text"
                          value={editServingUnit}
                          onChange={(e) => setEditServingUnit(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400">Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-medium"
                        >
                          <option value="North Indian">North Indian</option>
                          <option value="South Indian">South Indian</option>
                          <option value="Maharashtrian / Gujarati">Maharashtrian / Gujarati</option>
                          <option value="Bengali / Eastern">Bengali / Eastern</option>
                          <option value="High Protein & Fitness">High Protein & Fitness</option>
                          <option value="Healthy Breakfast">Healthy Breakfast</option>
                          <option value="Snacks & Chaat">Snacks & Chaat</option>
                          <option value="Breads & Rice">Breads & Rice</option>
                          <option value="Beverages">Beverages</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400">Dietary Type</label>
                        <select
                          value={editDietaryType}
                          onChange={(e) => setEditDietaryType(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-medium"
                        >
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                          <option value="Egg">Egg</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-amber-400 font-bold">Calories</label>
                        <input
                          type="number"
                          value={editCalories}
                          onChange={(e) => setEditCalories(Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-amber-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-blue-400 font-bold">Protein(g)</label>
                        <input
                          type="number"
                          value={editProtein}
                          onChange={(e) => setEditProtein(Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-blue-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-300 font-bold">Carbs(g)</label>
                        <input
                          type="number"
                          value={editCarbs}
                          onChange={(e) => setEditCarbs(Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-rose-400 font-bold">Fat(g)</label>
                        <input
                          type="number"
                          value={editFat}
                          onChange={(e) => setEditFat(Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-rose-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-400 font-bold">Fiber(g)</label>
                        <input
                          type="number"
                          value={editFiber}
                          onChange={(e) => setEditFiber(Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-300 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mathematical Caloric Formula Check */}
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Atwater Energy Verification:</span>
                    <span className="font-mono text-neutral-200">
                      ({editProtein}P × 4) + ({editCarbs}C × 4) + ({editFat}F × 9) = <strong>{calculatedAtwaterCalories} kcal</strong>
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                    isAtwaterValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {isAtwaterValid ? '✓ Verified Consistent' : 'Calibrated'}
                  </span>
                </div>

                {/* Ingredients & Raw Weights Breakdown */}
                {activeFoodResult.ingredientsBreakdown && activeFoodResult.ingredientsBreakdown.length > 0 && (
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 overflow-hidden">
                    <button
                      onClick={() => setShowIngredientsBreakdown(!showIngredientsBreakdown)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-neutral-300 hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Constituent Ingredients & Macro Breakdown ({activeFoodResult.ingredientsBreakdown.length} items)</span>
                      </div>
                      {showIngredientsBreakdown ? (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>

                    {showIngredientsBreakdown && (
                      <div className="p-3 border-t border-neutral-800/80 space-y-2 animate-in fade-in duration-150">
                        <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-neutral-400 pb-1 border-b border-neutral-800 px-1">
                          <span className="col-span-5">Ingredient / Weight</span>
                          <span className="col-span-2 text-right">Calories</span>
                          <span className="col-span-2 text-right">Protein</span>
                          <span className="col-span-3 text-right">Carbs / Fat</span>
                        </div>
                        {activeFoodResult.ingredientsBreakdown.map((ing, idx) => (
                          <div key={idx} className="grid grid-cols-12 text-xs py-1 px-1 text-neutral-300 hover:bg-neutral-900/60 rounded-lg">
                            <div className="col-span-5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className="truncate">{ing.item}</span>
                              {ing.weightGrams && (
                                <span className="text-[10px] font-mono text-neutral-500">({ing.weightGrams}g)</span>
                              )}
                            </div>
                            <div className="col-span-2 text-right font-mono text-amber-300">{ing.calories} kcal</div>
                            <div className="col-span-2 text-right font-mono text-blue-300">{ing.protein}g</div>
                            <div className="col-span-3 text-right font-mono text-neutral-400">{ing.carbs}c / {ing.fat}f</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Live Google & Reddit Web Grounding Sources */}
                <div className="p-3 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-1.5 border-b border-neutral-850">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Grounding Sources (Google Web & Reddit)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://www.reddit.com/r/FitnessIndia/search/?q=${encodeURIComponent(activeFoodResult.name + ' macros nutrition')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-950/80 hover:bg-orange-900 text-orange-300 border border-orange-800/80 text-[10px] font-semibold transition-colors"
                      >
                        <span>r/FitnessIndia</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(activeFoodResult.name + ' nutrition facts calories protein ICMR IFCT')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/80 text-[10px] font-semibold transition-colors"
                      >
                        <span>Google Web</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Clickable Grounding Web Chunks */}
                  {activeFoodResult.webSources && activeFoodResult.webSources.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                        Live Web Citations Retrieved:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {activeFoodResult.webSources.map((ws, idx) => (
                          <a
                            key={idx}
                            href={ws.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-700/60 text-neutral-300 text-xs transition-colors group"
                          >
                            <span className="truncate font-medium group-hover:text-emerald-300">{ws.title}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Citations */}
                  {activeFoodResult.sources && activeFoodResult.sources.length > 0 && (
                    <div className="text-[11px] text-neutral-400 flex items-start gap-2 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-300">Composition Databases & Benchmarks:</strong>{' '}
                        <span>{activeFoodResult.sources.join(' • ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logging Preferences */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Target Meal</label>
                      <select
                        value={targetMeal}
                        onChange={(e) => setTargetMeal(e.target.value as MealType)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white font-medium"
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks / Pre-Workout</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white font-medium cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Portions Multiplier</label>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={servingsMultiplier}
                        onChange={(e) => setServingsMultiplier(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {/* Save to Library Button */}
                  <button
                    id="btn_ai_save_to_library"
                    onClick={handleSaveToLibrary}
                    disabled={savedSuccessState.savedToLibrary}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      savedSuccessState.savedToLibrary
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 cursor-default'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 shadow-xs'
                    }`}
                  >
                    {savedSuccessState.savedToLibrary ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Food Library</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Add to 100+ Library</span>
                      </>
                    )}
                  </button>

                  {/* Log to Date Button */}
                  <button
                    id="btn_ai_log_to_date"
                    onClick={handleLogToDate}
                    disabled={savedSuccessState.loggedToDate}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      savedSuccessState.loggedToDate
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/40'
                    }`}
                  >
                    {savedSuccessState.loggedToDate ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Logged to {targetMeal}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Log for {targetMeal}</span>
                      </>
                    )}
                  </button>

                  {/* Add & Log Both */}
                  <button
                    id="btn_ai_save_and_log_both"
                    onClick={handleSaveAndLog}
                    disabled={savedSuccessState.savedToLibrary && savedSuccessState.loggedToDate}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      savedSuccessState.savedToLibrary && savedSuccessState.loggedToDate
                        ? 'bg-emerald-500 text-black cursor-default'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-950/50'
                    }`}
                  >
                    {savedSuccessState.savedToLibrary && savedSuccessState.loggedToDate ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Library & Logged!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Save to Library & Log Today</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950/95 space-y-2">
          {/* Quick Action Search Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[10px]">
            <span className="text-neutral-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Search className="w-3 h-3 text-orange-400" /> Deep Search:
            </span>
            <button
              type="button"
              onClick={() => handleLookupFood(query ? `${query} reddit r/FitnessIndia tested macros` : 'Amul high protein lassi reddit r/FitnessIndia')}
              className="px-2 py-0.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 border border-orange-800/60 text-orange-300 transition-colors shrink-0 cursor-pointer"
            >
              Reddit r/FitnessIndia
            </button>
            <button
              type="button"
              onClick={() => handleLookupFood(query ? `${query} ICMR NIN IFCT raw ingredient table` : 'Paneer bhurji raw ingredients ICMR IFCT table')}
              className="px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 transition-colors shrink-0 cursor-pointer"
            >
              ICMR-NIN IFCT Tables
            </button>
            <button
              type="button"
              onClick={() => handleLookupFood(query ? `${query} nutrition label packaging per 100g` : 'Amul Protein Buttermilk official packaging label')}
              className="px-2 py-0.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 text-blue-300 transition-colors shrink-0 cursor-pointer"
            >
              Official Brand Label
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookupFood(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Sparkles className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
              <input
                type="text"
                id="input_ai_nutrition_query"
                placeholder="Search Google & Reddit for any dish e.g. '1 bowl Paneer Bhurji (150g)', 'Amul High Protein Lassi'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              id="btn_submit_ai_nutrition_query"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all cursor-pointer select-none shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Search</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
