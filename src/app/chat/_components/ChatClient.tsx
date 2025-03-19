// app/chat/ChatClient.tsx
'use client';
import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatDetails from './ChatDetails';
import CreateChatModal from './CreateChatModal';

export default function ChatClient() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false); // Trạng thái modal

    const [chats, setChats] = useState([
        // Danh sách chat ban đầu
        {
            id: 1,
            name: "Cody Fisher",
            image: "https://randomuser.me/api/portraits/men/49.jpg",
            lastMessage: "Haha oh man",
            lastMessageTime: "05:14 pm",
            messages: [
                { sender: "Cody Fisher", time: "05:14 pm", content: "Haha oh man", type: "text" },
                { sender: "You", time: "05:15 pm", content: "What's up?", type: "text" },
            ],
        },
        // Thêm các chat khác...
    ]);

    // Danh sách người dùng có sẵn
    const [users, setUsers] = useState([]); // Danh sách người dùng

    // Hàm tạo cuộc hội thoại mới
    const handleCreateChat = (selectedUsers: { id: number; name: string; image: string }[]) => {
        const isGroup = selectedUsers.length > 1; // Nếu nhiều hơn 1 người thì là chat nhóm
        const chatName = isGroup
            ? selectedUsers.map((user) => user.name).join(', ') // Tên nhóm là danh sách tên người dùng
            : selectedUsers[0].name; // Tên chat 1-1 là tên người dùng

        const newChat = {
            id: chats.length + 1, // Tạo ID mới
            name: chatName,
            image: isGroup
                ? "https://randomuser.me/api/portraits/men/99.jpg" // Ảnh mặc định cho nhóm
                : selectedUsers[0].image, // Ảnh của người dùng trong chat 1-1
            lastMessage: "No messages yet",
            lastMessageTime: new Date().toLocaleTimeString(),
            messages: [],
        };
        setChats([...chats, newChat]); // Thêm chat mới vào danh sách
    };

    // Hàm mở modal
    const handleOpenCreateChatModal = () => {
        setIsCreateChatModalOpen(true);
    };

    // Hàm đóng modal
    const handleCloseCreateChatModal = () => {
        setIsCreateChatModalOpen(false);
    };

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử token được lưu trong localStorage
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side - Chat List */}
            <ChatList
                chats={chats}
                onChatSelect={setSelectedChatId}
                onCreateNewChat={handleOpenCreateChatModal}
            />

            {/* Right Side - Chat Details */}
            {selectedChatId ? (
                <ChatDetails chatId={selectedChatId} chats={chats} />
            ) : (
                <div className="w-2/3 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Select a chat to start messaging</p>
                </div>
            )}

            {/* Modal tạo cuộc hội thoại mới */}
            <CreateChatModal
                isOpen={isCreateChatModalOpen}
                onClose={handleCloseCreateChatModal}
                onCreateChat={handleCreateChat}
                users={users}
            />
        </div>
    );
}