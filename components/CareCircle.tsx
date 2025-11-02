
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { User, WellnessLog, Medication, ChatMessage, CalendarEvent, Contact } from '../types';
import { getGroundedSuggestions, GroundedSearchResult } from '../services/geminiService';

interface TeamChatProps {
    messages: ChatMessage[];
    onSendMessage: (message: ChatMessage) => void;
    currentUser: User;
}

const TeamChat: React.FC<TeamChatProps> = ({ messages, onSendMessage, currentUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: `c${Date.now()}`,
            author: currentUser,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: newMessage,
        };

        onSendMessage(message);
        setNewMessage('');
    };

    return (
        <Card title="Team Chat" icon={<Icon name="user" className="w-6 h-6 text-purple-500" />}>
            <div ref={chatContainerRef} className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-4">
                {messages.map(msg => {
                    const isCurrentUser = msg.author.id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {!isCurrentUser && (
                                <img src={msg.author.avatar} alt={msg.author.name} className="w-8 h-8 rounded-full self-start" />
                            )}
                             <div className={`w-auto max-w-xs md:max-w-sm p-3 rounded-lg ${isCurrentUser ? 'bg-brand-subtle text-brand-text' : 'bg-white border border-gray-200 text-brand-text'}`}>
                                {!isCurrentUser && (
                                    <p className="font-semibold text-sm mb-1">{msg.author.name}</p>
                                )}
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-brand-text/60' : 'text-brand-subtle'}`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    aria-label="Type a message to the team"
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
                <button type="submit" className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-primary/90 flex items-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105">
                    Send
                    <Icon name="send" className="w-5 h-5" />
                </button>
            </form>
        </Card>
    );
};


const GeminiSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GroundedSearchResult | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        setResult(null);
        const searchResult = await getGroundedSuggestions(query);
        setResult(searchResult);
        setIsLoading(false);
    }
    
    return (
        <Card title="Caregiving Resources" icon={<Icon name="search" className="w-6 h-6 text-brand-primary" />}>
            <p className="text-sm text-brand-subtle mb-4">Have a question about caregiving? Ask Gemini for suggestions and resources from Google Search.</p>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., activities for seniors"
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
                <button type="submit" disabled={isLoading} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center disabled:bg-opacity-50 transition-transform duration-200 ease-in-out hover:scale-105">
                    {isLoading ? <Icon name="spinner" className="w-5 h-5"/> : 'Search'}
                </button>
            </form>
            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{result.answer}</p>
                    {result.sources.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm">Sources:</h4>
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

interface CareCircleProps {
    currentUser: User;
    users: { [key: string]: User };
    calendarEvents: CalendarEvent[];
    wellnessLogs: WellnessLog[];
    medications: Medication[];
    contacts: Contact[];
    chatMessages: ChatMessage[];
    onSendMessage: (message: ChatMessage) => void;
}

export const CareCircle: React.FC<CareCircleProps> = ({
    currentUser,
    users,
    calendarEvents,
    wellnessLogs,
    medications,
    contacts,
    chatMessages,
    onSendMessage
}) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card title="Shared Calendar" icon={<Icon name="calendar" className="w-6 h-6 text-brand-primary" />}>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {daysOfWeek.map(day => (
                        <div key={day} className="bg-gray-50 p-2 rounded-lg min-h-[12rem]">
                            <h4 className="font-bold text-center text-sm">{day}</h4>
                            <div className="mt-2 space-y-2">
                                {calendarEvents.filter(s => s.day === day).map(event => (
                                    <div key={event.id} className={`text-xs p-2 rounded-lg shadow-sm ${
                                        event.type === 'Shift' ? 'bg-purple-100 border-l-4 border-purple-400' : 'bg-yellow-100 border-l-4 border-yellow-400'
                                    }`}>
                                        <div className="flex items-center gap-1.5 font-semibold">
                                           {event.type === 'Birthday' && <Icon name="birthday" className="w-4 h-4 text-yellow-600" />}
                                           <p className="font-sans normal-case tracking-normal">{event.title}</p>
                                        </div>
                                        {event.type === 'Shift' && (
                                            <div className="mt-1">
                                                <p className="text-gray-600">{event.time}</p>
                                                {event.assignee && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <img src={event.assignee.avatar} alt={event.assignee.name} className="w-5 h-5 rounded-full" />
                                                        <p className="font-bold text-gray-800">{event.assignee.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
             <GeminiSearch />
            <Card title="Wellness Log & Photo Journal" icon={<Icon name="doc" className="w-6 h-6 text-brand-accent" />}>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {wellnessLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-3">
                            <img src={log.author.avatar} alt={log.author.name} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <p className="font-semibold">{log.author.name} <span className="text-sm font-normal text-brand-subtle">{log.timestamp}</span></p>
                                <p>{log.content}</p>
                                {log.imageUrl && <img src={log.imageUrl} alt="wellness log" className="mt-2 rounded-lg w-full max-w-sm" />}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div className="space-y-8">
            <Card title="Medication Tracker" icon={<Icon name="pill" className="w-6 h-6 text-red-500" />}>
                <ul className="space-y-3">
                    {medications.map(med => (
                        <li key={med.id} className="p-3 rounded-lg bg-gray-50">
                            <p className="font-bold">{med.name} <span className="font-normal">({med.dosage})</span></p>
                            <p className="text-sm text-brand-subtle">Time: {med.time}</p>
                            {med.lastAdministeredBy && <p className="text-xs mt-1">Last given by {med.lastAdministeredBy.name} at {med.lastAdministeredAt}</p>}
                        </li>
                    ))}
                </ul>
            </Card>
            <TeamChat messages={chatMessages} onSendMessage={onSendMessage} currentUser={currentUser} />
            <Card title="Gram's Phonebook" icon={<Icon name="phone" className="w-6 h-6 text-blue-500" />}>
                 <ul className="space-y-3">
                    {contacts.map(contact => (
                        <li key={contact.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-brand-subtle">{contact.number}</p>
                            </div>
                            <button className="p-2 rounded-full hover:bg-blue-100 transition-transform duration-200 ease-in-out hover:scale-110">
                                <Icon name="phone" className="w-5 h-5 text-blue-600"/>
                            </button>
                        </li>
                    ))}
                 </ul>
            </Card>
        </div>
    </div>
  );
};
