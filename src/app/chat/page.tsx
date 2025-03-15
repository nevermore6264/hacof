// src/app/chat/page.tsx
import { Metadata } from "next";
import ChatList from './_components/ChatList';

export const metadata: Metadata = {
  title: "Chat Page",
  description: "This is the chat page where users can communicate.",
};

export default function ChatPage() {
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
      <ChatList chats={chats} />

      {/* Right Side - Chat Details */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
            <p className="ml-3 text-lg font-bold text-gray-900">Cody Fisher</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{message.sender}</span>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Say Something..."
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>
      </div>
    </div>
  );
}