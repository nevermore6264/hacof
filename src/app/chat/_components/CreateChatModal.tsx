/* eslint-disable @next/next/no-img-element */
// app/_components/CreateChatModal.tsx
'use client';
import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    image: string;
}
interface CreateChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateChat: (user: User) => void; // Thay đổi từ User[] thành User
    users: User[];
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onCreateChat, users }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Thay đổi từ User[] thành User | null

    const handleUserSelect = (user: User) => {
        setSelectedUser(user); // Chỉ chọn 1 user
    };

    const handleSubmit = () => {
        if (selectedUser) {
            onCreateChat(selectedUser); // Truyền 1 user thay vì mảng
            setSelectedUser(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Select User to Chat</h2>
                <div className="mb-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-2 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => handleUserSelect(user)}
                        >
                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                            <p className="ml-3 text-sm font-medium text-gray-900">{user.name}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        disabled={!selectedUser} // Vô hiệu hóa nếu chưa chọn user
                    >
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateChatModal;