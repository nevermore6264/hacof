/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/chat/ChatClient.tsx
"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useAuth } from "@/hooks/useAuth_v0";
import { User as BaseUser } from "@/types/entities/user";
import { toast } from "sonner";
import { useWebSocket } from '@/contexts/WebSocketContext';

// Dynamic imports to avoid hydration issues
const ChatList = dynamic(() => import("./ChatList"), { ssr: false });
const ChatDetails = dynamic(() => import("./ChatDetails"), { ssr: false });
const CreateChatModal = dynamic(() => import("./CreateChatModal"), { ssr: false });

interface ChatUser extends BaseUser {
  name: string;
  image: string;
}

interface ConversationUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
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

interface ChatListItem {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isUnread: boolean;
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

export default function ChatClient() {
  const [mounted, setMounted] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatListItems, setChatListItems] = useState<ChatListItem[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const { user } = useAuth();
  const { client, isConnected } = useWebSocket();

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        const userId = user?.id;
        const response = await fetch(`/api/chats?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const res = await response.json();
          setChats(res?.data);
          // Convert Chat[] to ChatListItem[]
          const items: ChatListItem[] = res?.data.map((chat: Chat) => ({
            id: parseInt(chat.id),
            name: chat.name,
            avatarUrl: chat.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg",
            lastMessage: chat.messages[chat.messages.length - 1]?.content,
            lastMessageTime: chat.messages[chat.messages.length - 1]?.createdAt,
            isUnread: false // Thêm trường isUnread
          }));
          setChatListItems(items);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch chats");
        }
      } catch {
        toast.error("An error occurred while fetching chats");
      }
    };

    fetchChats();
  }, [user?.id]);

  // Subscribe to chat messages when connected
  useEffect(() => {
    if (!client || !isConnected || !selectedChatId) {
      console.log('Cannot subscribe:', { client: !!client, isConnected, selectedChatId });
      return;
    }

    const subscriptionTopic = `/topic/conversations/${selectedChatId}`;
    console.log('Subscribing to:', subscriptionTopic);

    const subscription = client.subscribe(
      subscriptionTopic,
      (message: { body: string }) => {
        console.log('Received message on topic:', subscriptionTopic);
        console.log('Raw message:', message);
        try {
          const messageData = JSON.parse(message.body);
          console.log('Parsed message data:', messageData);

          // Decode message content
          const decodedMessage = {
            ...messageData,
            content: decodeURIComponent(messageData.content)
          };

          // Update chats state
          setChats(prevChats => {
            return prevChats.map(chat => {
              if (chat.id === selectedChatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, decodedMessage]
                };
              }
              return chat;
            });
          });

          // Update chatListItems state
          setChatListItems(prevItems => {
            return prevItems.map(item => {
              if (item.id.toString() === selectedChatId) {
                return {
                  ...item,
                  lastMessage: decodedMessage.fileUrls?.length > 0
                    ? "Sent an attachment"
                    : decodedMessage.content,
                  lastMessageTime: decodedMessage.createdAt,
                  isUnread: false
                };
              }
              return item;
            });
          });
        } catch (error) {
          console.error('Error processing message:', error);
          toast.error('Error processing message');
        }
      }
    );

    return () => {
      console.log('Unsubscribing from:', subscriptionTopic);
      subscription.unsubscribe();
    };
  }, [client, isConnected, selectedChatId]);

  // Send message through WebSocket
  const sendMessage = async (content: string, messageData?: any) => {
    if (!client || !isConnected || !selectedChatId || !user?.username) {
      toast.error('Cannot send message: Missing required information');
      return;
    }

    try {
      const messageBody = {
        content: encodeURIComponent(content),
        fileUrls: messageData?.fileUrls || [],
      };

      console.log('Before sending - Check connection status:', {
        clientExists: !!client,
        isConnected,
        selectedChatId,
        username: user?.username
      });

      const destination = `/app/chat/${selectedChatId}/${user.username}`;

      // 1. Gửi message qua WebSocket
      client.publish({
        destination: destination,
        body: JSON.stringify(messageBody)
      });

      // 2. Sau đó gọi API để lưu message
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/messages/${selectedChatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content, // Gửi content gốc, không encode
          fileUrls: messageData?.fileUrls || [],
        })
      });
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to save message');
      }

      const savedMessage = await response.json();
      console.log('Message saved successfully:', savedMessage);

    } catch (error) {
      console.error('Error sending/saving message:', error);
      toast.error('Failed to save message. The message was sent but may not persist.');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!client || !isConnected || !selectedChatId || !user?.username) {
      toast.error('Cannot upload file: Missing required information');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.url;

        const messageBody = {
          content: `Sent a file: ${file.name}`,
          fileUrls: [fileUrl],
          createdByUserName: user.username
        };

        console.log('Sending file message with body:', messageBody); // Debug log

        client.publish({
          destination: `/app/chat/${selectedChatId}`,
          body: JSON.stringify(messageBody)
        });
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  // Hàm tạo cuộc hội thoại mới bằng API - CHỈ CÒN SINGLE CHAT
  const handleCreateChat = async (selectedUser: any) => {
    try {
      if (selectedUser.id === user?.id) {
        toast.error("You cannot create a conversation with yourself");
        return;
      }

      const response = await fetch("/api/chats/single", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ data: { userId: selectedUser.id } }),
      });

      if (response.ok) {
        const res = await response.json();
        const newChat = res.data; // Lấy data từ response

        // Cập nhật chats
        setChats(prevChats => [...prevChats, newChat]);

        // Cập nhật chatListItems
        setChatListItems(prevItems => {
          const newChatListItem: ChatListItem = {
            id: parseInt(newChat.id),
            name: newChat.name,
            avatarUrl: newChat.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg",
            lastMessage: newChat.messages?.[newChat.messages.length - 1]?.content,
            lastMessageTime: newChat.messages?.[newChat.messages.length - 1]?.createdAt,
            isUnread: false
          };
          return [...prevItems, newChatListItem];
        });

        setIsCreateChatModalOpen(false);
        toast.success("Chat created successfully");
      } else {
        const errorData = await response.json();
        console.error('Chat creation failed:', errorData);
        toast.error(errorData.message || "Failed to create chat");
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error("An error occurred while creating the chat. Please try again.");
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
          const res = await response.json();
          setUsers(res);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch users");
        }
      } catch {
        toast.error("An error occurred while fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleReaction = async (messageId: string, reactionType: string) => {
    if (!client || !isConnected || !selectedChatId || !user?.username) {
      toast.error('Cannot send reaction: Missing required information');
      return;
    }

    try {
      const reactionBody = {
        messageId: parseInt(messageId),
        reactionType: reactionType,
        createdByUserName: user.username
      };

      console.log('Sending reaction with body:', reactionBody); // Debug log

      client.publish({
        destination: `/app/reactions/${parseInt(messageId)}`,
        body: JSON.stringify(reactionBody)
      });
    } catch (error) {
      toast.error('Failed to send reaction');
    }
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex bg-gray-100 h-[calc(100vh-475px)]" suppressHydrationWarning>
      {/* Left Side - Chat List */}
      <ChatList
        chats={chatListItems}
        onChatSelect={(id) => setSelectedChatId(id.toString())}
        onCreateNewChat={handleOpenCreateChatModal}
      />

      {/* Right Side - Chat Details */}
      {selectedChatId ? (
        <ChatDetails
          chatId={selectedChatId}
          chats={chats}
          onSendMessage={sendMessage}
          onReaction={handleReaction}
        />
      ) : (
        <div className="w-2/3 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}

      {/* Modal tạo cuộc hội thoại mới */}
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={handleCloseCreateChatModal}
        onCreateChat={(user) => handleCreateChat(user)}
        users={users}
      />
    </div>
  );
}
