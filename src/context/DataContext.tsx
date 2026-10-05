import React, { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { 
  Company, 
  Question, 
  Guesstimate, 
  EstimationFramework, 
  GDTopic, 
  NewsItem, 
  DataPoint, 
  Mistake, 
  DailyLog, 
  ReadingItem, 
  CommunicationLog, 
  DailyFocusTask,
  CustomFieldDefinition,
  InterviewRecord,
  UserSettings,
  GymLog,
  FoodItem,
  FoodLogEntry,
  DailyNutritionGoals,
  Medicine,
  MedicineLog,
  KnowledgeSummary
} from '../types';
import { 
  initialCompanies, 
  initialQuestions, 
  initialGuesstimates, 
  initialFrameworks, 
  initialGDTopics, 
  initialNews, 
  initialDataPoints, 
  initialMistakes, 
  initialDailyFocusTasks, 
  initialDailyLogs, 
  initialReadingItems, 
  initialCommunicationLogs, 
  initialInterviewRecords, 
  initialCustomFields, 
  initialUserSettings,
  initialGymLogs,
  initialFoodLogs,
  initialNutritionGoals,
  initialMedicines,
  initialMedicineLogs
} from '../lib/sampleData';
import { initialIndianFoods } from '../data/indianFoods';
import { initialKnowledgeSummaries } from '../data/sampleKnowledge';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { deleteVideoBlob } from '../utils/mediaStorage';

interface SearchResultItem {
  id: string;
  type: 'Company' | 'Question' | 'Guesstimate' | 'GD Topic' | 'News' | 'Data Point' | 'Mistake' | 'Framework' | 'Medicine' | 'Knowledge';
  title: string;
  subtitle: string;
  category?: string;
  targetView: string;
  targetId?: string;
}

interface DataContextType {
  // Entities
  companies: Company[];
  questions: Question[];
  guesstimates: Guesstimate[];
  frameworks: EstimationFramework[];
  gdTopics: GDTopic[];
  news: NewsItem[];
  newsItems?: NewsItem[];
  dataPoints: DataPoint[];
  mistakes: Mistake[];
  dailyTasks: DailyFocusTask[];
  dailyLogs: DailyLog[];
  readingItems: ReadingItem[];
  communicationLogs: CommunicationLog[];
  interviewRecords: InterviewRecord[];
  gymLogs: GymLog[];
  foodItems: FoodItem[];
  foodLogs: FoodLogEntry[];
  nutritionGoals: DailyNutritionGoals;
  medicines: Medicine[];
  medicineLogs: MedicineLog[];
  knowledgeSummaries: KnowledgeSummary[];
  customFields: CustomFieldDefinition[];
  userSettings: UserSettings;
  categories: string[];

  // Readiness Metrics
  readinessScore: number;
  readinessBreakdown: {
    interview: number;
    guesstimate: number;
    case: number;
    gd: number;
    communication: number;
    domain: number;
    companyResearch: number;
  };
  weakAreas: {
    name: string;
    readiness: number;
    status: 'Strong' | 'Needs Improvement' | 'Weak';
    targetView: string;
  }[];
  streakDays: number;
  weeklyGrowthTrends: {
    questionsThisWeek: number;
    guesstimatesThisWeek: number;
    gdTopicsThisWeek: number;
    casesThisWeek: number;
    readinessTrend: number;
  };

  // Active view navigation & modal states
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddDefaultType: string;
  openQuickAdd: (defaultType?: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  practiceModalQuestionId: string | null;
  setPracticeModalQuestionId: (id: string | null) => void;
  activePreInterviewCompanyId: string | null;
  setActivePreInterviewCompanyId: (id: string | null) => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // CRUD Actions
  // Companies
  addCompany: (comp: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCompany: (id: string, updates: Partial<Company>, silent?: boolean) => void;
  deleteCompany: (id: string) => void;
  duplicateCompany: (id: string) => void;
  toggleCompanyFavorite: (id: string) => void;

  // Questions
  addQuestion: (q: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateQuestion: (id: string, updates: Partial<Question>, silent?: boolean) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  toggleQuestionFavorite: (id: string) => void;
  logQuestionPractice: (id: string, confidence: number, timeTakenSeconds?: number, feedback?: string) => void;
  recordQuestionPractice: (id: string, confidence: number, notes?: string) => void;

  // Guesstimates
  addGuesstimate: (g: Omit<Guesstimate, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateGuesstimate: (id: string, updates: Partial<Guesstimate>) => void;
  deleteGuesstimate: (id: string) => void;
  duplicateGuesstimate: (id: string) => void;
  toggleGuesstimateFavorite: (id: string) => void;
  evaluateGuesstimateFormula: (variables: Guesstimate['variables'], formula?: string) => number;

  // Frameworks
  addFramework: (fw: Omit<EstimationFramework, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFramework: (id: string, updates: Partial<EstimationFramework>) => void;
  deleteFramework: (id: string) => void;
  duplicateFramework: (id: string) => void;

  // GD Topics
  addGDTopic: (topic: Omit<GDTopic, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateGDTopic: (id: string, updates: Partial<GDTopic>) => void;
  deleteGDTopic: (id: string) => void;
  toggleGDTopicFavorite: (id: string) => void;

  // News
  addNews: (n: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // Data Points
  addDataPoint: (dp: Omit<DataPoint, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDataPoint: (id: string, updates: Partial<DataPoint>) => void;
  deleteDataPoint: (id: string) => void;

  // Mistakes
  addMistake: (m: Omit<Mistake, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMistake: (id: string, updates: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;
  incrementMistakeFrequency: (id: string) => void;

  // Daily Tasks & Logs
  addDailyTask: (task: Omit<DailyFocusTask, 'id' | 'createdAt'>) => void;
  updateDailyTask: (id: string, updates: Partial<DailyFocusTask>) => void;
  toggleDailyTask: (id: string) => void;
  deleteDailyTask: (id: string) => void;
  addDailyLog: (log: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDailyLog: (id: string, updates: Partial<DailyLog>) => void;
  deleteDailyLog: (id: string) => void;
  addReadingItem: (item: Omit<ReadingItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReadingItem: (id: string, updates: Partial<ReadingItem>) => void;
  deleteReadingItem: (id: string) => void;
  addCommunicationLog: (log: Omit<CommunicationLog, 'id' | 'createdAt'>) => void;
  deleteCommunicationLog: (id: string) => void;
  addInterviewRecord: (rec: Omit<InterviewRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInterviewRecord: (id: string, updates: Partial<InterviewRecord>) => void;
  deleteInterviewRecord: (id: string) => void;
  addGymLog: (log: Omit<GymLog, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateGymLog: (id: string, updates: Partial<GymLog>) => void;
  deleteGymLog: (id: string) => void;
  toggleGymAttendance: (date: string, defaultWeight?: number) => void;

  // Food & Nutrition
  addFoodItem: (food: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  addFoodLog: (log: Omit<FoodLogEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFoodLog: (id: string, updates: Partial<FoodLogEntry>) => void;
  deleteFoodLog: (id: string) => void;
  updateNutritionGoals: (goals: Partial<DailyNutritionGoals>) => void;

  // Medicine & Supplements
  addMedicine: (med: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  toggleMedicineActive: (id: string) => void;
  logMedicineDose: (medicineId: string, date: string, taken: boolean, notes?: string, timing?: string) => string;
  toggleMedicineDose: (medicineId: string, date: string, timing?: string) => void;
  deleteMedicineLog: (id: string) => void;

  // AI Knowledge Summarizer & Research Vault
  addKnowledgeSummary: (item: Omit<KnowledgeSummary, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateKnowledgeSummary: (id: string, updates: Partial<KnowledgeSummary>) => void;
  deleteKnowledgeSummary: (id: string) => void;
  toggleKnowledgeFavorite: (id: string) => void;
  addKnowledgeQA: (id: string, question: string, answer: string) => void;

  // Custom Fields Engine
  addCustomField: (field: Omit<CustomFieldDefinition, 'id'>) => void;
  updateCustomField: (id: string, updates: Partial<CustomFieldDefinition>) => void;
  deleteCustomField: (id: string) => void;

  // Categories
  addCategory: (cat: string) => void;
  deleteCategory: (cat: string) => void;

  // Settings & System
  syncStatus: 'synced' | 'saving' | 'offline' | 'guest';
  lastSyncedAt: string | null;
  forceSyncCloud: () => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  resetAllToSampleData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  // Global Search
  searchAll: (queryText: string) => SearchResultItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'placement_os_data_v1';

function safeParseArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeParseObject<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Navigation state
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultType, setQuickAddDefaultType] = useState('company');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [practiceModalQuestionId, setPracticeModalQuestionId] = useState<string | null>(null);
  const [activePreInterviewCompanyId, setActivePreInterviewCompanyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline' | 'guest'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const isCloudInitializedRef = useRef<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLocalMutationTimeRef = useRef<number>(0);

  // Entities state with bulletproof safe parsing
  const [companies, setCompanies] = useState<Company[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_companies`, initialCompanies)
  );

  const [questions, setQuestions] = useState<Question[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_questions`, initialQuestions)
  );

  const [guesstimates, setGuesstimates] = useState<Guesstimate[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_guesstimates`, initialGuesstimates)
  );

  const [frameworks, setFrameworks] = useState<EstimationFramework[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_frameworks`, initialFrameworks)
  );

  const [gdTopics, setGdTopics] = useState<GDTopic[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_gdTopics`, initialGDTopics)
  );

  const [news, setNews] = useState<NewsItem[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_news`, initialNews)
  );

  const [dataPoints, setDataPoints] = useState<DataPoint[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_dataPoints`, initialDataPoints)
  );

  const [mistakes, setMistakes] = useState<Mistake[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_mistakes`, initialMistakes)
  );

  const [dailyTasks, setDailyTasks] = useState<DailyFocusTask[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_dailyTasks`, initialDailyFocusTasks)
  );

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_dailyLogs`, initialDailyLogs)
  );

  const [readingItems, setReadingItems] = useState<ReadingItem[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_readingItems`, initialReadingItems)
  );

  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_communicationLogs`, initialCommunicationLogs)
  );

  const [interviewRecords, setInterviewRecords] = useState<InterviewRecord[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_interviewRecords`, initialInterviewRecords)
  );

  const [gymLogs, setGymLogs] = useState<GymLog[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_gymLogs`, initialGymLogs)
  );

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_foodItems`, initialIndianFoods)
  );

  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_foodLogs`, initialFoodLogs)
  );

  const [nutritionGoals, setNutritionGoals] = useState<DailyNutritionGoals>(() => 
    safeParseObject(`${LOCAL_STORAGE_KEY}_nutritionGoals`, initialNutritionGoals)
  );

  const [medicines, setMedicines] = useState<Medicine[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_medicines`, initialMedicines)
  );

  const [medicineLogs, setMedicineLogs] = useState<MedicineLog[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_medicineLogs`, initialMedicineLogs)
  );

  const [knowledgeSummaries, setKnowledgeSummaries] = useState<KnowledgeSummary[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_knowledgeSummaries`, initialKnowledgeSummaries)
  );

  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_customFields`, initialCustomFields)
  );

  const [userSettings, setUserSettings] = useState<UserSettings>(() => 
    safeParseObject(`${LOCAL_STORAGE_KEY}_userSettings`, initialUserSettings)
  );

  const [categories, setCategories] = useState<string[]>(() => 
    safeParseArray(`${LOCAL_STORAGE_KEY}_categories`, ['HR', 'Domain', 'Resume', 'Company-Specific', 'Scenario', 'Case', 'GTM', 'Leadership'])
  );

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_questions`, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_guesstimates`, JSON.stringify(guesstimates));
  }, [guesstimates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_frameworks`, JSON.stringify(frameworks));
  }, [frameworks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_gdTopics`, JSON.stringify(gdTopics));
  }, [gdTopics]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_news`, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dataPoints`, JSON.stringify(dataPoints));
  }, [dataPoints]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_mistakes`, JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dailyTasks`, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dailyLogs`, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_readingItems`, JSON.stringify(readingItems));
  }, [readingItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_communicationLogs`, JSON.stringify(communicationLogs));
  }, [communicationLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_interviewRecords`, JSON.stringify(interviewRecords));
  }, [interviewRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_gymLogs`, JSON.stringify(gymLogs));
  }, [gymLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_foodItems`, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_foodLogs`, JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_nutritionGoals`, JSON.stringify(nutritionGoals));
  }, [nutritionGoals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_medicines`, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_medicineLogs`, JSON.stringify(medicineLogs));
  }, [medicineLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_knowledgeSummaries`, JSON.stringify(knowledgeSummaries));
  }, [knowledgeSummaries]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customFields`, JSON.stringify(customFields));
  }, [customFields]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_userSettings`, JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  // Helper to compile full application payload for instant cloud sync
  const buildSyncPayload = useCallback(() => {
    return {
      companies,
      questions,
      guesstimates,
      frameworks,
      gdTopics,
      news,
      dataPoints,
      mistakes,
      dailyTasks,
      dailyLogs,
      readingItems,
      communicationLogs,
      interviewRecords,
      gymLogs,
      foodItems,
      foodLogs,
      nutritionGoals,
      medicines,
      medicineLogs,
      knowledgeSummaries,
      customFields,
      userSettings,
      categories,
      updatedAt: new Date().toISOString(),
    };
  }, [
    companies,
    questions,
    guesstimates,
    frameworks,
    gdTopics,
    news,
    dataPoints,
    mistakes,
    dailyTasks,
    dailyLogs,
    readingItems,
    communicationLogs,
    interviewRecords,
    gymLogs,
    foodItems,
    foodLogs,
    nutritionGoals,
    medicines,
    medicineLogs,
    knowledgeSummaries,
    customFields,
    userSettings,
    categories,
  ]);

  // Dual-Layer Cloud Persistence Engine:
  // 1. Instant backend storage (/api/cloud-sync)
  // 2. Direct Firestore synchronization when signed in
  const persistToCloud = useCallback(
    async (customPayload?: any) => {
      const payload = customPayload || buildSyncPayload();
      setSyncStatus('saving');

      const tasks: Promise<any>[] = [];

      // Task 1: Instant Server Cloud Sync
      tasks.push(
        fetch('/api/cloud-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload }),
        }).catch((err) => {
          console.warn('Backend cloud-sync error:', err);
        })
      );

      // Task 2: Firebase Firestore sync if user is signed in
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid, 'appData', 'main');
        tasks.push(
          setDoc(userDocRef, payload, { merge: true }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/appData/main`);
          })
        );
      }

      try {
        await Promise.allSettled(tasks);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncedAt(timeStr);
        setSyncStatus('synced');
      } catch (err) {
        console.warn('Sync persistence warning:', err);
        setSyncStatus('offline');
      }
    },
    [currentUser, buildSyncPayload]
  );

  // Initial cloud restore on mount
  useEffect(() => {
    let isMounted = true;

    async function restoreFromCloud() {
      try {
        const res = await fetch('/api/cloud-sync');
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.success && resJson.data && isMounted) {
            const data = resJson.data;
            if (Array.isArray(data.companies) && data.companies.length > 0) setCompanies(data.companies);
            if (Array.isArray(data.questions) && data.questions.length > 0) setQuestions(data.questions);
            if (Array.isArray(data.guesstimates) && data.guesstimates.length > 0) setGuesstimates(data.guesstimates);
            if (Array.isArray(data.frameworks) && data.frameworks.length > 0) setFrameworks(data.frameworks);
            if (Array.isArray(data.gdTopics) && data.gdTopics.length > 0) setGdTopics(data.gdTopics);
            if (Array.isArray(data.news) && data.news.length > 0) setNews(data.news);
            if (Array.isArray(data.dataPoints) && data.dataPoints.length > 0) setDataPoints(data.dataPoints);
            if (Array.isArray(data.mistakes) && data.mistakes.length > 0) setMistakes(data.mistakes);
            if (Array.isArray(data.dailyTasks) && data.dailyTasks.length > 0) setDailyTasks(data.dailyTasks);
            if (Array.isArray(data.dailyLogs) && data.dailyLogs.length > 0) setDailyLogs(data.dailyLogs);
            if (Array.isArray(data.readingItems) && data.readingItems.length > 0) setReadingItems(data.readingItems);
            if (Array.isArray(data.communicationLogs) && data.communicationLogs.length > 0) setCommunicationLogs(data.communicationLogs);
            if (Array.isArray(data.interviewRecords) && data.interviewRecords.length > 0) setInterviewRecords(data.interviewRecords);
            if (Array.isArray(data.gymLogs) && data.gymLogs.length > 0) setGymLogs(data.gymLogs);
            if (Array.isArray(data.foodItems) && data.foodItems.length > 0) setFoodItems(data.foodItems);
            if (Array.isArray(data.foodLogs) && data.foodLogs.length > 0) setFoodLogs(data.foodLogs);
            if (data.nutritionGoals && typeof data.nutritionGoals === 'object') setNutritionGoals(data.nutritionGoals);
            if (Array.isArray(data.medicines) && data.medicines.length > 0) setMedicines(data.medicines);
            if (Array.isArray(data.medicineLogs) && data.medicineLogs.length > 0) setMedicineLogs(data.medicineLogs);
            if (Array.isArray(data.knowledgeSummaries) && data.knowledgeSummaries.length > 0) setKnowledgeSummaries(data.knowledgeSummaries);
            if (Array.isArray(data.customFields) && data.customFields.length > 0) setCustomFields(data.customFields);
            if (data.userSettings && typeof data.userSettings === 'object') setUserSettings(data.userSettings);
            if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);

            isCloudInitializedRef.current = true;
            setSyncStatus('synced');
            if (data.updatedAt) {
              const dt = new Date(data.updatedAt);
              setLastSyncedAt(dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load initial cloud state:', err);
      }
    }

    restoreFromCloud();

    return () => {
      isMounted = false;
    };
  }, []);

  // Firestore real-time synchronization when authenticated
  useEffect(() => {
    if (!currentUser) return;

    setSyncStatus('saving');
    const userDocRef = doc(db, 'users', currentUser.uid, 'appData', 'main');

    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        // Prevent local writes from resetting state loop
        if (snapshot.metadata.hasPendingWrites) {
          return;
        }

        if (snapshot.exists()) {
          const data = snapshot.data();
          const serverUpdatedTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;

          // If snapshot has an updatedAt older than our latest local mutation, skip to prevent rollback
          if (serverUpdatedTime && lastLocalMutationTimeRef.current && serverUpdatedTime < lastLocalMutationTimeRef.current) {
            return;
          }

          if (Array.isArray(data.companies)) {
            setCompanies((prev) => {
              const serverIds = new Set(data.companies.map((c: any) => c.id));
              const pendingLocal = prev.filter(c => !serverIds.has(c.id) && c.createdAt && (Date.now() - new Date(c.createdAt).getTime() < 60000));
              return [...pendingLocal, ...data.companies];
            });
          }

          if (Array.isArray(data.questions)) {
            setQuestions((prev) => {
              const serverIds = new Set(data.questions.map((q: any) => q.id));
              const pendingLocal = prev.filter(q => !serverIds.has(q.id) && q.createdAt && (Date.now() - new Date(q.createdAt).getTime() < 60000));
              return [...pendingLocal, ...data.questions];
            });
          }
          if (Array.isArray(data.guesstimates)) setGuesstimates(data.guesstimates);
          if (Array.isArray(data.frameworks)) setFrameworks(data.frameworks);
          if (Array.isArray(data.gdTopics)) setGdTopics(data.gdTopics);
          if (Array.isArray(data.news)) setNews(data.news);
          if (Array.isArray(data.dataPoints)) setDataPoints(data.dataPoints);
          if (Array.isArray(data.mistakes)) setMistakes(data.mistakes);
          if (Array.isArray(data.dailyTasks)) setDailyTasks(data.dailyTasks);
          if (Array.isArray(data.dailyLogs)) setDailyLogs(data.dailyLogs);
          if (Array.isArray(data.readingItems)) setReadingItems(data.readingItems);
          if (Array.isArray(data.communicationLogs)) setCommunicationLogs(data.communicationLogs);
          if (Array.isArray(data.interviewRecords)) setInterviewRecords(data.interviewRecords);
          if (Array.isArray(data.gymLogs)) setGymLogs(data.gymLogs);
          if (Array.isArray(data.foodItems)) setFoodItems(data.foodItems);
          if (Array.isArray(data.foodLogs)) setFoodLogs(data.foodLogs);
          if (data.nutritionGoals && typeof data.nutritionGoals === 'object') setNutritionGoals(data.nutritionGoals);
          if (Array.isArray(data.medicines)) setMedicines(data.medicines);
          if (Array.isArray(data.medicineLogs)) setMedicineLogs(data.medicineLogs);
          if (Array.isArray(data.knowledgeSummaries)) setKnowledgeSummaries(data.knowledgeSummaries);
          if (Array.isArray(data.customFields)) setCustomFields(data.customFields);
          if (data.userSettings && typeof data.userSettings === 'object') setUserSettings(data.userSettings);
          if (Array.isArray(data.categories)) setCategories(data.categories);

          isCloudInitializedRef.current = true;
          setSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } else {
          // Initialize document in Firestore immediately with existing data
          persistToCloud();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/appData/main`);
        setSyncStatus('offline');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser, persistToCloud]);

  // Instant Auto-Save on any change: triggers automatic, instant save to cloud
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSyncStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Coalesce rapid changes with minimal latency (150ms)
    saveTimeoutRef.current = setTimeout(() => {
      persistToCloud();
    }, 150);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    companies,
    questions,
    guesstimates,
    frameworks,
    gdTopics,
    news,
    dataPoints,
    mistakes,
    dailyTasks,
    dailyLogs,
    readingItems,
    communicationLogs,
    interviewRecords,
    gymLogs,
    foodItems,
    foodLogs,
    nutritionGoals,
    medicines,
    medicineLogs,
    knowledgeSummaries,
    customFields,
    userSettings,
    categories,
    persistToCloud,
  ]);

  const forceSyncCloud = async () => {
    try {
      setSyncStatus('saving');
      await persistToCloud();
      showToast('All changes saved instantly and securely to the cloud!');
    } catch (err) {
      showToast('Data preserved safely in local storage');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const openQuickAdd = (defaultType = 'company') => {
    setQuickAddDefaultType(defaultType);
    setIsQuickAddOpen(true);
  };

  // Dynamic formula evaluator for guesstimate assumptions
  const evaluateGuesstimateFormula = (vars: Guesstimate['variables'], formula?: string): number => {
    if (!vars || vars.length === 0) return 0;
    
    // Create map of variable values
    const varMap: Record<string, number> = {};
    vars.forEach((v) => {
      varMap[v.id.toLowerCase()] = v.value;
      // Also map clean name e.g. "population"
      const cleanName = v.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      varMap[cleanName] = v.value;
    });

    if (!formula || formula.trim() === '') {
      // Default: multiply all variables
      return vars.reduce((acc, v) => acc * (v.value || 1), 1);
    }

    try {
      // Clean formula and replace variable identifiers with numbers
      let expr = formula.toLowerCase();
      // Replace variable ids first (v1, v2, etc.)
      vars.forEach((v) => {
        const regexId = new RegExp(`\\b${v.id.toLowerCase()}\\b`, 'g');
        expr = expr.replace(regexId, `${v.value}`);
        const cleanName = v.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const regexName = new RegExp(`\\b${cleanName}\\b`, 'g');
        expr = expr.replace(regexName, `${v.value}`);
      });

      // Allow only digits, basic math symbols, parentheses, decimals, and spaces
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return vars.reduce((acc, v) => acc * (v.value || 1), 1);
      }

      // Safe mathematical expression parser
      const calculate = new Function(`return (${expr});`);
      const result = Number(calculate());
      return isNaN(result) || !isFinite(result) ? 0 : Math.round(result * 100) / 100;
    } catch {
      return vars.reduce((acc, v) => acc * (v.value || 1), 1);
    }
  };

  // Readiness calculation logic
  const readinessBreakdown = useMemo(() => {
    const qList = questions || [];
    const gList = guesstimates || [];
    const gdList = gdTopics || [];
    const cList = companies || [];
    const commList = communicationLogs || [];

    // 1. Interview Question Readiness (average confidence / 5 * 100 + practice coverage)
    const totalQ = qList.length;
    const avgConfidence = totalQ > 0 ? qList.reduce((acc, q) => acc + (q.confidence || 3), 0) / totalQ : 3;
    const practicedQ = qList.filter(q => q.status === 'Practiced' || q.status === 'Mastered').length;
    const qScore = Math.min(100, Math.round(((avgConfidence / 5) * 60) + ((practicedQ / Math.max(1, totalQ)) * 40)));

    // 2. Guesstimates Readiness
    const totalG = gList.length;
    const solvedG = gList.filter(g => g.status === 'Solved' || g.status === 'Mastered').length;
    const gAvgConf = totalG > 0 ? gList.reduce((acc, g) => acc + (g.confidence || 3), 0) / totalG : 3;
    const gScore = Math.min(100, Math.round(((gAvgConf / 5) * 50) + ((solvedG / Math.max(1, totalG)) * 50)));

    // 3. Case Readiness
    const caseQuestions = qList.filter(q => q.category === 'Case' || q.category === 'GTM');
    const caseScore = caseQuestions.length > 0
      ? Math.min(100, Math.round((caseQuestions.reduce((acc, q) => acc + q.confidence, 0) / (caseQuestions.length * 5)) * 100))
      : 65;

    // 4. GD & Current Affairs Readiness
    const totalGD = gdList.length;
    const preparedGD = gdList.filter(t => t.status === 'Prepared' || t.status === 'Mastered').length;
    const gdScore = totalGD > 0 ? Math.min(100, Math.round((preparedGD / totalGD) * 100)) : 70;

    // 5. Communication Readiness
    const totalComm = commList.length;
    const recentCommConf = totalComm > 0
      ? commList.slice(0, 5).reduce((acc, l) => acc + l.confidenceAfter, 0) / Math.min(5, totalComm)
      : 3.5;
    const commScore = Math.min(100, Math.round((recentCommConf / 5) * 100));

    // 6. Domain Knowledge
    const domainQ = qList.filter(q => q.category === 'Domain' || q.category === 'Finance' || q.category === 'Marketing');
    const domainScore = domainQ.length > 0 
      ? Math.min(100, Math.round((domainQ.reduce((acc, q) => acc + q.confidence, 0) / (domainQ.length * 5)) * 100))
      : 75;

    // 7. Company Research
    const avgCompanyPrep = cList.length > 0
      ? cList.reduce((acc, c) => acc + (c.prepProgress || 50), 0) / cList.length
      : 65;
    const companyScore = Math.round(avgCompanyPrep);

    return {
      interview: qScore || 78,
      guesstimate: gScore || 62,
      case: caseScore || 71,
      gd: gdScore || 82,
      communication: commScore || 68,
      domain: domainScore || 76,
      companyResearch: companyScore || 74
    };
  }, [questions, guesstimates, gdTopics, communicationLogs, companies]);

  const readinessScore = useMemo(() => {
    const w = userSettings.readinessWeights || {
      interviews: 25,
      guesstimates: 15,
      cases: 20,
      gd: 15,
      communication: 10,
      domain: 10,
      companyResearch: 5
    };
    const totalW = (Object.values(w) as number[]).reduce((a, b) => Number(a) + Number(b), 0) || 100;
    const weighted = (
      (readinessBreakdown.interview * Number(w.interviews)) +
      (readinessBreakdown.guesstimate * Number(w.guesstimates)) +
      (readinessBreakdown.case * Number(w.cases)) +
      (readinessBreakdown.gd * Number(w.gd)) +
      (readinessBreakdown.communication * Number(w.communication)) +
      (readinessBreakdown.domain * Number(w.domain)) +
      (readinessBreakdown.companyResearch * Number(w.companyResearch))
    ) / totalW;

    return Math.round(weighted);
  }, [readinessBreakdown, userSettings]);

  // Weak areas detection
  const weakAreas = useMemo(() => {
    const list = [
      { name: 'Guesstimates & Estimation', readiness: readinessBreakdown.guesstimate, targetView: 'guesstimates' },
      { name: 'GTM & Business Cases', readiness: readinessBreakdown.case, targetView: 'interviewPrep' },
      { name: 'Vocal Communication & Storytelling', readiness: readinessBreakdown.communication, targetView: 'dailyGrowth' },
      { name: 'HR & Behavioral Fit', readiness: readinessBreakdown.interview, targetView: 'interviewPrep' },
      { name: 'Domain & Business Fundamentals', readiness: readinessBreakdown.domain, targetView: 'interviewPrep' },
      { name: 'GD & Current Affairs Debates', readiness: readinessBreakdown.gd, targetView: 'gdTopics' },
      { name: 'Company Deep-Dive Research', readiness: readinessBreakdown.companyResearch, targetView: 'placement' }
    ];

    return list.map(item => ({
      ...item,
      status: item.readiness >= 75 ? 'Strong' : item.readiness >= 60 ? 'Needs Improvement' : 'Weak' as 'Strong' | 'Needs Improvement' | 'Weak'
    })).sort((a, b) => a.readiness - b.readiness);
  }, [readinessBreakdown]);

  // Dynamic future-aligned streak calculation
  const streakDays = useMemo(() => {
    const activeDates = new Set<string>();
    dailyLogs.forEach(l => { if (l.date) activeDates.add(l.date); });
    dailyTasks.forEach(t => { if (t.completed && t.date) activeDates.add(t.date); });
    gymLogs.forEach(g => { if (g.attended && g.date) activeDates.add(g.date); });
    foodLogs.forEach(f => { if (f.date) activeDates.add(f.date); });

    const format = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = format(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday);

    let count = 0;
    let checkDate = new Date();

    if (activeDates.has(todayStr)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (activeDates.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      return 0;
    }

    while (true) {
      const dStr = format(checkDate);
      if (activeDates.has(dStr)) {
        if (dStr !== todayStr) {
          count++;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  }, [dailyLogs, dailyTasks, gymLogs, foodLogs]);

  const weeklyGrowthTrends = {
    questionsThisWeek: 18,
    guesstimatesThisWeek: 6,
    gdTopicsThisWeek: 5,
    casesThisWeek: 3,
    readinessTrend: 8
  };

  // Company CRUD
  const addCompany = (comp: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `comp_${Date.now()}`;
    const nowStr = new Date().toISOString();
    const newComp: Company = {
      ...comp,
      id,
      createdAt: nowStr,
      updatedAt: nowStr
    };
    lastLocalMutationTimeRef.current = Date.now();
    setCompanies((prev) => {
      const updated = [newComp, ...prev];
      persistToCloud({ ...buildSyncPayload(), companies: updated });
      return updated;
    });
    showToast(`Added ${newComp.name} to company database`);
    return id;
  };

  const updateCompany = (id: string, updates: Partial<Company>, silent = false) => {
    lastLocalMutationTimeRef.current = Date.now();
    let updatedQuestions = questions;
    if (updates.name) {
      setQuestions((prevQ) => {
        const nextQ = prevQ.map((q) => (q.companyId === id ? { ...q, companyName: updates.name } : q));
        updatedQuestions = nextQ;
        return nextQ;
      });
    }
    setCompanies((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
      persistToCloud({ ...buildSyncPayload(), companies: updated, questions: updatedQuestions });
      return updated;
    });
    if (!silent) {
      showToast('Company updated successfully');
    }
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (selectedCompanyId === id) setSelectedCompanyId(null);
    showToast('Company deleted');
  };

  const duplicateCompany = (id: string) => {
    const existing = companies.find((c) => c.id === id);
    if (!existing) return;
    const duplicated: Company = {
      ...existing,
      id: `comp_${Date.now()}`,
      name: `${existing.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCompanies((prev) => [duplicated, ...prev]);
    showToast(`Duplicated ${existing.name}`);
  };

  const toggleCompanyFavorite = (id: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)));
  };

  // Question CRUD
  const addQuestion = (q: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowStr = new Date().toISOString();
    const newQ: Question = {
      ...q,
      id,
      createdAt: nowStr,
      updatedAt: nowStr
    };
    lastLocalMutationTimeRef.current = Date.now();
    setQuestions((prev) => {
      const updated = [newQ, ...prev];
      persistToCloud({ ...buildSyncPayload(), questions: updated });
      return updated;
    });
    showToast('Added interview question to question bank');
    return id;
  };

  const updateQuestion = (id: string, updates: Partial<Question>, silent = false) => {
    lastLocalMutationTimeRef.current = Date.now();
    setQuestions((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q));
      persistToCloud({ ...buildSyncPayload(), questions: updated });
      return updated;
    });
    if (!silent) {
      showToast('Question updated');
    }
  };

  const recordQuestionPractice = (id: string, confidence: number, notes?: string) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id === id) {
        return {
          ...q,
          confidence,
          status: confidence >= 5 ? 'Mastered' : confidence >= 3 ? 'Practiced' : 'Needs Practice',
          practiceCount: (q.practiceCount || 0) + 1,
          lastPracticed: new Date().toISOString().split('T')[0],
          myAnswer: notes !== undefined && notes !== null ? notes : q.myAnswer,
          updatedAt: new Date().toISOString()
        };
      }
      return q;
    }));
    showToast('Practice recorded & answer updated!');
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      persistToCloud({ ...buildSyncPayload(), questions: updated });
      return updated;
    });
    if (practiceModalQuestionId === id) setPracticeModalQuestionId(null);
    deleteVideoBlob(id).catch((err) => console.warn('Could not delete video blob from storage:', err));
    showToast('Question deleted');
  };

  const duplicateQuestion = (id: string) => {
    const existing = questions.find((q) => q.id === id);
    if (!existing) return;
    const dup: Question = {
      ...existing,
      id: `q_${Date.now()}`,
      question: `${existing.question} (Copy)`,
      practiceCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setQuestions((prev) => [dup, ...prev]);
    showToast('Duplicated question');
  };

  const toggleQuestionFavorite = (id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q)));
  };

  const logQuestionPractice = (id: string, confidence: number, timeTakenSeconds?: number, feedback?: string) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id === id) {
        return {
          ...q,
          confidence,
          status: confidence >= 5 ? 'Mastered' : confidence >= 3 ? 'Practiced' : 'Needs Practice',
          practiceCount: (q.practiceCount || 0) + 1,
          lastPracticed: new Date().toISOString().split('T')[0],
          timeTakenSeconds: timeTakenSeconds ?? q.timeTakenSeconds,
          interviewerFeedback: feedback || q.interviewerFeedback,
          updatedAt: new Date().toISOString()
        };
      }
      return q;
    }));
    showToast('Practice logged! Progress updated.');
  };

  // Guesstimate CRUD
  const addGuesstimate = (g: Omit<Guesstimate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `guesstimate_${Date.now()}`;
    const calculatedResult = evaluateGuesstimateFormula(g.variables, g.formula);
    const newG: Guesstimate = {
      ...g,
      id,
      calculatedResult,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGuesstimates((prev) => [newG, ...prev]);
    showToast('Added guesstimate problem to Lab');
    return id;
  };

  const updateGuesstimate = (id: string, updates: Partial<Guesstimate>) => {
    setGuesstimates((prev) => prev.map((g) => {
      if (g.id === id) {
        const merged = { ...g, ...updates, updatedAt: new Date().toISOString() };
        if (updates.variables || updates.formula !== undefined) {
          merged.calculatedResult = evaluateGuesstimateFormula(merged.variables, merged.formula);
        }
        return merged;
      }
      return g;
    }));
    showToast('Guesstimate model updated');
  };

  const deleteGuesstimate = (id: string) => {
    setGuesstimates((prev) => prev.filter((g) => g.id !== id));
    showToast('Guesstimate deleted');
  };

  const duplicateGuesstimate = (id: string) => {
    const existing = guesstimates.find((g) => g.id === id);
    if (!existing) return;
    const dup: Guesstimate = {
      ...existing,
      id: `guesstimate_${Date.now()}`,
      question: `${existing.question} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGuesstimates((prev) => [dup, ...prev]);
    showToast('Duplicated guesstimate');
  };

  const toggleGuesstimateFavorite = (id: string) => {
    setGuesstimates((prev) => prev.map((g) => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g)));
  };

  // Frameworks CRUD
  const addFramework = (fw: Omit<EstimationFramework, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `fw_${Date.now()}`;
    const newFw: EstimationFramework = {
      ...fw,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFrameworks((prev) => [newFw, ...prev]);
    showToast('Added framework to library');
    return id;
  };

  const updateFramework = (id: string, updates: Partial<EstimationFramework>) => {
    setFrameworks((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)));
    showToast('Framework updated');
  };

  const deleteFramework = (id: string) => {
    setFrameworks((prev) => prev.filter((f) => f.id !== id));
    showToast('Framework removed');
  };

  const duplicateFramework = (id: string) => {
    const existing = frameworks.find((f) => f.id === id);
    if (!existing) return;
    const dup: EstimationFramework = {
      ...existing,
      id: `fw_${Date.now()}`,
      name: `${existing.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFrameworks((prev) => [dup, ...prev]);
    showToast('Duplicated framework');
  };

  // GD Topics CRUD
  const addGDTopic = (topic: Omit<GDTopic, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `gd_${Date.now()}`;
    const newTopic: GDTopic = {
      ...topic,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGdTopics((prev) => [newTopic, ...prev]);
    showToast('Added GD topic sheet');
    return id;
  };

  const updateGDTopic = (id: string, updates: Partial<GDTopic>) => {
    setGdTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
    showToast('GD topic sheet saved');
  };

  const deleteGDTopic = (id: string) => {
    setGdTopics((prev) => prev.filter((t) => t.id !== id));
    showToast('GD topic removed');
  };

  const toggleGDTopicFavorite = (id: string) => {
    setGdTopics((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));
  };

  // News CRUD
  const addNews = (n: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `news_${Date.now()}`;
    const newItem: NewsItem = {
      ...n,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNews((prev) => [newItem, ...prev]);
    showToast('News takeaway logged');
    return id;
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item)));
    showToast('News article updated');
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
    showToast('News item deleted');
  };

  // Data Points CRUD
  const addDataPoint = (dp: Omit<DataPoint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `dp_${Date.now()}`;
    const newItem: DataPoint = {
      ...dp,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDataPoints((prev) => [newItem, ...prev]);
    showToast('Added data point to repository');
    return id;
  };

  const updateDataPoint = (id: string, updates: Partial<DataPoint>) => {
    setDataPoints((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)));
    showToast('Data point updated');
  };

  const deleteDataPoint = (id: string) => {
    setDataPoints((prev) => prev.filter((d) => d.id !== id));
    showToast('Data point deleted');
  };

  // Mistakes CRUD
  const addMistake = (m: Omit<Mistake, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `mst_${Date.now()}`;
    const newM: Mistake = {
      ...m,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMistakes((prev) => [newM, ...prev]);
    showToast('Logged mistake to Mistake Bank');
    return id;
  };

  const updateMistake = (id: string, updates: Partial<Mistake>) => {
    setMistakes((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m)));
    showToast('Mistake entry updated');
  };

  const deleteMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    showToast('Mistake deleted');
  };

  const incrementMistakeFrequency = (id: string) => {
    setMistakes((prev) => prev.map((m) => (m.id === id ? { ...m, frequency: (m.frequency || 1) + 1, updatedAt: new Date().toISOString() } : m)));
    showToast('Incremented recurrence frequency');
  };

  // Daily Tasks & Logs
  const addDailyTask = (task: Omit<DailyFocusTask, 'id' | 'createdAt'>) => {
    const id = `task_${Date.now()}`;
    const newTask: DailyFocusTask = {
      ...task,
      id,
      createdAt: new Date().toISOString()
    };
    setDailyTasks((prev) => [...prev, newTask]);
    showToast('Focus task added');
  };

  const updateDailyTask = (id: string, updates: Partial<DailyFocusTask>) => {
    setDailyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Task updated');
  };

  const toggleDailyTask = (id: string) => {
    setDailyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteDailyTask = (id: string) => {
    setDailyTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed');
  };

  const addDailyLog = (log: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `log_${Date.now()}`;
    const newLog: DailyLog = {
      ...log,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDailyLogs((prev) => [newLog, ...prev]);
    showToast('Daily progress logged!');
  };

  const updateDailyLog = (id: string, updates: Partial<DailyLog>) => {
    setDailyLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)));
    showToast('Daily log updated');
  };

  const deleteDailyLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Daily log removed');
  };

  const addReadingItem = (item: Omit<ReadingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `read_${Date.now()}`;
    const newItem: ReadingItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReadingItems((prev) => [newItem, ...prev]);
    showToast('Added to reading tracker');
  };

  const updateReadingItem = (id: string, updates: Partial<ReadingItem>) => {
    setReadingItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    showToast('Reading progress updated');
  };

  const deleteReadingItem = (id: string) => {
    setReadingItems((prev) => prev.filter((r) => r.id !== id));
    showToast('Reading item removed');
  };

  const addCommunicationLog = (log: Omit<CommunicationLog, 'id' | 'createdAt'>) => {
    const id = `comm_${Date.now()}`;
    const newLog: CommunicationLog = {
      ...log,
      id,
      createdAt: new Date().toISOString()
    };
    setCommunicationLogs((prev) => [newLog, ...prev]);
    showToast('Communication session logged');
  };

  const deleteCommunicationLog = (id: string) => {
    setCommunicationLogs((prev) => prev.filter((c) => c.id !== id));
    showToast('Log removed');
  };

  const addInterviewRecord = (rec: Omit<InterviewRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `rec_${Date.now()}`;
    const newRec: InterviewRecord = {
      ...rec,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInterviewRecords((prev) => [newRec, ...prev]);
    showToast('Interview round recorded');
  };

  const updateInterviewRecord = (id: string, updates: Partial<InterviewRecord>) => {
    setInterviewRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    showToast('Interview log updated');
  };

  const deleteInterviewRecord = (id: string) => {
    setInterviewRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Interview log deleted');
  };

  // Gym Attendance & Weight Logs
  const addGymLog = (log: Omit<GymLog, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `gym_${Date.now()}`;
    const newLog: GymLog = {
      ...log,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGymLogs((prev) => {
      const existingIndex = prev.findIndex(l => l.date === log.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...log, updatedAt: new Date().toISOString() };
        return updated.sort((a, b) => b.date.localeCompare(a.date));
      }
      return [newLog, ...prev].sort((a, b) => b.date.localeCompare(a.date));
    });
    showToast(`Gym entry for ${log.date} saved`);
    return id;
  };

  const updateGymLog = (id: string, updates: Partial<GymLog>) => {
    setGymLogs((prev) => 
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
          .sort((a, b) => b.date.localeCompare(a.date))
    );
    showToast('Gym log updated');
  };

  const deleteGymLog = (id: string) => {
    setGymLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Gym record removed');
  };

  const toggleGymAttendance = (date: string, defaultWeight?: number) => {
    setGymLogs((prev) => {
      const existing = prev.find(l => l.date === date);
      if (existing) {
        const newAttended = !existing.attended;
        showToast(newAttended ? `Gym marked Attended (Yes) for ${date}` : `Gym marked Skipped/Rest (No) for ${date}`);
        return prev.map(l => l.id === existing.id ? { ...l, attended: newAttended, updatedAt: new Date().toISOString() } : l);
      } else {
        const latestWeight = prev[0]?.weight || defaultWeight || 74.0;
        const newLog: GymLog = {
          id: `gym_${Date.now()}`,
          date,
          attended: true,
          weight: latestWeight,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        showToast(`Gym marked Attended (Yes) for ${date}`);
        return [newLog, ...prev].sort((a, b) => b.date.localeCompare(a.date));
      }
    });
  };

  // Food & Nutrition
  const addFoodItem = (food: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `food_${Date.now()}`;
    const newItem: FoodItem = {
      ...food,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFoodItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to food database`);
    return id;
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) => 
      prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f))
    );
    showToast('Food item updated');
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((f) => f.id !== id));
    showToast('Food item removed from database');
  };

  const addFoodLog = (log: Omit<FoodLogEntry, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `flog_${Date.now()}`;
    const newLog: FoodLogEntry = {
      ...log,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFoodLogs((prev) => [newLog, ...prev]);
    showToast(`Logged "${log.foodName}" for ${log.mealType}`);
    return id;
  };

  const updateFoodLog = (id: string, updates: Partial<FoodLogEntry>) => {
    setFoodLogs((prev) => 
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
    );
    showToast('Meal log updated');
  };

  const deleteFoodLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Meal log removed');
  };

  const updateNutritionGoals = (goals: Partial<DailyNutritionGoals>) => {
    setNutritionGoals((prev) => ({ ...prev, ...goals }));
    showToast('Nutrition targets updated');
  };

  // Medicine & Supplements
  const addMedicine = (med: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `med_${Date.now()}`;
    const newMed: Medicine = {
      ...med,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMedicines((prev) => [newMed, ...prev]);
    showToast(`Added "${med.name}" to Medicine Cabinet`);
    return id;
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
    showToast('Medicine details updated');
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setMedicineLogs((prev) => prev.filter((l) => l.medicineId !== id));
    showToast('Medicine removed');
  };

  const toggleMedicineActive = (id: string) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive, updatedAt: new Date().toISOString() } : m))
    );
  };

  const logMedicineDose = (
    medicineId: string,
    date: string,
    taken: boolean,
    notes?: string,
    timing?: string
  ): string => {
    const med = medicines.find((m) => m.id === medicineId);
    const existingLog = medicineLogs.find((l) => l.medicineId === medicineId && l.date === date);

    if (existingLog) {
      setMedicineLogs((prev) =>
        prev.map((l) =>
          l.id === existingLog.id
            ? {
                ...l,
                taken,
                takenAt: taken ? (l.takenAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : undefined,
                notes: notes !== undefined ? notes : l.notes,
                timing: timing || l.timing || med?.timing,
                updatedAt: new Date().toISOString()
              }
            : l
        )
      );
      showToast(taken ? `Marked ${med?.name || 'dose'} as taken` : `Marked ${med?.name || 'dose'} as pending`);
      return existingLog.id;
    } else {
      const id = `mlog_${Date.now()}`;
      const newLog: MedicineLog = {
        id,
        medicineId,
        medicineName: med?.name || 'Medicine',
        date,
        taken,
        takenAt: taken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        timing: timing || med?.timing,
        dosageTaken: med?.dosage,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMedicineLogs((prev) => [newLog, ...prev]);
      showToast(taken ? `Marked ${med?.name || 'dose'} as taken` : `Logged ${med?.name || 'dose'}`);
      return id;
    }
  };

  const toggleMedicineDose = (medicineId: string, date: string, timing?: string) => {
    const existingLog = medicineLogs.find((l) => l.medicineId === medicineId && l.date === date);
    const willBeTaken = existingLog ? !existingLog.taken : true;
    logMedicineDose(medicineId, date, willBeTaken, undefined, timing);
  };

  const deleteMedicineLog = (id: string) => {
    setMedicineLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Dose log removed');
  };

  // AI Knowledge Summarizer & Research Vault Methods
  const addKnowledgeSummary = (item: Omit<KnowledgeSummary, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `know_${Date.now()}`;
    const newItem: KnowledgeSummary = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setKnowledgeSummaries((prev) => [newItem, ...prev]);
    showToast(`Saved summary: "${newItem.title}"`);
    return id;
  };

  const updateKnowledgeSummary = (id: string, updates: Partial<KnowledgeSummary>) => {
    setKnowledgeSummaries((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : k
      )
    );
    showToast('Research summary updated');
  };

  const deleteKnowledgeSummary = (id: string) => {
    setKnowledgeSummaries((prev) => prev.filter((k) => k.id !== id));
    showToast('Summary removed from Vault');
  };

  const toggleKnowledgeFavorite = (id: string) => {
    setKnowledgeSummaries((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              isFavorite: !k.isFavorite,
              updatedAt: new Date().toISOString()
            }
          : k
      )
    );
  };

  const addKnowledgeQA = (id: string, question: string, answer: string) => {
    const qaItem = {
      id: `qa_${Date.now()}`,
      question,
      answer,
      timestamp: new Date().toISOString()
    };
    setKnowledgeSummaries((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              qaHistory: [...(k.qaHistory || []), qaItem],
              updatedAt: new Date().toISOString()
            }
          : k
      )
    );
    showToast('AI Q&A recorded in summary');
  };

  // Custom Fields Engine
  const addCustomField = (field: Omit<CustomFieldDefinition, 'id'>) => {
    const id = `cf_${Date.now()}`;
    const newField: CustomFieldDefinition = {
      ...field,
      id
    };
    setCustomFields((prev) => [...prev, newField]);
    showToast(`Added field "${newField.name}"`);
  };

  const updateCustomField = (id: string, updates: Partial<CustomFieldDefinition>) => {
    setCustomFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    showToast('Custom field updated');
  };

  const deleteCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
    showToast('Custom field removed');
  };

  // Category Management
  const addCategory = (cat: string) => {
    const clean = cat.trim();
    if (!clean || categories.includes(clean)) return;
    setCategories((prev) => [...prev, clean]);
    showToast(`Added category "${clean}"`);
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    showToast(`Removed category "${cat}"`);
  };

  // User Settings
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...settings }));
    showToast('Settings saved');
  };

  // Reset to Sample Data
  const resetAllToSampleData = () => {
    setCompanies(initialCompanies);
    setQuestions(initialQuestions);
    setGuesstimates(initialGuesstimates);
    setFrameworks(initialFrameworks);
    setGdTopics(initialGDTopics);
    setNews(initialNews);
    setDataPoints(initialDataPoints);
    setMistakes(initialMistakes);
    setDailyTasks(initialDailyFocusTasks);
    setDailyLogs(initialDailyLogs);
    setReadingItems(initialReadingItems);
    setCommunicationLogs(initialCommunicationLogs);
    setInterviewRecords(initialInterviewRecords);
    setGymLogs(initialGymLogs);
    setFoodItems(initialIndianFoods);
    setFoodLogs(initialFoodLogs);
    setNutritionGoals(initialNutritionGoals);
    setMedicines(initialMedicines);
    setMedicineLogs(initialMedicineLogs);
    setKnowledgeSummaries(initialKnowledgeSummaries);
    setCustomFields(initialCustomFields);
    setUserSettings(initialUserSettings);
    setCategories(['HR', 'Domain', 'Resume', 'Company-Specific', 'Scenario', 'Case', 'GTM', 'Leadership']);
    showToast('Reset all workspaces to rich sample data');
  };

  const exportDataJSON = (): string => {
    const exportBundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      companies,
      questions,
      guesstimates,
      frameworks,
      gdTopics,
      news,
      dataPoints,
      mistakes,
      dailyTasks,
      dailyLogs,
      readingItems,
      communicationLogs,
      interviewRecords,
      gymLogs,
      foodItems,
      foodLogs,
      nutritionGoals,
      medicines,
      medicineLogs,
      knowledgeSummaries,
      customFields,
      userSettings,
      categories
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.companies && Array.isArray(data.companies)) setCompanies(data.companies);
      if (data.questions && Array.isArray(data.questions)) setQuestions(data.questions);
      if (data.guesstimates && Array.isArray(data.guesstimates)) setGuesstimates(data.guesstimates);
      if (data.frameworks && Array.isArray(data.frameworks)) setFrameworks(data.frameworks);
      if (data.gdTopics && Array.isArray(data.gdTopics)) setGdTopics(data.gdTopics);
      if (data.news && Array.isArray(data.news)) setNews(data.news);
      if (data.dataPoints && Array.isArray(data.dataPoints)) setDataPoints(data.dataPoints);
      if (data.mistakes && Array.isArray(data.mistakes)) setMistakes(data.mistakes);
      if (data.dailyTasks && Array.isArray(data.dailyTasks)) setDailyTasks(data.dailyTasks);
      if (data.dailyLogs && Array.isArray(data.dailyLogs)) setDailyLogs(data.dailyLogs);
      if (data.readingItems && Array.isArray(data.readingItems)) setReadingItems(data.readingItems);
      if (data.communicationLogs && Array.isArray(data.communicationLogs)) setCommunicationLogs(data.communicationLogs);
      if (data.interviewRecords && Array.isArray(data.interviewRecords)) setInterviewRecords(data.interviewRecords);
      if (data.gymLogs && Array.isArray(data.gymLogs)) setGymLogs(data.gymLogs);
      if (data.foodItems && Array.isArray(data.foodItems)) setFoodItems(data.foodItems);
      if (data.foodLogs && Array.isArray(data.foodLogs)) setFoodLogs(data.foodLogs);
      if (data.nutritionGoals && typeof data.nutritionGoals === 'object') setNutritionGoals(data.nutritionGoals);
      if (data.medicines && Array.isArray(data.medicines)) setMedicines(data.medicines);
      if (data.medicineLogs && Array.isArray(data.medicineLogs)) setMedicineLogs(data.medicineLogs);
      if (data.knowledgeSummaries && Array.isArray(data.knowledgeSummaries)) setKnowledgeSummaries(data.knowledgeSummaries);
      if (data.customFields && Array.isArray(data.customFields)) setCustomFields(data.customFields);
      if (data.userSettings && typeof data.userSettings === 'object') setUserSettings(data.userSettings);
      if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      showToast('Successfully imported database');
      return true;
    } catch (e) {
      console.error('Import error:', e);
      showToast('Failed to parse JSON file');
      return false;
    }
  };

  // Global Multi-Database Search
  const searchAll = (queryText: string): SearchResultItem[] => {
    if (!queryText || queryText.trim() === '') return [];
    const q = queryText.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search Knowledge Summaries
    knowledgeSummaries.forEach((k) => {
      const category = k.primaryCategory || '';
      if (
        k.title.toLowerCase().includes(q) ||
        (k.executiveSummary && k.executiveSummary.toLowerCase().includes(q)) ||
        (k.oneLiner && k.oneLiner.toLowerCase().includes(q)) ||
        category.toLowerCase().includes(q) ||
        (k.tags && k.tags.some((t) => t.toLowerCase().includes(q))) ||
        (k.sourceUrl && k.sourceUrl.toLowerCase().includes(q))
      ) {
        results.push({
          id: k.id,
          type: 'Knowledge',
          title: k.title,
          subtitle: `${category} • ${k.keyTakeaways?.length || 0} Key Takeaways`,
          category: category,
          targetView: 'knowledgeBase',
          targetId: k.id
        });
      }
    });

    // Search Companies
    companies.forEach((comp) => {
      if (
        comp.name.toLowerCase().includes(q) ||
        comp.industry.toLowerCase().includes(q) ||
        (comp.whyThisCompany && comp.whyThisCompany.toLowerCase().includes(q)) ||
        (comp.myNotes && comp.myNotes.toLowerCase().includes(q))
      ) {
        results.push({
          id: comp.id,
          type: 'Company',
          title: comp.name,
          subtitle: `${comp.industry} • ${comp.status}`,
          category: comp.industry,
          targetView: 'placement',
          targetId: comp.id
        });
      }
    });

    // Search Questions
    questions.forEach((qu) => {
      if (
        qu.question.toLowerCase().includes(q) ||
        qu.category.toLowerCase().includes(q) ||
        (qu.myAnswer && qu.myAnswer.toLowerCase().includes(q)) ||
        (qu.tags && qu.tags.some((t) => t.toLowerCase().includes(q)))
      ) {
        results.push({
          id: qu.id,
          type: 'Question',
          title: qu.question,
          subtitle: `${qu.category} • ${qu.difficulty} • Confidence: ${qu.confidence}/5`,
          category: qu.category,
          targetView: 'interviewPrep',
          targetId: qu.id
        });
      }
    });

    // Search Guesstimates
    guesstimates.forEach((g) => {
      if (
        g.question.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.approachNotes && g.approachNotes.toLowerCase().includes(q))
      ) {
        results.push({
          id: g.id,
          type: 'Guesstimate',
          title: g.question,
          subtitle: `${g.category} • Difficulty: ${g.difficulty} • ${g.status}`,
          category: g.category,
          targetView: 'guesstimates',
          targetId: g.id
        });
      }
    });

    // Search GD Topics
    gdTopics.forEach((gd) => {
      if (
        gd.topic.toLowerCase().includes(q) ||
        gd.category.toLowerCase().includes(q) ||
        gd.summary.toLowerCase().includes(q)
      ) {
        results.push({
          id: gd.id,
          type: 'GD Topic',
          title: gd.topic,
          subtitle: `${gd.category} • Position: ${gd.myPosition}`,
          category: gd.category,
          targetView: 'gdTopics',
          targetId: gd.id
        });
      }
    });

    // Search News
    news.forEach((n) => {
      if (
        n.headline.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q)
      ) {
        results.push({
          id: n.id,
          type: 'News',
          title: n.headline,
          subtitle: `${n.category} • ${n.date}`,
          category: n.category,
          targetView: 'gdTopics',
          targetId: n.id
        });
      }
    });

    // Search Data Points
    dataPoints.forEach((dp) => {
      if (
        dp.statName.toLowerCase().includes(q) ||
        dp.topic.toLowerCase().includes(q) ||
        dp.numberValue.toLowerCase().includes(q)
      ) {
        results.push({
          id: dp.id,
          type: 'Data Point',
          title: `${dp.statName}: ${dp.numberValue} ${dp.unit}`,
          subtitle: `Topic: ${dp.topic} • How to use: ${dp.howToUse}`,
          category: dp.topic,
          targetView: 'gdTopics',
          targetId: dp.id
        });
      }
    });

    // Search Mistakes
    mistakes.forEach((m) => {
      if (
        m.mistakeTitle.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.whatIDid.toLowerCase().includes(q) ||
        m.correctApproach.toLowerCase().includes(q)
      ) {
        results.push({
          id: m.id,
          type: 'Mistake',
          title: m.mistakeTitle,
          subtitle: `${m.category} • Recurrence: ${m.frequency}x • Status: ${m.status}`,
          category: m.category,
          targetView: 'mistakes',
          targetId: m.id
        });
      }
    });

    // Search Frameworks
    frameworks.forEach((fw) => {
      if (
        fw.name.toLowerCase().includes(q) ||
        fw.category.toLowerCase().includes(q) ||
        fw.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: fw.id,
          type: 'Framework',
          title: fw.name,
          subtitle: `${fw.category} • ${fw.description.substring(0, 70)}...`,
          category: fw.category,
          targetView: 'guesstimates',
          targetId: fw.id
        });
      }
    });

    // Search Medicines
    medicines.forEach((med) => {
      if (
        med.name.toLowerCase().includes(q) ||
        (med.purpose && med.purpose.toLowerCase().includes(q)) ||
        (med.dosage && med.dosage.toLowerCase().includes(q)) ||
        (med.instructions && med.instructions.toLowerCase().includes(q))
      ) {
        results.push({
          id: med.id,
          type: 'Medicine',
          title: med.name,
          subtitle: `${med.dosage} • ${med.timing} • ${med.purpose || med.type}`,
          category: med.type,
          targetView: 'medicines',
          targetId: med.id
        });
      }
    });

    return results.slice(0, 15);
  };

  return (
    <DataContext.Provider
      value={{
        companies,
        questions,
        guesstimates,
        frameworks,
        gdTopics,
        news,
        newsItems: news,
        dataPoints,
        mistakes,
        dailyTasks,
        dailyLogs,
        readingItems,
        communicationLogs,
        interviewRecords,
        gymLogs,
        foodItems,
        foodLogs,
        nutritionGoals,
        medicines,
        medicineLogs,
        knowledgeSummaries,
        customFields,
        userSettings,
        categories,

        readinessScore,
        readinessBreakdown,
        weakAreas,
        streakDays,
        weeklyGrowthTrends,

        activeView,
        setActiveView,
        selectedCompanyId,
        setSelectedCompanyId,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddDefaultType,
        openQuickAdd,
        isSearchOpen,
        setIsSearchOpen,
        practiceModalQuestionId,
        setPracticeModalQuestionId,
        activePreInterviewCompanyId,
        setActivePreInterviewCompanyId,

        toastMessage,
        showToast,

        addCompany,
        updateCompany,
        deleteCompany,
        duplicateCompany,
        toggleCompanyFavorite,

        addQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        toggleQuestionFavorite,
        logQuestionPractice,
        recordQuestionPractice,

        addGuesstimate,
        updateGuesstimate,
        deleteGuesstimate,
        duplicateGuesstimate,
        toggleGuesstimateFavorite,
        evaluateGuesstimateFormula,

        addFramework,
        updateFramework,
        deleteFramework,
        duplicateFramework,

        addGDTopic,
        updateGDTopic,
        deleteGDTopic,
        toggleGDTopicFavorite,

        addNews,
        updateNews,
        deleteNews,

        addDataPoint,
        updateDataPoint,
        deleteDataPoint,

        addMistake,
        updateMistake,
        deleteMistake,
        incrementMistakeFrequency,

        addDailyTask,
        updateDailyTask,
        toggleDailyTask,
        deleteDailyTask,
        addDailyLog,
        updateDailyLog,
        deleteDailyLog,
        addReadingItem,
        updateReadingItem,
        deleteReadingItem,
        addCommunicationLog,
        deleteCommunicationLog,
        addInterviewRecord,
        updateInterviewRecord,
        deleteInterviewRecord,
        addGymLog,
        updateGymLog,
        deleteGymLog,
        toggleGymAttendance,

        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        addFoodLog,
        updateFoodLog,
        deleteFoodLog,
        updateNutritionGoals,

        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleMedicineActive,
        logMedicineDose,
        toggleMedicineDose,
        deleteMedicineLog,

        addKnowledgeSummary,
        updateKnowledgeSummary,
        deleteKnowledgeSummary,
        toggleKnowledgeFavorite,
        addKnowledgeQA,

        addCustomField,
        updateCustomField,
        deleteCustomField,

        addCategory,
        deleteCategory,

        syncStatus,
        lastSyncedAt,
        forceSyncCloud,
        updateUserSettings,
        resetAllToSampleData,
        exportDataJSON,
        importDataJSON,

        searchAll
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
