/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { FaPaperclip, FaSmile } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ConversationUser {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    // ... các trường khác
}

interface Message {
    id: string;
    conversationId: string;
    content: string;
    fileUrls: string[];
    reactions: any[]; // Có thể định nghĩa cụ thể hơn
    createdAt: string;
    updatedAt: string;
    createdByUserName: string;
    deleted: boolean;
}

interface Chat {
    id: string;
    type: string;
    name: string;
    avatarUrl: string | null;
    conversationUsers: ConversationUser[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    createdByUserName: string;
}

interface ChatDetailsProps {
    chatId: string; // Đổi từ number sang string để phù hợp với dữ liệu
    chats: Chat[];
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatId, chats }) => {
    const chat = chats.find((chat) => chat.id === chatId);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    if (!chat) {
        return (
            <div className="w-2/3 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No chat selected</p>
            </div>
        );
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getSenderName = (username: string) => {
        const user = chat.conversationUsers.find(u =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(username.toLowerCase())
        );
        return user ? `${user.firstName} ${user.lastName}` : username;
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
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
                    // Thêm tin nhắn mới vào danh sách theo cấu trúc backend
                    chat.messages.push({
                        id: newMessage.data.id,
                        conversationId: chatId,
                        content: message,
                        fileUrls: [],
                        reactions: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdByUserName: "currentUser", // Thay bằng username thực tế
                        deleted: false
                    });

                    setMessage('');
                    setFile(null);
                    setShowEmojiPicker(false);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleReaction = (messageId: string, emoji: string) => {
        const message = chat.messages.find(m => m.id === messageId);
        if (message) {
            const existingReaction = message.reactions.find(r => r.user === "currentUser");
            if (existingReaction) {
                existingReaction.emoji = emoji;
            } else {
                message.reactions.push({
                    emoji,
                    user: "currentUser",
                    createdAt: new Date().toISOString()
                });
            }
        }
    };

    return (
        <div className="w-2/3 flex flex-col" style={{ height: '500px' }}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <img
                        src={chat.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg"}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                        <p className="text-lg font-bold text-gray-900">{chat.name}</p>
                        <p className="text-sm text-gray-500">
                            {chat.conversationUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {chat.messages.map((message) => (
                    <div key={message.id} className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">
                                {getSenderName(message.createdByUserName)}
                            </span>
                            <span className="text-sm text-gray-500">
                                {formatTime(message.createdAt)}
                            </span>
                        </div>

                        {message.fileUrls?.length > 0 ? (
                            message.fileUrls.map((fileUrl, index) => (
                                <div key={index} className="mt-2">
                                    {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                        <img src={fileUrl} alt="Attachment" className="rounded-lg max-w-xs" />
                                    ) : (
                                        <a
                                            href={fileUrl}
                                            download
                                            className="text-blue-500 underline"
                                        >
                                            Download File
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-700">{message.content}</p>
                        )}

                        {/* Reactions */}
                        {message.reactions?.length > 0 && (
                            <div className="flex items-center mt-2 space-x-1">
                                {message.reactions.map((reaction, i) => (
                                    <span key={i} className="text-sm">
                                        {reaction.emoji}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Reaction buttons */}
                        <div className="flex items-center mt-2 space-x-1">
                            {['👍', '❤️', '😂', '😮', '😢', '👏'].map((emoji, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleReaction(message.id, emoji)}
                                    className="text-sm hover:scale-110 transition-transform"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input message */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
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

                    <label className="p-2 text-gray-500 hover:text-blue-500 cursor-pointer">
                        <FaPaperclip size={20} />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <input
                        type="text"
                        placeholder="Say Something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 rounded-lg border border-gray-300 p-2 mx-2"
                    />

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