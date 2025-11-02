import { AppData, TaskStatus, User, CalendarEvent, WellnessLog, Project, ShoppingItem, HockeyGame, ChatMessage, Medication, Contact, Chore, PetLog, BabyPrepTask, MemoryItem } from '../types';

const MOCK_USERS: { [key: string]: User } = {
  stacey: { id: 'stacey', name: 'Stacey', avatar: 'https://picsum.photos/seed/stacey/100/100' },
  dale: { id: 'dale', name: 'Dale', avatar: 'https://picsum.photos/seed/dale/100/100' },
  john: { id: 'john', name: 'John', avatar: 'https://picsum.photos/seed/john/100/100' },
  craig: { id: 'craig', name: 'Craig', avatar: 'https://picsum.photos/seed/craig/100/100' },
  amber: { id: 'amber', name: 'Amber', avatar: 'https://picsum.photos/seed/amber/100/100' },
};

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Morning Meds', day: 'Monday', time: '8 AM', assignee: MOCK_USERS.stacey, type: 'Shift' },
  { id: '2', title: 'Lunch & Walk', day: 'Tuesday', time: '12 PM', assignee: MOCK_USERS.craig, type: 'Shift' },
  { id: '3', title: "Dale's Birthday", day: 'Wednesday', type: 'Birthday' },
  { id: '4', title: 'Dinner', day: 'Thursday', time: '6 PM', assignee: MOCK_USERS.john, type: 'Shift' },
  { id: '5', title: 'Breakfast', day: 'Friday', time: '8 AM', assignee: MOCK_USERS.craig, type: 'Shift' },
  { id: '6', title: 'Dr. Appointment', day: 'Wednesday', time: '10 AM', assignee: MOCK_USERS.john, type: 'Shift' },
  { id: '7', title: 'Pick up Rx', day: 'Friday', time: 'Afternoon', assignee: MOCK_USERS.stacey, type: 'Shift' },
  { id: '8', title: 'Family Dinner', day: 'Sunday', time: '6 PM', type: 'Shift' },
];

const wellnessLogs: WellnessLog[] = [
  { id: '3', author: MOCK_USERS.craig, timestamp: 'Today', category: 'Observation', content: 'Seems a little tired this afternoon.' },
  { id: '2', author: MOCK_USERS.stacey, timestamp: 'Yesterday', category: 'Update', content: 'Ate well, mood is excellent. We spent some time in the garden.', imageUrl: 'https://picsum.photos/seed/garden/400/200' },
  { id: '1', author: MOCK_USERS.john, timestamp: '2 days ago', category: 'Event', content: 'Gram finished her Physical Therapy today. All good!' },
];

const renovationProject: Project = {
  id: 'reno1',
  title: "Bathroom Redo",
  lead: MOCK_USERS.stacey,
  tasks: [
    { id: 't1', title: 'Pick up paint swatches', description: 'Get samples for "calm blue" and "sea green"', assignee: MOCK_USERS.craig, status: TaskStatus.ToDo, dueDate: 'Saturday' },
    { id: 't2', title: 'Finalize new vanity', description: 'Decide between the two options from Home Depot', assignee: MOCK_USERS.stacey, status: TaskStatus.ToDo },
    { id: 't3', title: 'Demolish old tile', description: 'Be careful with the plumbing', assignee: MOCK_USERS.dale, status: TaskStatus.InProgress },
    { id: 't4', title: 'Purchase toilet', description: 'Model #1234 from Lowes', assignee: MOCK_USERS.stacey, status: TaskStatus.Done },
  ]
};

const shoppingList: ShoppingItem[] = [
    {id: 's1', name: 'Milk', addedBy: MOCK_USERS.craig, category: 'Groceries'},
    {id: 's2', name: 'Paper Towels', addedBy: MOCK_USERS.stacey, category: 'Supplies'},
    {id: 's3', name: 'Dog food', addedBy: MOCK_USERS.dale, category: 'Pet'},
    {id: 's4', name: 'Ensure', addedBy: MOCK_USERS.stacey, category: "Gram's"},
];

const getPastDate = (hours: number, minutes: number) => new Date(Date.now() - hours * 3600000 - minutes * 60000).toISOString();
const getFutureDate = (days: number, hours: number, minutes: number) => new Date(Date.now() + days * 86400000 + hours * 3600000 + minutes * 60000).toISOString();

const hockeySchedule: HockeyGame[] = [
    { id: 'g0', opponent: 'Ottawa Senators', date: getPastDate(1, 38), location: 'Home' },
    { id: 'g1', opponent: 'Toronto Maple Leafs', date: getFutureDate(1, 4, 30), location: 'Home' },
    { id: 'g2', opponent: 'Boston Bruins', date: getFutureDate(5, 2, 0), location: 'Away' },
    { id: 'g3', opponent: 'Florida Panthers', date: getFutureDate(10, 0, 0), location: 'Away' },
];

const medications: Medication[] = [
    {id: '1', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', lastAdministeredBy: MOCK_USERS.stacey, lastAdministeredAt: 'Today 8:02 AM'},
    {id: '2', name: 'Metformin', dosage: '500mg', time: '8:00 AM & 8:00 PM', lastAdministeredBy: MOCK_USERS.stacey, lastAdministeredAt: 'Today 8:03 AM'},
    {id: '3', name: 'Vitamin D', dosage: '2000 IU', time: '8:00 AM'},
];

const contacts: Contact[] = [
    {id: 'p1', name: 'Dr. Evans (GP)', number: '555-123-4567', type: 'Doctor'},
    {id: 'p2', name: 'Main St Pharmacy', number: '555-987-6543', type: 'Pharmacy'},
    {id: 'p3', name: 'Stacey (Primary)', number: '555-222-3333', type: 'Family'},
    {id: 'p4', name: 'John', number: '555-444-5555', type: 'Family'},
    {id: 'p5', name: 'Handyman Hank', number: '555-REP-AIRS', type: 'Service'},
];

const chatMessages: ChatMessage[] = [
  { id: 'c1', author: MOCK_USERS.stacey, timestamp: '9:05 AM', content: "Just a reminder, John is taking Gram to her appointment at 2 PM." },
  { id: 'c2', author: MOCK_USERS.john, timestamp: '9:06 AM', content: "Confirmed! I'll be there." },
  { id: 'c3', author: MOCK_USERS.craig, timestamp: '9:10 AM', content: "Great, thanks both. I'll make sure she has her lunch before you go." },
];

const chores: Chore[] = [
    {id: 'c1', title: 'Take out trash & recycling', assignee: MOCK_USERS.craig, recurring: 'Weekly'},
    {id: 'c2', title: 'Clean shared bathroom', assignee: MOCK_USERS.stacey, recurring: 'Weekly'},
    {id: 'c3', title: 'Manage mail', assignee: MOCK_USERS.dale, recurring: 'Daily'},
];

const petLogs: PetLog[] = [
    {id: 'l1', activity: 'Walked', timestamp: 'Today, 7:30 AM', notes: 'Good long walk in the park.', loggedBy: MOCK_USERS.craig},
    {id: 'l2', activity: 'Fed', timestamp: 'Today, 8:00 AM', notes: 'Ate all her food.', loggedBy: MOCK_USERS.craig},
    {id: 'l3', activity: 'Walked', timestamp: 'Yesterday, 6:00 PM', notes: 'Short walk around the block.', loggedBy: MOCK_USERS.dale},
];

const babyPrepTasks: BabyPrepTask[] = [
    {id: 'h1', task: 'Assemble Crib', completed: true},
    {id: 'h2', task: 'Baby Proof Outlets', completed: false},
    {id: 'h3', task: 'Wash baby clothes', completed: true},
    {id: 'h4', task: 'Install car seat', completed: false},
];

const memories: MemoryItem[] = [
  {
    id: 'mem1',
    imageUrl: 'https://picsum.photos/seed/cottage/500/700',
    prompt: 'Gram and Dale at the cottage, laughing',
    story: "Here's that unforgettable summer day at the cottage. Gram's laughter was so infectious as she and Dale shared stories on the porch, a perfect moment of simple joy.",
    date: 'Summer 1998',
    uploadedBy: MOCK_USERS.stacey,
  },
  {
    id: 'mem2',
    imageUrl: 'https://picsum.photos/seed/wedding/600/400',
    prompt: "Mom and Dad's wedding day",
    story: "A beautiful snapshot from the wedding day. The look of pure happiness on their faces says it all – the start of a wonderful journey together.",
    date: 'June 1985',
    uploadedBy: MOCK_USERS.craig,
  },
  {
    id: 'mem3',
    imageUrl: 'https://picsum.photos/seed/fishing/500/300',
    prompt: 'First fishing trip',
    story: "Look at that concentration! This was the very first fishing trip, an early morning filled with excitement and a little bit of beginner's luck. A core memory for sure.",
    date: 'July 2002',
    uploadedBy: MOCK_USERS.stacey,
  },
];


export const mockAppData: AppData = {
    users: MOCK_USERS,
    calendarEvents,
    wellnessLogs,
    medications,
    contacts,
    chatMessages,
    renovationProject,
    chores,
    shoppingList,
    petLogs,
    babyPrepTasks,
    memories,
    hockeySchedule,
};
