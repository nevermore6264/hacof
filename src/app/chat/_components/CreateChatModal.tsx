// app/_components/CreateChatModal.tsx
'use client';
import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    image: string;
}

interface CreateChatModalProps {
    isOpen: boolean; // Trạng thái mở/đóng modal
    onClose: () => void; // Hàm đóng modal
    onCreateChat: (users: User[]) => void; // Hàm tạo chat mới với danh sách người dùng
    users: User[]; // Danh sách người dùng có sẵn
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onCreateChat, users }) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // Danh sách người dùng được chọn

    const handleUserSelect = (user: User) => {
        // Kiểm tra xem người dùng đã được chọn chưa
        if (selectedUsers.some((u) => u.id === user.id)) {
            // Nếu đã chọn, bỏ chọn
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            // Nếu chưa chọn, thêm vào danh sách
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleSubmit = () => {
        if (selectedUsers.length > 0) {
            onCreateChat(selectedUsers); // Gọi hàm tạo chat với danh sách người dùng
            setSelectedUsers([]); // Reset danh sách
            onClose(); // Đóng modal
        }
    };

    if (!isOpen) return null; // Không hiển thị nếu modal đóng

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Add Users to Chat</h2>
                <div className="mb-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-2 cursor-pointer ${selectedUsers.some((u) => u.id === user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
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
                        type="button"
                        onClick={onClose}
                        className="mr-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        disabled={selectedUsers.length === 0} // Vô hiệu hóa nút nếu không có người dùng nào được chọn
                    >
                        Create Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateChatModal;