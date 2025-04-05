// app/chat/ChatClient.tsx
"use client";
import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatDetails from "./ChatDetails";
import CreateChatModal from "./CreateChatModal";
import { useAuth } from "@/hooks/useAuth_v0";

interface User {
  id: number;
  name: string;
  image: string;
}

interface Message {
  sender: string;
  time: string;
  content: string;
  type: "text" | "image";
}

interface Chat {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
  isGroup?: boolean;
  participants?: User[];
}

export default function ChatClient() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        console.log("có vô đây ko")

        const userId = user?.id;
        const response = await fetch(`/api/chats?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error("Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.id]);

  // Hàm tạo cuộc hội thoại mới bằng API
  const handleCreateChat = async (
    selectedUsers: { id: number; name: string; image: string }[]
  ) => {
    const isGroup = selectedUsers.length > 1;

    try {
      const userIds = selectedUsers.map((user) => user.id);
      const endpoint = isGroup
        ? "/api/chats/group"
        : "/api/chats/single"; // Phân biệt endpoint

      const response = await fetch(endpoint, {
        // 👈 Gọi endpoint khác nhau
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ "userId": userIds[0] }),
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
    if (loading) {
      return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
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
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
