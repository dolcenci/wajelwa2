import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hi! I'm Wajelwa's virtual assistant. Ask me about shipping, returns, sizing, orders, or payment.",
            time: new Date(),
            followUps: ['Shipping info', 'Return policy', 'Sizing guide', 'Track my order']
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const [copiedId, setCopiedId] = useState(null);

    const messagesEndRef = useRef(null);
    const messagesBoxRef = useRef(null);
    const nextIdRef = useRef(2);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setUnread(0);
        };
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const box = messagesBoxRef.current;
        if (!box) return;

        // Only auto-scroll if the user is already near the bottom
        const nearBottom =
            box.scrollHeight - box.scrollTop - box.clientHeight < 80;

        if (nearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isTyping]);

    const pushMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    const handleSend = async (text) => {
        const messageText = (text || input).trim();
        if (!messageText || isTyping) return;

        const userMessage = {
            id: nextIdRef.current++,
            sender: 'user',
            text: messageText,
            time: new Date()
        };

        pushMessage(userMessage);
        setInput('');
        setIsTyping(true);

        try {
            const response = await chatbotService.sendMessage(messageText);

            const botMessage = {
                id: nextIdRef.current++,
                sender: 'bot',
                text: response.data.reply || "Sorry, I didn't catch that.",
                followUps: response.data.followUps || [],
                time: new Date()
            };

            pushMessage(botMessage);

            if (!isOpen) {
                setUnread(prev => prev + 1);
            }
        } catch (err) {
            pushMessage({
                id: nextIdRef.current++,
                sender: 'bot',
                text:
                    "I'm having trouble reaching the server right now. Please try again in a moment, or email hello@wajelwa.co.za.",
                time: new Date()
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleReset = () => {
        nextIdRef.current = 2;
        setMessages([
            {
                id: 1,
                sender: 'bot',
                text: "Hi! I'm Wajelwa's virtual assistant. Ask me about shipping, returns, sizing, orders, or payment.",
                time: new Date(),
                followUps: ['Shipping info', 'Return policy', 'Sizing guide', 'Track my order']
            }
        ]);
        setInput('');
        setUnread(0);
    };

    const handleCopy = async (message) => {
        try {
            await navigator.clipboard.writeText(message.text);
            setCopiedId(message.id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch (_) {
            /* clipboard may be blocked; ignore */
        }
    };

    const formatTime = (date) =>
        date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setUnread(0);
                }}
                className="chatbot-fab"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
                {!isOpen && unread > 0 && (
                    <span className="chatbot-unread">{unread}</span>
                )}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <div className="chatbot-avatar">🤖</div>
                            <div>
                                <p className="chatbot-title">Wajelwa Assistant</p>
                                <p className="chatbot-status">
                                    <span className="chatbot-dot" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="chatbot-header-right">
                            <button
                                className="chatbot-icon-btn"
                                onClick={handleReset}
                                aria-label="Restart chat"
                                title="Restart chat"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1 4 1 10 7 10" />
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                            </button>
                            <button
                                className="chatbot-icon-btn"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages" ref={messagesBoxRef}>
                        {messages.map((m) => (
                            <div key={m.id} className="chatbot-message-group">
                                <div
                                    className={`chatbot-row ${m.sender === 'user' ? 'chatbot-row-user' : 'chatbot-row-bot'}`}
                                >
                                    <button
                                        type="button"
                                        className={`chatbot-bubble ${m.sender === 'user' ? 'chatbot-bubble-user' : 'chatbot-bubble-bot'}`}
                                        onClick={() => handleCopy(m)}
                                        title="Click to copy"
                                    >
                                        <p>{m.text}</p>
                                        <span className="chatbot-time">
                                            {formatTime(m.time)}
                                            {copiedId === m.id && ' · copied'}
                                        </span>
                                    </button>
                                </div>

                                {m.sender === 'bot' && m.followUps && m.followUps.length > 0 && (
                                    <div className="chatbot-followups">
                                        {m.followUps.map((f, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(f)}
                                                className="chatbot-chip"
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chatbot-row chatbot-row-bot">
                                <div className="chatbot-bubble chatbot-bubble-bot">
                                    <div className="chatbot-typing">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-row">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="chatbot-input"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="chatbot-send"
                            aria-label="Send message"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;