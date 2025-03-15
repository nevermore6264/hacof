// app/chat/ChatClient.tsx
'use client';
import { useState } from 'react';
import ChatList from './ChatList';
import ChatDetails from './ChatDetails';

export default function ChatClient() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const chats = [
        {
            id: 1,
            name: "Cody Fisher",
            image: "https://randomuser.me/api/portraits/men/49.jpg",
            lastMessage: "Haha oh man",
            lastMessageTime: "05:14 pm",
        },
        {
            id: 2,
            name: "Jane Cooper",
            image: "https://randomuser.me/api/portraits/men/11.jpg",
            lastMessage: "Haha that’s terrifying 😊",
            lastMessageTime: "07:38 am",
        },
        {
            id: 3,
            name: "Floyd Miles",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            lastMessage: "perfect!",
            lastMessageTime: "11:49 pm",
        },
        {
            id: 4,
            name: "Marvin McKinney",
            image: "https://randomuser.me/api/portraits/men/23.jpg",
            lastMessage: "omg, this is amazing...",
            lastMessageTime: "07:40 am",
        },
        {
            id: 5,
            name: "Courtney Henry",
            image: "https://randomuser.me/api/portraits/men/55.jpg",
            lastMessage: "aww",
            lastMessageTime: "08:20 pm",
        },
        {
            id: 6,
            name: "Dianne Russell",
            image: "https://randomuser.me/api/portraits/men/15.jpg",
            lastMessage: "I'll be there in 2 mins",
            lastMessageTime: "01:09 am",
        },
        {
            id: 7,
            name: "Darrell Steward",
            image: "https://randomuser.me/api/portraits/men/43.jpg",
            lastMessage: "Haha that's terrifying 😊",
            lastMessageTime: "07:38 am",
        },
    ];

    const messages = [
        { sender: "Cody Fisher", time: "05:14 pm", content: "Haha oh man" },
        { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊" },
        { sender: "Floyd Miles", time: "11:49 pm", content: "perfect!" },
        { sender: "Marvin McKinney", time: "07:40 am", content: "omg, this is amazing..." },
        { sender: "Courtney Henry", time: "08:20 pm", content: "aww" },
        { sender: "Dianne Russell", time: "01:09 am", content: "I'll be there in 2 mins" },
        { sender: "Darrell Steward", time: "07:38 am", content: "Haha that's terrifying 😊" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side - Chat List */}
            <ChatList chats={chats} onChatSelect={setSelectedChatId} />

            {/* Right Side - Chat Details */}
            {selectedChatId ? (
                <ChatDetails chatId={selectedChatId} messages={messages} />
            ) : (
                <div className="w-2/3 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Select a chat to start messaging</p>
                </div>
            )}
        </div>
    );
}