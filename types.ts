export enum View {
  Dashboard = 'Dashboard',
  CareCircle = 'Care Circle',
  Projects = 'To-Do & Projects',
  PetBabyLog = 'Pet & Baby Log',
  Vault = 'Shared Secure Vault',
  Memories = 'Memories',
}

export interface User {
  id: string;
  name: string;
  avatar: string; // URL to avatar image
}

export interface CalendarEvent {
  id: string;
  day: string; // e.g., 'Monday'
  time?: string;
  title: string;
  type: 'Shift' | 'Birthday';
  assignee?: User;
}

export interface WellnessLog {
  id: string;
  author: User;
  timestamp: string;
  category: 'Update' | 'Event' | 'Observation';
  content: string;
  imageUrl?: string;
}

export interface Medication {
  id:string;
  name: string;
  dosage: string;
  time: string;
  lastAdministeredBy?: User;
  lastAdministeredAt?: string;
}

export interface ChatMessage {
  id: string;
  author: User;
  timestamp: string;
  content: string;
}

export interface BotChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Contact {
    id: string;
    name: string;
    number: string;
    type: 'Doctor' | 'Pharmacy' | 'Family' | 'Service';
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: User;
  status: TaskStatus;
  dueDate?: string;
}

export interface Project {
  id: string;
  title: string;
  lead: User;
  tasks: Task[];
}

export interface Chore {
  id: string;
  title: string;
  assignee: User;
  recurring: string; // e.g., 'Daily', 'Weekly'
}

export interface ShoppingItem {
  id: string;
  name: string;
  addedBy: User;
  category: 'Groceries' | 'Supplies' | "Gram's" | 'Pet';
}

export interface PetLog {
    id: string;
    activity: 'Fed' | 'Walked' | 'Meds';
    timestamp: string;
    notes: string;
    loggedBy: User;
}

export interface BabyPrepTask {
    id: string;
    task: string;
    completed: boolean;
}

export interface VaultItem {
    id: string;
    service: string;
    username: string;
}

export interface DocumentItem {
    id: string;
    name: string;
    type: 'PDF' | 'Image' | 'Document';
}

export interface Meal {
    breakfast: string;
    lunch: string;
    dinner: string;
}

export interface MealPlanDay {
    day: string;
    meals: Meal;
}

export interface HockeyGame {
  id: string;
  opponent: string;
  date: string; // ISO string for accurate time calculation
  location: 'Home' | 'Away';
}

export interface MemoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  story: string;
  date: string;
  uploadedBy: User;
}

export interface LiveScore {
  mtlScore: string;
  opponentScore: string;
  period: string;
  timeRemaining: string;
}

export interface AppData {
  users: { [key: string]: User };
  calendarEvents: CalendarEvent[];
  wellnessLogs: WellnessLog[];
  medications: Medication[];
  contacts: Contact[];
  chatMessages: ChatMessage[];
  renovationProject: Project;
  chores: Chore[];
  shoppingList: ShoppingItem[];
  petLogs: PetLog[];
  babyPrepTasks: BabyPrepTask[];
  memories: MemoryItem[];
  hockeySchedule: HockeyGame[];
}
