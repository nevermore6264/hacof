/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { FaPaperclip, FaSmile } from 'react-icons/fa'; // Icon cho tài liệu và emoji
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'; // Thư viện EmojiPicker

interface Message {
    sender: string;
    time: string;
    content: string;
    type: string;
    likes?: { emoji: string; user: string }[]; // Danh sách like với emoji và người like
    seenBy?: string[]; // Danh sách người đã xem
}

interface ChatDetailsProps {
    chatId: number;
    chats: {
        id: number;
        name: string;
        avatarUrl: string;
        lastMessage: string;
        lastMessageTime: string;
        messages: Message[];
    }[];
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatId, chats }) => {
    const chat = chats.find((chat) => chat.id === chatId);
    const [message, setMessage] = useState(''); // Tin nhắn đang nhập
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Hiển thị emoji picker
    const [file, setFile] = useState<File | null>(null); // File tài liệu

    if (!chat) {
        return (
            <div className="w-2/3 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No chat selected</p>
            </div>
        );
    }

    // Xử lý gửi tin nhắn
    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                // Gửi tin nhắn qua API
                const response = await fetch(`/api/messages/${chatId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        content: message,
                        fileUrls: file ? [URL.createObjectURL(file)] : [],
                    }),
                });

                if (response.ok) {
                    const newMessage = await response.json();
                    console.log("newMessage ", newMessage)
                    // Thêm tin nhắn mới vào danh sách (tùy thuộc vào cấu trúc response)
                    chat.messages.push({
                        sender: 'You',
                        time: new Date().toLocaleTimeString(),
                        content: message,
                        type: 'text',
                        likes: [],
                        seenBy: [],
                    });

                    setMessage('');
                    setFile(null);
                    setShowEmojiPicker(false);
                } else {
                    console.error("Failed to send message");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    // Xử lý chọn emoji từ EmojiPicker
    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    // Xử lý chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Xử lý thả emoji vào tin nhắn
    const handleDropEmoji = (messageIndex: number, emoji: string) => {
        const message = chat.messages[messageIndex];
        if (!message.likes) message.likes = [];
        // Kiểm tra xem người dùng đã like chưa
        const existingLike = message.likes.find((like) => like.user === 'You');
        if (existingLike) {
            existingLike.emoji = emoji; // Cập nhật emoji nếu đã like
        } else {
            message.likes.push({ emoji, user: 'You' }); // Thêm like mới
        }
    };

    return (
        <div className="w-2/3 flex flex-col" style={{ height: '500px' }}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <img src={chat.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg"} alt={chat.name} className="w-10 h-10 rounded-full" />
                    <p className="ml-3 text-lg font-bold text-gray-900">{chat.name}</p>
                </div>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {chat.messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{message.sender}</span>
                            <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        {message.type === 'text' ? (
                            <p className="text-gray-700">{message.content}</p>
                        ) : message.type === 'file' ? (
                            <a
                                href={message.content}
                                download
                                className="text-blue-500 underline"
                            >
                                Download File
                            </a>
                        ) : (
                            <img src={message.content} alt="Sent image" className="mt-2 rounded-lg max-w-xs" />
                        )}
                        {/* Like và xem ai đã xem */}
                        <div className="flex items-center mt-2">
                            <div className="flex items-center space-x-1">
                                {message.likes?.map((like, i) => (
                                    <span key={i} className="text-sm">
                                        {like.emoji}
                                    </span>
                                ))}
                            </div>
                            <span className="mx-2 text-gray-300">|</span>
                            <button
                                onClick={() => {
                                    if (!message.seenBy) message.seenBy = [];
                                    if (!message.seenBy.includes('You')) {
                                        message.seenBy.push('You');
                                    }
                                }}
                                className="text-sm text-gray-500 hover:text-blue-500"
                            >
                                Seen by {message.seenBy?.length || 0}
                            </button>
                        </div>
                        {/* Danh sách emoji để thả */}
                        <div className="flex items-center mt-2 space-x-1">
                            {['👍', '❤️', '😂', '😮', '😢', '👏'].map((emoji, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleDropEmoji(index, emoji)}
                                    className="text-sm hover:scale-110 transition-transform"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input và các nút chức năng */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                    {/* Nút chọn emoji */}
                    <button
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="p-2 text-gray-500 hover:text-blue-500"
                    >
                        <FaSmile size={20} />
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-16">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    {/* Nút chọn file */}
                    <label className="p-2 text-gray-500 hover:text-blue-500 cursor-pointer">
                        <FaPaperclip size={20} />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Input nhập tin nhắn */}
                    <input
                        type="text"
                        placeholder="Say Something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 p-2 mx-2"
                    />

                    {/* Nút gửi */}
                    <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatDetails;