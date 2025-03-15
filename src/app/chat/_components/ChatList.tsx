/* eslint-disable @next/next/no-img-element */
// src/app/_components/ChatList.tsx
import React from 'react';

interface Chat {
    id: number;
    name: string;
    image: string;
    lastMessage: string;
    lastMessageTime: string;
}

interface ChatListProps {
    chats: Chat[];
    onChatSelect: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect }) => {
    return (
        <div className="w-1/3 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Chats</h2>
            </div>
            <div className="overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onChatSelect(chat.id)}
                    >
                        <div className="flex items-center">
                            <img src={chat.image} alt={chat.name} className="w-10 h-10 rounded-md" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{chat.name}</p>
                                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                            </div>
                            <div className="ml-auto text-xs text-gray-500">{chat.lastMessageTime}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;