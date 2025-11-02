
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { BotChatMessage } from '../types';
import { startLunaiChat } from '../services/geminiService';
import type { Chat } from '@google/genai';


export const Lunai: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<BotChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the chat session
        const chatInstance = startLunaiChat();
        setChat(chatInstance);
        setMessages([
            { role: 'model', text: "Hello! I'm LUNai, your friendly care assistant. How can I help you and your family today?" }
        ]);
    }, []);

    useEffect(() => {
        // Scroll to bottom of chat on new message
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('message') as HTMLInputElement;
        const userInput = input.value.trim();

        if (!userInput || !chat) return;

        setIsLoading(true);
        // Add user message and a placeholder for the model's response
        setMessages(prev => [...prev, { role: 'user', text: userInput }, { role: 'model', text: '' }]);
        input.value = '';

        try {
            const result = await chat.sendMessageStream({ message: userInput });
            
            for await (const chunk of result) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += chunkText;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = "Sorry, I encountered an error. Please try again.";
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-0 right-0 m-4 md:m-8 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-primary text-white rounded-full p-4 shadow-2xl hover:bg-brand-primary/90 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transform hover:scale-110 transition-transform duration-200"
                    aria-label="Open LUNai Assistant"
                >
                    <Icon name="bot" className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 mb-4 mr-4 md:mb-8 md:mr-8 w-[calc(100vw-2rem)] max-w-sm h-[75vh] max-h-[600px] bg-brand-bg/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col transition-all duration-500 ease-in-out font-sans ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-brand-subtle/20">
                    <div className="flex items-center gap-3">
                        <Icon name="bot" className="w-8 h-8 text-brand-primary" />
                        <div>
                            <h3 className="text-lg text-brand-text tracking-wider normal-case">LUNai Assistant</h3>
                            <p className="text-xs text-brand-subtle normal-case">Your special care helper</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full text-brand-subtle hover:bg-brand-subtle/10"
                        aria-label="Close chat"
                    >
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Messages */}
                <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <Icon name="bot" className="w-8 h-8 text-brand-primary self-start flex-shrink-0" />}
                            <div className={`w-auto max-w-xs p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-subtle/80 text-brand-text' : 'bg-white border border-gray-200 text-brand-text'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {isLoading && msg.role === 'model' && index === messages.length -1 && <div className="dot-flashing"></div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t border-brand-subtle/20 bg-white/50">
                    <input
                        type="text"
                        name="message"
                        placeholder="Ask LUNai anything..."
                        aria-label="Ask LUNai a question"
                        disabled={isLoading}
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading} className="bg-brand-primary text-white font-semibold p-3 rounded-lg hover:bg-brand-primary/90 flex items-center justify-center disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105">
                        {isLoading ? <Icon name="spinner" className="w-5 h-5" /> : <Icon name="send" className="w-5 h-5" />}
                    </button>
                </form>
            </div>
            <style>{`
                .dot-flashing {
                  position: relative;
                  width: 5px;
                  height: 5px;
                  border-radius: 5px;
                  background-color: #581845;
                  color: #581845;
                  animation: dot-flashing 1s infinite linear alternate;
                  animation-delay: .5s;
                  margin: 10px 0 0 10px;
                }
                .dot-flashing::before, .dot-flashing::after {
                  content: '';
                  display: inline-block;
                  position: absolute;
                  top: 0;
                }
                .dot-flashing::before {
                  left: -10px;
                  width: 5px;
                  height: 5px;
                  border-radius: 5px;
                  background-color: #581845;
                  color: #581845;
                  animation: dot-flashing 1s infinite alternate;
                  animation-delay: 0s;
                }
                .dot-flashing::after {
                  left: 10px;
                  width: 5px;
                  height: 5px;
                  border-radius: 5px;
                  background-color: #581845;
                  color: #581845;
                  animation: dot-flashing 1s infinite alternate;
                  animation-delay: 1s;
                }
                
                @keyframes dot-flashing {
                  0% { background-color: #581845; }
                  50%, 100% { background-color: rgba(88, 24, 69, 0.2); }
                }
            `}</style>
        </>
    );
};
