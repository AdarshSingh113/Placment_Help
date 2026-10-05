export type CustomFieldType = 
  | 'text' 
  | 'long_text' 
  | 'number' 
  | 'percentage' 
  | 'date' 
  | 'url' 
  | 'dropdown' 
  | 'multi_select' 
  | 'checkbox' 
  | 'rating' 
  | 'tags' 
  | 'rich_text';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: CustomFieldType;
  required?: boolean;
  options?: string[]; // For dropdown/multi-select
  placeholder?: string;
  entityType: 'company' | 'question' | 'gdTopic' | 'guesstimate' | 'mistake';
}

export type CustomFieldValues = Record<string, any>;

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  logo?: string;
  status: 'Target' | 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Archived';
  prepProgress: number; // 0-100
  interviewDate?: string; // ISO date string
  role?: string;
  vision?: string;
  mission?: string;
  values?: string[];
  businessModel?: string;
  productsServices?: string;
  targetCustomers?: string;
  revenueModel?: string;
  keyCompetitors?: string[];
  marketPosition?: string;
  recentNews?: string;
  whyThisCompany?: string;
  whyThisRole?: string;
  attractions?: string;
  concerns?: string;
  differentiators?: string;
  recentDevelopments?: string;
  importantMetrics?: string;
  myNotes?: string;
  whyThisCompanyPitch?: string;
  keyQuestionsTalkingPoints?: string;
  questionsForPartner?: string;
  preInterviewAnswers?: Record<string, string>;
  isFavorite?: boolean;
  customFields?: CustomFieldValues;
  createdAt: string;
  updatedAt: string;
}

export type QuestionCategory = 
  | 'HR' 
  | 'Domain' 
  | 'Resume' 
  | 'Company-Specific' 
  | 'Scenario' 
  | 'Case' 
  | 'GTM' 
  | 'Leadership'
  | string;

export interface Question {
  id: string;
  question: string;
  category: QuestionCategory;
  subcategory?: string;
  companyId?: string;
  companyName?: string;
  role?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Not Practiced' | 'Needs Practice' | 'Practiced' | 'Mastered';
  confidence: number; // 1 to 5
  lastPracticed?: string;
  practiceCount: number;
  timeTakenSeconds?: number;
  
  // Structured Answers
  myAnswer?: string;
  improvedAnswer?: string;
  interviewerFeedback?: string;
  whatToImprove?: string;
  keyPoints?: string[];
  myMistake?: string;

  // Audio Answer Recording
  audioAnswerUrl?: string;
  audioAnswerDuration?: number;
  audioRecordedAt?: string;

  // Video Answer Recording (Webcam Spoken Mock)
  hasVideoAnswer?: boolean;
  videoAnswerUrl?: string;
  videoAnswerDuration?: number;
  videoRecordedAt?: string;
  
  isFavorite?: boolean;
  customFields?: CustomFieldValues;
  createdAt: string;
  updatedAt: string;
}

export interface AssumptionVariable {
  id: string;
  name: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface Guesstimate {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  industry?: string;
  frameworkId?: string;
  frameworkName?: string;
  
  // Dynamic calculation model
  variables: AssumptionVariable[];
  formula?: string; // e.g. "Population * Coffee_Consumers * Cups_Per_Day * Purchased_Outside"
  calculatedResult?: number;
  resultUnit?: string;
  
  approachNotes: string;
  keyAssumptions: string[];
  mistakesIdentified?: string;
  
  finalAnswerText?: string;
  confidence: number; // 1 to 5
  timeTakenSeconds?: number;
  practiceCount: number;
  status: 'Not Started' | 'In Progress' | 'Solved' | 'Mastered';
  lastPracticed?: string;
  
  isFavorite?: boolean;
  customFields?: CustomFieldValues;
  createdAt: string;
  updatedAt: string;
}

export interface EstimationFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: string[];
  exampleUseCases: string[];
  formulaTemplate?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GDTopic {
  id: string;
  topic: string;
  category: string;
  dateAdded: string;
  source?: string;
  sourceUrl?: string;
  summary: string;
  myPosition: 'For' | 'Against' | 'Neutral / Balanced';
  argumentsFor: string[];
  argumentsAgainst: string[];
  examples: string[];
  dataPoints: string[];
  openingStatement?: string;
  counterpoints?: string[];
  conclusion?: string;
  potentialQuestions?: string[];
  status: 'To Read' | 'In Progress' | 'Prepared' | 'Mastered';
  confidence: number; // 1 to 5
  isFavorite?: boolean;
  customFields?: CustomFieldValues;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  sourceLink?: string;
  sourceName?: string;
  date: string;
  category: string;
  keyTakeaways: string[];
  whyItMatters: string;
  gdRelevance: string;
  potentialInterviewQuestion?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DataPoint {
  id: string;
  statName: string;
  numberValue: string;
  unit: string;
  topic: string;
  source?: string;
  sourceUrl?: string;
  date: string;
  context: string;
  howToUse: string; // e.g. "GD / Interview / Case"
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyFocusTask {
  id: string;
  title: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  targetMinutes?: number;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutesSpent?: number;
  hoursSpent?: number;
  mood?: string;
  notes?: string;
  activities?: string[];
  keyTakeaways?: string[];
  tomorrowFocus?: string;
  accomplished?: string;
  learned?: string;
  struggledWith?: string;
  tomorrowImprovement?: string;
  activitiesCompleted?: {
    category: string;
    description: string;
    minutes: number;
  }[];
  scoreOutOf10?: number; // Calculated or self-assessed
  createdAt?: string;
  updatedAt?: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  type: 'Book' | 'Article' | 'Case Study' | 'Report';
  totalPages?: number;
  pagesRead?: number;
  progressPercent: number;
  timeSpentMinutes: number;
  keyLearnings: string;
  notes: string;
  status: 'Want to Read' | 'Reading' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationLog {
  id: string;
  date: string;
  activityType: 'Speaking Practice' | 'Reading Aloud' | 'Mock Interview' | 'Presentation Practice' | 'Vocabulary' | 'English Fluency' | 'Storytelling';
  durationMinutes: number;
  confidenceBefore: number; // 1 to 5
  confidenceAfter: number; // 1 to 5
  notes: string;
  createdAt: string;
}

export interface Mistake {
  id: string;
  mistakeTitle: string;
  category: 'Interview' | 'Guesstimate' | 'Case' | 'GTM' | 'GD' | 'Communication' | 'Domain' | 'Knowledge' | string;
  relatedQuestionOrCase?: string;
  whatIDid: string;
  whatIShouldHaveDone?: string;
  correctApproach: string;
  whyIMadeIt?: string;
  howToAvoid: string;
  frequency: number;
  status: 'New' | 'Under Review' | 'Resolved' | 'Recurring' | 'Review' | 'Improving' | 'Fixed' | string;
  date: string;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type InterviewQuestion = Question;
export type GuesstimateVariable = AssumptionVariable;
export type MistakeItem = Mistake;


export interface InterviewRecord {
  id: string;
  companyId?: string;
  companyName: string;
  role: string;
  date: string;
  round: string; // e.g. "Round 1 - Technical/Case", "Round 2 - HR & Partner"
  performanceRating: number; // 1 to 5
  questionsAsked: string[];
  whatWentWell: string;
  whatWentWrong: string;
  interviewerFeedback: string;
  confidence: number;
  result: 'Pending' | 'Cleared' | 'Waitlisted' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface GymLog {
  id: string;
  date: string; // YYYY-MM-DD
  attended: boolean; // Yes or No
  weight: number; // Daily weight in kg
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  servingUnit: string;
  calories: number; // in kcal
  protein: number;  // in grams
  carbs: number;    // in grams
  fat: number;      // in grams
  fiber: number;    // in grams
  dietaryType?: 'Veg' | 'Non-Veg' | 'Vegan' | 'Egg' | string;
  isCustom?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface FoodLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodItemId?: string;
  foodName: string;
  category?: string;
  servingUnit: string;
  servings?: number; // multiplier e.g. 1, 1.5, 2
  servingQuantity?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyNutritionGoals {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
}

export type MedicineFrequency = 'Daily' | 'Twice Daily' | 'Weekly' | 'As Needed' | 'Alternate Days' | string;
export type MedicineTiming = 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Anytime' | string;
export type MedicineType = 'Topical Solution' | 'Tablet / Pill' | 'Capsule' | 'Syrup' | 'Drops' | 'Spray' | 'Injection' | 'Powder / Supplement' | 'Other' | string;

export interface Medicine {
  id: string;
  name: string;
  dosage: string; // e.g. "1 ml (5%)", "1 Tablet", "500 mg"
  frequency: MedicineFrequency;
  timing: MedicineTiming;
  type: MedicineType;
  instructions?: string;
  purpose?: string; // e.g. "Hair Growth & Follicle Density", "Immunity", "Joint Health"
  reminderTime?: string; // e.g. "22:30"
  isActive: boolean;
  color?: string; // e.g. "emerald", "blue", "purple", "amber", "rose"
  startDate?: string;
  isFavorite?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  medicineName: string;
  date: string; // YYYY-MM-DD
  taken: boolean;
  takenAt?: string; // e.g. "22:45" or ISO string
  timing?: string;
  dosageTaken?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userName: string;
  targetBatch: string;
  targetRoles: string[];
  theme: 'dark' | 'light' | 'system';
  accentColor: string; // hex or name
  dailyTargetMinutes: number;
  dailyQuestionsTarget: number;
  dailyGuesstimatesTarget: number;
  sidebarCollapsed: boolean;
  readinessWeights: {
    interviews: number;
    guesstimates: number;
    cases: number;
    gd: number;
    communication: number;
    domain: number;
    companyResearch: number;
  };
}

export type KnowledgeCategory = 
  | 'Finance & Markets' 
  | 'Marketing & Growth' 
  | 'Artificial Intelligence & Tech' 
  | 'General Knowledge & Current Affairs' 
  | 'Strategy & Consulting' 
  | 'Product Management' 
  | 'Economics & Policy' 
  | 'Leadership & Operations'
  | string;

export type KnowledgeInputType = 'topic' | 'url' | 'document' | 'text';

export interface KnowledgeCoreConcept {
  concept: string;
  explanation: string;
}

export interface KnowledgeQAItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface KnowledgeSummary {
  id: string;
  title: string;
  inputType: KnowledgeInputType;
  sourceUrl?: string;
  rawInputSnippet?: string;
  primaryCategory: KnowledgeCategory;
  tags: string[]; // e.g., ["Finance", "Marketing", "AI", "General Knowledge", "Venture Capital"]
  
  // Structured Summaries
  oneLiner: string;
  executiveSummary: string;
  keyTakeaways: string[];
  coreConcepts: KnowledgeCoreConcept[];
  
  // Business, MBA, Interview & Practical Angle
  interviewRelevance?: string;
  potentialQuestions?: string[];
  industryMetricsOrFacts?: string[];
  
  // Organization, Notes, Status
  status: 'Unread' | 'Reviewed' | 'Mastered';
  isFavorite?: boolean;
  userNotes?: string;
  readingTimeMinutes: number;
  
  // Live Grounding Web Citations
  webSources?: { title: string; uri: string }[];
  
  // Interactive Q&A thread on this document
  qaHistory?: KnowledgeQAItem[];

  createdAt: string;
  updatedAt: string;
}

