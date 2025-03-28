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
        {
            id: 2,
            name: "Jane Cooper",
            image: "https://randomuser.me/api/portraits/men/11.jpg",
            lastMessage: "Haha that’s terrifying 😊",
            lastMessageTime: "07:38 am",
            messages: [
                { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊", type: "text" },
                { sender: "You", time: "07:40 am", content: "https://example.com/image.jpg", type: "image" },
            ],
        },
        {
            id: 3,
            name: "Floyd Miles",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            lastMessage: "perfect!",
            lastMessageTime: "11:49 pm",
            messages: [
                { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊", type: "text" },
                { sender: "You", time: "07:40 am", content: "https://example.com/image.jpg", type: "image" },
            ],
        },
        {
            id: 4,
            name: "Marvin McKinney",
            image: "https://randomuser.me/api/portraits/men/23.jpg",
            lastMessage: "omg, this is amazing...",
            lastMessageTime: "07:40 am",
            messages: [
                { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊", type: "text" },
                { sender: "You", time: "07:40 am", content: "https://example.com/image.jpg", type: "image" },
            ],
        },
        {
            id: 5,
            name: "Courtney Henry",
            image: "https://randomuser.me/api/portraits/men/55.jpg",
            lastMessage: "aww",
            lastMessageTime: "08:20 pm",
            messages: [
                { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊", type: "text" },
                { sender: "You", time: "07:40 am", content: "https://example.com/image.jpg", type: "image" },
            ],
        },
        {
            id: 6,
            name: "Dianne Russell",
            image: "https://randomuser.me/api/portraits/men/15.jpg",
            lastMessage: "I'll be there in 2 mins",
            lastMessageTime: "01:09 am",
            messages: [
                { sender: "Jane Cooper", time: "07:38 am", content: "Haha that’s terrifying 😊", type: "text" },
                { sender: "You", time: "07:40 am", content: "https://example.com/image.jpg", type: "image" },
            ],
        },
    ]);

    // Danh sách người dùng có sẵn
    const [users, setUsers] = useState([]); // Danh sách người dùng

    // Hàm tạo cuộc hội thoại mới bằng API
    const handleCreateChat = async (selectedUsers: { id: number; name: string; image: string }[]) => {
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOlsiQURNSU4iXSwidXNlcl9pZCI6MSwicGVybWlzc2lvbnMiOlsiR0VUX0JMT0dQT1NUIiwiREVMRVRFX0JMT0dQT1NUIiwiQ1JFQVRFX1JFU09VUkNFIiwiQVNTSUdOX0pVREdFX1RPX1JPVU5EIiwiQ1JFQVRFX0hBQ0tBVEhPTiIsIkNSRUFURV9VU0VSIiwiVVBEQVRFX01ZX0lORk8iLCJHRVRfQkxPR0NPTU1FTlQiLCJHRVRfRk9SVU1DT01NRU5UIiwiR0VUX0NBTVBVU0VTIiwiR0VUX1JPTEVfRlJPTV9UT0tFTiIsIkRFTEVURV9CTE9HQ09NTUVOVCIsIkdFVF9VU0VSIiwiREVMRVRFX1JPVU5EIiwiR0VUX1BST0ZJTEUiLCJVUERBVEVfQ0FNUFVTIiwiQ1JFQVRFX0ZPUlVNQ09NTUVOVCIsIkdFVF9QUk9GSUxFUyIsIlVQREFURV9GT1JVTUNPTU1FTlQiLCJBU1NJR05fSlVER0VTX0FORF9NRU5UT1JTIiwiQ1JFQVRFX1BFUk1JU1NJT04iLCJDUkVBVEVfQ0FNUFVTIiwiREVMRVRFX1RBU0siLCJVUERBVEVfQkxPR0NPTU1FTlQiLCJERUxFVEVfRk9SVU1USFJFQUQiLCJHRVRfQ0FNUFVTIiwiR0VUX1JPTEVTIiwiR0VUX1BFUk1JU1NJT05TIiwiR0VUX0hBQ0tBVEhPTiIsIkNSRUFURV9QUk9GSUxFIiwiR0VUX0JMT0dDT01NRU5UU19CWV9QT1NUIiwiVVBMT0FEX0FWQVRBUiIsIkNSRUFURV9QQVNTV09SRCIsIkRFTEVURV9ST0xFIiwiVkVSSUZZX0VNQUlMIiwiR0VUX1VTRVJTIiwiR0VUX1RBU0tTIiwiR0VUX1BBU1NFRF9URUFNUyIsIkFERF9NRU1CRVJfVE9fVEVBTSIsIk1PVkVfVEFTSyIsIkRFTEVURV9QRVJNSVNTSU9OX0ZST01fUk9MRSIsIkNSRUFURV9GT1JVTVRIUkVBRCIsIkFTU0lHTl9NRU5UT1JfVE9fVEVBTSIsIlJFTU9WRV9NRU1CRVJfRlJPTV9URUFNIiwiQ1JFQVRFX1RBU0siLCJERUxFVEVfUkVTT1VSQ0UiLCJVUERBVEVfRk9SVU1USFJFQUQiLCJDUkVBVEVfSlVER0UiLCJDUkVBVEVfQkxPR1BPU1QiLCJBU1NJR05fVEFTS19UT19NRU1CRVIiLCJBU1NJR05fVEFTSyIsIkRFTEVURV9URUFNIiwiR0VUX0JMT0dQT1NUUyIsIkNSRUFURV9ST1VORCIsIkRFTEVURV9QRVJNSVNTSU9OIiwiVVBEQVRFX1JPTEUiLCJTRUFSQ0hfQ0FNUFVTRVMiLCJHRVRfUkVTT1VSQ0VTX0JZX1JPVU5EIiwiVVBEQVRFX1RBU0siLCJHRVRfUkVTT1VSQ0VTIiwiR0VUX1RBU0siLCJHRVRfUk9VTkQiLCJHRVRfSEFDS0FUSE9OUyIsIkFERF9FTUFJTCIsIlVQREFURV9SRVNPVVJDRSIsIlVQREFURV9IQUNLQVRIT04iLCJHRVRfVEVBTVMiLCJVUERBVEVfUFJPRklMRSIsIkdFVF9ST1VORFMiLCJHRVRfRk9SVU1USFJFQUQiLCJHRVRfTVlfSU5GTyIsIkRFTEVURV9IQUNLQVRIT04iLCJERUxFVEVfUFJPRklMRSIsIkdFVF9GT1JVTUNPTU1FTlRTX0JZX1RIUkVBRCIsIkdFVF9ST0xFIiwiREVMRVRFX1VTRVIiLCJVUERBVEVfUEVSTUlTU0lPTiIsIkdFVF9KVURHRV9OQU1FUyIsIlVQREFURV9CTE9HUE9TVCIsIkNSRUFURV9URUFNIiwiR0VUX0JMT0dDT01NRU5UUyIsIkRFTEVURV9DQU1QVVMiLCJDUkVBVEVfQkxPR0NPTU1FTlQiLCJDUkVBVEVfUk9MRSIsIkdFVF9QRVJNSVNTSU9OIiwiVVBEQVRFX1JPVU5EIiwiR0VUX0ZPUlVNVEhSRUFEUyIsIkdFVF9GT1JVTUNPTU1FTlRTIiwiVVBEQVRFX1RFQU0iLCJERUxFVEVfRk9SVU1DT01NRU5UIl0sImlzcyI6Im5kdGRvYW5oLmNvbSIsImV4cCI6MTc0MzE5MTQ3MCwiaWF0IjoxNzQzMTg3ODcwLCJqdGkiOiI1NDFiZjhhYS1kNDE4LTRkNDYtYjU0NC1jMzFmNTJkM2JiMjEifQ.LeIIR9U_uyrtscIL7FyKZPYYaZ075gJz42mZUOYYjTa2CWFaC63KVHj_-QsvtNWNbEJEyEHgoST3sdlnJKs4Tw";
        const isGroup = selectedUsers.length > 1;

        try {
            const userIds = selectedUsers.map((user) => user.id);
            const endpoint = isGroup ? '/api/chats/group' : '/api/chats/single'; // Phân biệt endpoint

            const response = await fetch(endpoint, { // 👈 Gọi endpoint khác nhau
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userIds }),
            });

            if (response.ok) {
                const newChat = await response.json();
                setChats([...chats, newChat]);
                setIsCreateChatModalOpen(false);
            } else {
                console.error("Failed to create chat");
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
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
            const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOlsiQURNSU4iXSwidXNlcl9pZCI6MSwicGVybWlzc2lvbnMiOlsiR0VUX0JMT0dQT1NUIiwiREVMRVRFX0JMT0dQT1NUIiwiQ1JFQVRFX1JFU09VUkNFIiwiQVNTSUdOX0pVREdFX1RPX1JPVU5EIiwiQ1JFQVRFX0hBQ0tBVEhPTiIsIkNSRUFURV9VU0VSIiwiVVBEQVRFX01ZX0lORk8iLCJHRVRfQkxPR0NPTU1FTlQiLCJHRVRfRk9SVU1DT01NRU5UIiwiR0VUX0NBTVBVU0VTIiwiR0VUX1JPTEVfRlJPTV9UT0tFTiIsIkRFTEVURV9CTE9HQ09NTUVOVCIsIkdFVF9VU0VSIiwiREVMRVRFX1JPVU5EIiwiR0VUX1BST0ZJTEUiLCJVUERBVEVfQ0FNUFVTIiwiQ1JFQVRFX0ZPUlVNQ09NTUVOVCIsIkdFVF9QUk9GSUxFUyIsIlVQREFURV9GT1JVTUNPTU1FTlQiLCJBU1NJR05fSlVER0VTX0FORF9NRU5UT1JTIiwiQ1JFQVRFX1BFUk1JU1NJT04iLCJDUkVBVEVfQ0FNUFVTIiwiREVMRVRFX1RBU0siLCJVUERBVEVfQkxPR0NPTU1FTlQiLCJERUxFVEVfRk9SVU1USFJFQUQiLCJHRVRfQ0FNUFVTIiwiR0VUX1JPTEVTIiwiR0VUX1BFUk1JU1NJT05TIiwiR0VUX0hBQ0tBVEhPTiIsIkNSRUFURV9QUk9GSUxFIiwiR0VUX0JMT0dDT01NRU5UU19CWV9QT1NUIiwiVVBMT0FEX0FWQVRBUiIsIkNSRUFURV9QQVNTV09SRCIsIkRFTEVURV9ST0xFIiwiVkVSSUZZX0VNQUlMIiwiR0VUX1VTRVJTIiwiR0VUX1RBU0tTIiwiR0VUX1BBU1NFRF9URUFNUyIsIkFERF9NRU1CRVJfVE9fVEVBTSIsIk1PVkVfVEFTSyIsIkRFTEVURV9QRVJNSVNTSU9OX0ZST01fUk9MRSIsIkNSRUFURV9GT1JVTVRIUkVBRCIsIkFTU0lHTl9NRU5UT1JfVE9fVEVBTSIsIlJFTU9WRV9NRU1CRVJfRlJPTV9URUFNIiwiQ1JFQVRFX1RBU0siLCJERUxFVEVfUkVTT1VSQ0UiLCJVUERBVEVfRk9SVU1USFJFQUQiLCJDUkVBVEVfSlVER0UiLCJDUkVBVEVfQkxPR1BPU1QiLCJBU1NJR05fVEFTS19UT19NRU1CRVIiLCJBU1NJR05fVEFTSyIsIkRFTEVURV9URUFNIiwiR0VUX0JMT0dQT1NUUyIsIkNSRUFURV9ST1VORCIsIkRFTEVURV9QRVJNSVNTSU9OIiwiVVBEQVRFX1JPTEUiLCJTRUFSQ0hfQ0FNUFVTRVMiLCJHRVRfUkVTT1VSQ0VTX0JZX1JPVU5EIiwiVVBEQVRFX1RBU0siLCJHRVRfUkVTT1VSQ0VTIiwiR0VUX1RBU0siLCJHRVRfUk9VTkQiLCJHRVRfSEFDS0FUSE9OUyIsIkFERF9FTUFJTCIsIlVQREFURV9SRVNPVVJDRSIsIlVQREFURV9IQUNLQVRIT04iLCJHRVRfVEVBTVMiLCJVUERBVEVfUFJPRklMRSIsIkdFVF9ST1VORFMiLCJHRVRfRk9SVU1USFJFQUQiLCJHRVRfTVlfSU5GTyIsIkRFTEVURV9IQUNLQVRIT04iLCJERUxFVEVfUFJPRklMRSIsIkdFVF9GT1JVTUNPTU1FTlRTX0JZX1RIUkVBRCIsIkdFVF9ST0xFIiwiREVMRVRFX1VTRVIiLCJVUERBVEVfUEVSTUlTU0lPTiIsIkdFVF9KVURHRV9OQU1FUyIsIlVQREFURV9CTE9HUE9TVCIsIkNSRUFURV9URUFNIiwiR0VUX0JMT0dDT01NRU5UUyIsIkRFTEVURV9DQU1QVVMiLCJDUkVBVEVfQkxPR0NPTU1FTlQiLCJDUkVBVEVfUk9MRSIsIkdFVF9QRVJNSVNTSU9OIiwiVVBEQVRFX1JPVU5EIiwiR0VUX0ZPUlVNVEhSRUFEUyIsIkdFVF9GT1JVTUNPTU1FTlRTIiwiVVBEQVRFX1RFQU0iLCJERUxFVEVfRk9SVU1DT01NRU5UIl0sImlzcyI6Im5kdGRvYW5oLmNvbSIsImV4cCI6MTc0MzE5MTQ3MCwiaWF0IjoxNzQzMTg3ODcwLCJqdGkiOiI1NDFiZjhhYS1kNDE4LTRkNDYtYjU0NC1jMzFmNTJkM2JiMjEifQ.LeIIR9U_uyrtscIL7FyKZPYYaZ075gJz42mZUOYYjTa2CWFaC63KVHj_-QsvtNWNbEJEyEHgoST3sdlnJKs4Tw";
            try {
                const response = await fetch('/api/user', {
                    headers: {
                        // Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử token được lưu trong localStorage
                        Authorization: `Bearer ${token}`,
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