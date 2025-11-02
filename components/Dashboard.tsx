
import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { User, CalendarEvent, WellnessLog, Project, ShoppingItem, TaskStatus, MealPlanDay, HockeyGame, LiveScore } from '../types';
import { generateWeeklyUpdate, WeeklyUpdateContext, generateMealPlan, getGroundedSuggestions, GroundedSearchResult, getLiveGameScore } from '../services/geminiService';


// --- Start of data copied for newsletter generation ---
// Note: In a real app, this data would be fetched or managed via a state management solution.
// It is duplicated here to provide context for the newsletter generation feature
// without a major refactor of the application's data flow.

const MOCK_USERS_FOR_NEWSLETTER: { [key: string]: User } = {
  stacey: { id: 'stacey', name: 'Stacey', avatar: 'https://picsum.photos/seed/stacey/100/100' },
  dale: { id: 'dale', name: 'Dale', avatar: 'https://picsum.photos/seed/dale/100/100' },
  john: { id: 'john', name: 'John', avatar: 'https://picsum.photos/seed/john/100/100' },
  craig: { id: 'craig', name: 'Craig', avatar: 'https://picsum.photos/seed/craig/100/100' },
};

const newsletterCalendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Morning Meds', day: 'Monday', time: '8 AM', assignee: MOCK_USERS_FOR_NEWSLETTER.stacey, type: 'Shift' },
  { id: '2', title: 'Lunch & Walk', day: 'Tuesday', time: '12 PM', assignee: MOCK_USERS_FOR_NEWSLETTER.craig, type: 'Shift' },
  { id: '3', title: "Dale's Birthday", day: 'Wednesday', type: 'Birthday' },
  { id: '4', title: 'Dinner', day: 'Thursday', time: '6 PM', assignee: MOCK_USERS_FOR_NEWSLETTER.john, type: 'Shift' },
];

const dashboardCalendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Morning Meds', day: 'Today', time: '8 AM', assignee: MOCK_USERS_FOR_NEWSLETTER.stacey, type: 'Shift' },
  { id: '2', title: 'Lunch & Walk', day: 'Tuesday', time: '12 PM', assignee: MOCK_USERS_FOR_NEWSLETTER.craig, type: 'Shift' },
  { id: '3', title: "Dale's Birthday", day: 'Wednesday', type: 'Birthday' },
  { id: '4', title: 'Dinner', day: 'Thursday', time: '6 PM', assignee: MOCK_USERS_FOR_NEWSLETTER.john, type: 'Shift' },
];

const newsletterWellnessLogs: WellnessLog[] = [
  { id: '2', author: MOCK_USERS_FOR_NEWSLETTER.stacey, timestamp: 'Yesterday', category: 'Update', content: 'Ate well, mood is excellent. We spent some time in the garden.' },
  { id: '1', author: MOCK_USERS_FOR_NEWSLETTER.john, timestamp: '2 days ago', category: 'Event', content: 'Gram finished her Physical Therapy today. All good!' },
];

const newsletterRenovationProject: Project = {
  id: 'reno1',
  title: "Bathroom Redo",
  lead: MOCK_USERS_FOR_NEWSLETTER.stacey,
  tasks: [
    { id: 't1', title: 'Pick up paint swatches', description: 'Get samples for "calm blue" and "sea green"', assignee: MOCK_USERS_FOR_NEWSLETTER.craig, status: TaskStatus.ToDo, dueDate: 'Saturday' },
    { id: 't2', title: 'Finalize new vanity', description: 'Decide between the two options from Home Depot', assignee: MOCK_USERS_FOR_NEWSLETTER.stacey, status: TaskStatus.ToDo },
    { id: 't3', title: 'Demolish old tile', description: 'Be careful with the plumbing', assignee: MOCK_USERS_FOR_NEWSLETTER.dale, status: TaskStatus.InProgress },
  ]
};

const newsletterShoppingList: ShoppingItem[] = [
    {id: 's1', name: 'Milk', addedBy: MOCK_USERS_FOR_NEWSLETTER.craig, category: 'Groceries'},
    {id: 's2', name: 'Paper Towels', addedBy: MOCK_USERS_FOR_NEWSLETTER.stacey, category: 'Supplies'},
    {id: 's4', name: 'Ensure', addedBy: MOCK_USERS_FOR_NEWSLETTER.stacey, category: "Gram's"},
];
// --- End of data copied for newsletter generation ---

const getPastDate = (hours: number, minutes: number) => {
    return new Date(Date.now() - hours * 3600000 - minutes * 60000).toISOString();
};

const getFutureDate = (days: number, hours: number, minutes: number) => {
    return new Date(Date.now() + days * 86400000 + hours * 3600000 + minutes * 60000).toISOString();
};

const MOCK_HOCKEY_SCHEDULE: HockeyGame[] = [
    { id: 'g0', opponent: 'Ottawa Senators', date: getPastDate(1, 38), location: 'Home' },
    { id: 'g1', opponent: 'Toronto Maple Leafs', date: getFutureDate(1, 4, 30), location: 'Home' },
    { id: 'g2', opponent: 'Boston Bruins', date: getFutureDate(5, 2, 0), location: 'Away' },
    { id: 'g3', opponent: 'Florida Panthers', date: getFutureDate(10, 0, 0), location: 'Away' },
];

const HockeyCountdown: React.FC<{ games: HockeyGame[] }> = ({ games }) => {
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const [liveScore, setLiveScore] = useState<LiveScore | null>(null);
    const [isScoreLoading, setIsScoreLoading] = useState(true);

    useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const GAME_DURATION_HOURS = 3;

    const liveGame = games.find(g => {
        const gameStart = new Date(g.date).getTime();
        const gameEnd = gameStart + GAME_DURATION_HOURS * 60 * 60 * 1000;
        return currentTime >= gameStart && currentTime <= gameEnd;
    });

    useEffect(() => {
      let isMounted = true;
      if (liveGame) {
        const fetchScore = async () => {
          const scoreData = await getLiveGameScore(liveGame.opponent);
          if (isMounted) {
              setLiveScore(scoreData);
              if (isScoreLoading) {
                  setIsScoreLoading(false);
              }
          }
        };
        
        setIsScoreLoading(true);
        setLiveScore(null);
        fetchScore();
        const intervalId = setInterval(fetchScore, 60000);

        return () => {
          isMounted = false;
          clearInterval(intervalId);
        };
      } else {
        setIsScoreLoading(false);
        setLiveScore(null);
      }
    }, [liveGame?.id]);

    const upcomingGames = games
        .filter(g => new Date(g.date).getTime() > currentTime)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const nextGame = upcomingGames.length > 0 ? upcomingGames[0] : null;

    useEffect(() => {
        if (!nextGame) return;

        const distance = new Date(nextGame.date).getTime() - currentTime;

        if (distance < 0) {
            setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeRemaining({ days, hours, minutes, seconds });

    }, [currentTime, nextGame]);

    if (liveGame) {
        const gameTime = new Date(liveGame.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const awayTeam = liveGame.location === 'Away' ? 'MTL' : liveGame.opponent.substring(0,3).toUpperCase();
        const homeTeam = liveGame.location === 'Home' ? 'MTL' : liveGame.opponent.substring(0,3).toUpperCase();
        const awayScore = liveGame.location === 'Away' ? liveScore?.mtlScore : liveScore?.opponentScore;
        const homeScore = liveGame.location === 'Home' ? liveScore?.mtlScore : liveScore?.opponentScore;

        return (
            <div className="bg-gradient-to-br from-red-600 via-blue-800 to-red-700 text-white p-4 rounded-xl shadow-2xl text-center ring-4 ring-red-500 ring-opacity-75 ring-offset-4 ring-offset-brand-bg">
                <div className="flex items-center justify-center gap-2 relative">
                    <Icon name="hockey" className="w-6 h-6" />
                    <h3 className="text-xl font-bold uppercase tracking-wider">Habs Game Night</h3>
                     <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-black/30 rounded-full px-2 py-0.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold uppercase">Live</span>
                    </div>
                </div>
                
                {isScoreLoading ? (
                    <div className="flex justify-center items-center my-4 h-28 text-lg font-sans">
                        <Icon name="spinner" className="w-6 h-6" />
                        <span className="ml-3">Fetching Live Score...</span>
                    </div>
                ) : liveScore ? (
                    <div className="my-3 bg-black/40 p-4 rounded-lg font-mono text-white ring-1 ring-gray-500/50 shadow-inner">
                        <div className="flex justify-between items-center text-center">
                            <div className="w-2/5 text-2xl md:text-3xl font-bold tracking-wider">{awayTeam}</div>
                            <div className="w-1/5 text-4xl md:text-5xl font-black">{awayScore}</div>
                            <div className="w-1/5 text-4xl md:text-5xl font-black">{homeScore}</div>
                            <div className="w-2/5 text-2xl md:text-3xl font-bold tracking-wider">{homeTeam}</div>
                        </div>
                        <div className="mt-2 text-center text-base md:text-lg font-semibold tracking-widest text-yellow-300 border-t-2 border-yellow-300/50 pt-2">
                            <span className="animate-pulse">PER {liveScore.period} | {liveScore.timeRemaining}</span>
                        </div>
                    </div>
                ) : (
                   <div className="my-4 p-4 text-center h-28 flex items-center justify-center font-sans">
                        <p>Scoreboard currently unavailable.</p>
                   </div>
                )}

                <p className="mt-1 text-sm font-semibold font-sans normal-case">Started at {gameTime} @ {liveGame.location === 'Home' ? 'Bell Centre' : 'Away'}</p>
            </div>
        );
    }

    if (!nextGame) {
        return <div className="text-center font-bold p-4 bg-gray-200 rounded-lg">No upcoming games. Enjoy the break!</div>;
    }

    const gameTime = new Date(nextGame.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-gradient-to-r from-blue-700 to-red-600 text-white p-4 rounded-xl shadow-lg text-center">
            <div className="flex items-center justify-center gap-2">
                <Icon name="hockey" className="w-6 h-6" />
                <h3 className="text-xl tracking-wider">Habs Next Game</h3>
            </div>
            <div className="text-2xl md:text-4xl font-black my-2 font-display">
                vs {nextGame.opponent}
            </div>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div>
                    <div className="text-3xl md:text-5xl font-bold">{String(timeRemaining.days).padStart(2, '0')}</div>
                    <div className="text-xs uppercase">Days</div>
                </div>
                <div>
                    <div className="text-3xl md:text-5xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</div>
                    <div className="text-xs uppercase">Hours</div>
                </div>
                <div>
                    <div className="text-3xl md:text-5xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                    <div className="text-xs uppercase">Mins</div>
                </div>
                <div>
                    <div className="text-3xl md:text-5xl font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                    <div className="text-xs uppercase">Secs</div>
                </div>
            </div>
            <p className="mt-3 text-sm font-semibold font-sans normal-case">{gameTime} @ {nextGame.location === 'Home' ? 'Bell Centre' : 'Away'}</p>
        </div>
    );
};


const WeeklyUpdateGenerator: React.FC = () => {
    const [updateText, setUpdateText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setUpdateText('');
        setIsCopied(false);

        const context: WeeklyUpdateContext = {
            calendarEvents: newsletterCalendarEvents,
            wellnessLogs: newsletterWellnessLogs,
            project: newsletterRenovationProject,
            shoppingList: newsletterShoppingList,
        };

        const result = await generateWeeklyUpdate(context);
        setUpdateText(result);
        setIsLoading(false);
    };

    const handleCopy = () => {
        if (!updateText) return;
        navigator.clipboard.writeText(updateText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Card title="Weekly House Check-in" icon={<Icon name="mail" className="w-6 h-6 text-brand-secondary" />} className="lg:col-span-3">
            <p className="text-sm text-brand-subtle mb-4">
                Click the button to generate a friendly, shareable summary of what's happening and what's needed around the house. Perfect for a quick family email or text!
            </p>
            
            {!updateText && (
                 <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105"
                >
                    {isLoading ? <Icon name="spinner" /> : <><Icon name="mail" className="w-5 h-5" /> Generate Update</>}
                </button>
            )}

            {updateText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="whitespace-pre-wrap text-sm text-brand-text leading-relaxed">{updateText}</p>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                        <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-brand-primary py-2 px-3 rounded-lg hover:bg-brand-primary/90 transition-all duration-200 ease-in-out hover:scale-105">
                           <Icon name="copy" className="w-4 h-4" />
                           {isCopied ? 'Copied to Clipboard!' : 'Copy Text'}
                        </button>
                         <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-brand-text bg-gray-200 py-2 px-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all duration-200 ease-in-out hover:scale-105">
                           {isLoading ? <Icon name="spinner" /> : 'Regenerate'}
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};


const MealPlanner: React.FC = () => {
    const [query, setQuery] = useState('');
    const [plan, setPlan] = useState<MealPlanDay[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setPlan([]);
        const result = await generateMealPlan(query);
        setPlan(result);
        setIsLoading(false);
    };

    return (
        <Card title="AI Meal Planner" icon={<Icon name="meal" className="w-6 h-6 text-brand-accent" />} className="lg:col-span-3">
             <p className="text-sm text-brand-subtle mb-4">
                Need some meal ideas for Gram? Enter a preference like "low-sodium" or "soft foods" and let AI create a simple 3-day plan.
            </p>
            <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., low-sodium dinner ideas"
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
                <button type="submit" disabled={isLoading} className="bg-brand-accent text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center disabled:bg-opacity-50 transition-transform duration-200 ease-in-out hover:scale-105">
                    {isLoading ? <Icon name="spinner" className="w-5 h-5"/> : 'Generate'}
                </button>
            </form>

            {plan.length > 0 && (
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                    {plan.map((dayPlan) => (
                        <div key={dayPlan.day} className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-center text-brand-text mb-3">{dayPlan.day}</h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">B:</span> {dayPlan.meals.breakfast}</p>
                                <p><span className="font-semibold">L:</span> {dayPlan.meals.lunch}</p>
                                <p><span className="font-semibold">D:</span> {dayPlan.meals.dinner}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

const FamilyHarmonyAssistant: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GroundedSearchResult | null>(null);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    const topics = [
        { title: "Tips for Dementia Care", query: "Practical tips for communicating with a family member with dementia or memory loss" },
        { title: "Improving Communication", query: "How to improve communication and reduce conflict in a multi-generational household" },
        { title: "Cohabitation Guide", query: "Guide to setting boundaries and sharing responsibilities when living with aging parents" },
    ];

    const handleGetTips = async (topic: {title: string, query: string}) => {
        setIsLoading(true);
        setResult(null);
        setActiveTopic(topic.title);
        const searchResult = await getGroundedSuggestions(topic.query);
        setResult(searchResult);
        setIsLoading(false);
    };
    
    return (
        <Card title="Family Harmony Assistant" icon={<Icon name="lightbulb" className="w-6 h-6 text-yellow-500" />} className="lg:col-span-3">
            <p className="text-sm text-brand-subtle mb-4">Click a topic below for helpful articles and advice on navigating family life together.</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {topics.map(topic => (
                     <button 
                        key={topic.title}
                        onClick={() => handleGetTips(topic)} 
                        disabled={isLoading}
                        className={`text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200 ease-in-out disabled:opacity-70 hover:scale-105 ${activeTopic === topic.title ? 'bg-brand-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {topic.title}
                    </button>
                ))}
            </div>
            {isLoading && (
                 <div className="flex justify-center items-center gap-2 p-4">
                    <Icon name="spinner" className="w-5 h-5 text-brand-primary"/>
                    <span className="text-brand-subtle">Finding helpful resources...</span>
                </div>
            )}
            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    <p className="whitespace-pre-wrap text-brand-text">{result.answer}</p>
                    {result.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-sm">Sources from Google Search:</h4>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                {result.sources.map((source, index) => (
                                    <li key={index} className="text-sm">
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                            <Icon name="link" className="w-4 h-4" />
                                            {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};


const MOCK_USERS = {
  craig: { id: 'craig', name: 'Craig', avatar: 'https://picsum.photos/seed/craig/100/100' },
  john: { id: 'john', name: 'John', avatar: 'https://picsum.photos/seed/john/100/100' },
};

const nextTasks = [
  { id: 1, type: 'Chore', title: 'Walk Luna', time: 'Today: 6:00 PM', icon: 'dog' },
  { id: 2, type: 'Care Shift', title: 'Gram Dinner', time: 'Tomorrow: 5:00 PM', icon: 'care' },
  { id: 3, type: 'Renovation', title: 'Pick up paint swatches', time: 'Due Saturday', icon: 'projects' },
];

const lastUpdate = {
  author: MOCK_USERS.john,
  content: "Gram finished her Physical Therapy today. All good!",
};

interface DashboardProps {
  currentUser: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl text-brand-text">Welcome back, {currentUser.name}!</h2>
        <p className="text-brand-subtle mt-1 font-sans normal-case">Here's your snapshot for today.</p>
      </div>

      <HockeyCountdown games={MOCK_HOCKEY_SCHEDULE} />

      <div className="bg-brand-subtle/20 border-l-4 border-brand-subtle text-brand-text p-4 rounded-lg shadow" role="alert">
        <p className="font-bold flex items-center gap-2"><Icon name="baby" className="w-5 h-5"/>Alert: Harper joining us on November 2nd!</p>
        <p className="font-sans normal-case">Let's make sure everything is ready.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Your Next 3 Tasks" icon={<Icon name="check" className="w-6 h-6 text-brand-primary" />}>
          <ul className="space-y-4">
            {nextTasks.map(task => (
              <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-primary/10 p-2 rounded-full">
                    <Icon name={task.icon} className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold font-sans normal-case">{task.title}</p>
                    <p className="text-sm text-brand-subtle">{task.type}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{task.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="This Week's Schedule" icon={<Icon name="calendar" className="w-6 h-6 text-brand-secondary" />}>
            <ul className="space-y-3">
                {dashboardCalendarEvents.map(event => (
                    <li key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {event.type === 'Birthday' ? <Icon name="birthday" className="w-5 h-5 text-brand-secondary" /> : <Icon name="care" className="w-5 h-5 text-brand-primary" />}
                            <div>
                                <p className="font-semibold font-sans normal-case">{event.title}</p>
                                <p className="text-sm text-brand-subtle">{event.day}{event.time ? `, ${event.time}` : ''}</p>
                            </div>
                        </div>
                        {event.assignee && <img src={event.assignee.avatar} alt={event.assignee.name} title={event.assignee.name} className="w-8 h-8 rounded-full" />}
                    </li>
                ))}
            </ul>
        </Card>

        <Card title="Last Care Circle Update" icon={<Icon name="care" className="w-6 h-6 text-brand-accent" />}>
            <div className="flex items-start gap-4">
                <img src={lastUpdate.author.avatar} alt={lastUpdate.author.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <p className="font-semibold font-sans normal-case">{lastUpdate.author.name} says:</p>
                    <blockquote className="mt-1 p-3 bg-brand-primary/5 border-l-4 border-brand-primary/20 rounded-r-lg">
                        "{lastUpdate.content}"
                    </blockquote>
                </div>
            </div>
        </Card>
        
        <FamilyHarmonyAssistant />

        <WeeklyUpdateGenerator />

        <MealPlanner />

      </div>
    </div>
  );
};
