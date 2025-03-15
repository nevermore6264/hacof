/* eslint-disable @next/next/no-img-element */
// app/_components/ChatDetails.tsx
'use client';
import React from 'react';

interface Message {
    sender: string;
    time: string;
    content: string;
    type: 'text' | 'image';
}

interface ChatDetailsProps {
    chatId: number;
    chats: {
        id: number;
        name: string;
        image: string;
        lastMessage: string;
        lastMessageTime: string;
        messages: Message[];
    }[];
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatId, chats }) => {
    const chat = chats.find((chat) => chat.id === chatId);

    if (!chat) {
        return (
            <div className="w-2/3 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No chat selected</p>
            </div>
        );
    }

    return (
        <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <img src={chat.image} alt={chat.name} className="w-10 h-10 rounded-full" />
                    <p className="ml-3 text-lg font-bold text-gray-900">{chat.name}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {chat.messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{message.sender}</span>
                            <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        {message.type === 'text' ? (
                            <p className="text-gray-700">{message.content}</p>
                        ) : (
                            <img src={message.content} alt="Sent image" className="mt-2 rounded-lg max-w-xs" />
                        )}
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