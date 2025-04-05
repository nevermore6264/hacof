/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

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
    onCreateNewChat: () => void; // Hàm để tạo cuộc hội thoại mới
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect, onCreateNewChat }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Lọc danh sách chat dựa trên search query
    const filteredChats = chats
    // const filteredChats = chats.filter((chat) =>
    //     chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="w-1/3 bg-white border-r border-gray-200">
            {/* Header với tiêu đề và nút tạo cuộc hội thoại mới */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Chats</h2>
                <button
                    onClick={onCreateNewChat}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Create new chat"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>

            {/* Input search */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Danh sách chat */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                {filteredChats.map((chat) => (
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