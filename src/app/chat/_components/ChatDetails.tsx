/* eslint-disable @next/next/no-img-element */
// src/app/_components/ChatDetails.tsx
import React from 'react';

interface Message {
    sender: string;
    time: string;
    content: string;
}

interface ChatDetailsProps {
    chatId: number;
    messages: Message[];
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatId, messages }) => {
    return (
        <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                    <p className="ml-3 text-lg font-bold text-gray-900">Chat {chatId}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{message.sender}</span>
                            <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-700">{message.content}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
                <input
                    type="text"
                    placeholder="Say Something..."
                    className="w-full rounded-lg border border-gray-300 p-2"
                />
            </div>
        </div>
    );
};

export default ChatDetails;