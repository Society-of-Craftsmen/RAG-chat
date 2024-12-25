'use client'
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Chatbot = ({ fileName }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [height, setHeight] = useState('auto');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (fileName) {
            setMessages([
                {
                    sender: 'chatbot',
                    text: `📄 PDF "${fileName}" uploaded successfully! ✅ Ask any related questions 🤔📚`
                },
            ]);
        }
    }, [fileName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (currentMessage) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'user', text: currentMessage },
            ]);

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'chatbot', text: currentMessage },
            ]);

            setCurrentMessage('');
            setHeight('auto');
        }
    };

    const handleInputChange = (e) => {
        setCurrentMessage(e.target.value);
        setHeight('auto');
        setHeight(`${e.target.scrollHeight}px`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessage = (messageText) => {
        return messageText.split('\n').map((str, index) => (
            <React.Fragment key={index}>
                {str}
                {index !== messageText.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="relative p-3 h-[80vh] flex flex-col items-center text-center bg-slate-900">
            <div className="absolute inset-0 flex justify-center items-center z-0">
                <h1 className="text-7xl font-extrabold text-gray-700 opacity-25">
                    RAG-chat
                </h1>
            </div>


            <div className="relative w-[160vh] flex-grow overflow-y-auto p-4 rounded-b-3xl z-10">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <span
                            className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user'
                                ? 'bg-green-500 text-white text-left'
                                : 'bg-gray-400 text-black'}`}
                        >
                            {formatMessage(message.text)}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="relative w-[160vh] mt-4 rounded-xl flex items-center p-2 bg-slate-600 shadow-lg z-10">
                <textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows="1"
                    className="flex-grow p-3 bg-slate-600 text-gray-300 focus:outline-none transition-all resize-none"
                    style={{ height: height }}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all flex items-center justify-center"
                >
                    <FaPaperPlane className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
