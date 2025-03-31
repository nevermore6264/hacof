// app/chat/ChatClient.tsx
"use client";
import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatDetails from "./ChatDetails";
import CreateChatModal from "./CreateChatModal";

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
        {
          sender: "Cody Fisher",
          time: "05:14 pm",
          content: "Haha oh man",
          type: "text",
        },
        {
          sender: "You",
          time: "05:15 pm",
          content: "What's up?",
          type: "text",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Cooper",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      lastMessage: "Haha that’s terrifying 😊",
      lastMessageTime: "07:38 am",
      messages: [
        {
          sender: "Jane Cooper",
          time: "07:38 am",
          content: "Haha that’s terrifying 😊",
          type: "text",
        },
        {
          sender: "You",
          time: "07:40 am",
          content: "https://example.com/image.jpg",
          type: "image",
        },
      ],
    },
    {
      id: 3,
      name: "Floyd Miles",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      lastMessage: "perfect!",
      lastMessageTime: "11:49 pm",
      messages: [
        {
          sender: "Jane Cooper",
          time: "07:38 am",
          content: "Haha that’s terrifying 😊",
          type: "text",
        },
        {
          sender: "You",
          time: "07:40 am",
          content: "https://example.com/image.jpg",
          type: "image",
        },
      ],
    },
    {
      id: 4,
      name: "Marvin McKinney",
      image: "https://randomuser.me/api/portraits/men/23.jpg",
      lastMessage: "omg, this is amazing...",
      lastMessageTime: "07:40 am",
      messages: [
        {
          sender: "Jane Cooper",
          time: "07:38 am",
          content: "Haha that’s terrifying 😊",
          type: "text",
        },
        {
          sender: "You",
          time: "07:40 am",
          content: "https://example.com/image.jpg",
          type: "image",
        },
      ],
    },
    {
      id: 5,
      name: "Courtney Henry",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      lastMessage: "aww",
      lastMessageTime: "08:20 pm",
      messages: [
        {
          sender: "Jane Cooper",
          time: "07:38 am",
          content: "Haha that’s terrifying 😊",
          type: "text",
        },
        {
          sender: "You",
          time: "07:40 am",
          content: "https://example.com/image.jpg",
          type: "image",
        },
      ],
    },
    {
      id: 6,
      name: "Dianne Russell",
      image: "https://randomuser.me/api/portraits/men/15.jpg",
      lastMessage: "I'll be there in 2 mins",
      lastMessageTime: "01:09 am",
      messages: [
        {
          sender: "Jane Cooper",
          time: "07:38 am",
          content: "Haha that’s terrifying 😊",
          type: "text",
        },
        {
          sender: "You",
          time: "07:40 am",
          content: "https://example.com/image.jpg",
          type: "image",
        },
      ],
    },
  ]);

  // Danh sách người dùng có sẵn
  const [users, setUsers] = useState([]); // Danh sách người dùng

  // Hàm tạo cuộc hội thoại mới bằng API
  const handleCreateChat = async (
    selectedUsers: { id: number; name: string; image: string }[]
  ) => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOlsiQURNSU4iXSwidXNlcl9pZCI6MSwicGVybWlzc2lvbnMiOlsiREVMRVRFX0JMT0dQT1NUIiwiQVNTSUdOX0pVREdFX1RPX1JPVU5EIiwiQ1JFQVRFX0hBQ0tBVEhPTiIsIkRFTEVURV9GRUVEQkFDS19ERVRBSUwiLCJTRUFSQ0hfTE9HUyIsIkdFVF9GT1JVTUNPTU1FTlQiLCJHRVRfQ0FNUFVTRVMiLCJHRVRfUk9MRV9GUk9NX1RPS0VOIiwiREVMRVRFX0JMT0dDT01NRU5UIiwiR0VUX1VTRVIiLCJERUxFVEVfUk9VTkQiLCJHRVRfUFJPRklMRSIsIlVQREFURV9DQU1QVVMiLCJBU1NJR05fSlVER0VTX0FORF9NRU5UT1JTIiwiVVBEQVRFX0JMT0dDT01NRU5UIiwiREVMRVRFX0ZPUlVNVEhSRUFEIiwiR0VUX0NBTVBVUyIsIkdFVF9GRUVEQkFDS19ERVRBSUxTX0JZX0hBQ0tBVEhPTiIsIkdFVF9IQUNLQVRIT04iLCJDUkVBVEVfUFJPRklMRSIsIkdFVF9MT0dTIiwiR0VUX0ZFRURCQUNLU19CWV9URUFNIiwiQ1JFQVRFX1BBU1NXT1JEIiwiQ1JFQVRFX0ZFRURCQUNLIiwiVkVSSUZZX0VNQUlMIiwiR0VUX1BBU1NFRF9URUFNUyIsIkdFVF9UQVNLUyIsIkRFTEVURV9QRVJNSVNTSU9OX0ZST01fUk9MRSIsIkFTU0lHTl9NRU5UT1JfVE9fVEVBTSIsIkdFVF9GRUVEQkFDS1NfQllfTUVOVE9SIiwiR0VUX1VTRVJfREVWSUNFX1RSQUNLUyIsIkNSRUFURV9UQVNLIiwiR0VUX0JMT0dfUE9TVFMiLCJERUxFVEVfUkVTT1VSQ0UiLCJVUERBVEVfRk9SVU1USFJFQUQiLCJDUkVBVEVfQkxPR1BPU1QiLCJBU1NJR05fVEFTSyIsIkFTU0lHTl9UQVNLX1RPX01FTUJFUiIsIkRFTEVURV9URUFNIiwiQ0hBTkdFX1BBU1NXT1JEIiwiR0VUX0JMT0dQT1NUUyIsIkdFVF9SRVNPVVJDRVMiLCJVUERBVEVfQkxPR19QT1NUIiwiQ1JFQVRFX0JMT0dfUE9TVCIsIkFERF9FTUFJTCIsIlJFSkVDVF9CTE9HX1BPU1QiLCJVUERBVEVfUkVTT1VSQ0UiLCJVUERBVEVfSEFDS0FUSE9OIiwiR0VUX1RFQU1TIiwiQVNTSUdOX0RFVklDRSIsIkdFVF9ERVZJQ0UiLCJHRVRfUk9VTkRTIiwiVVBEQVRFX1BST0ZJTEUiLCJERUxFVEVfSEFDS0FUSE9OIiwiR0VUX0ZFRURCQUNLUyIsIlVQREFURV9QRVJNSVNTSU9OIiwiR0VUX0pVREdFX05BTUVTIiwiVVBEQVRFX0JMT0dQT1NUIiwiQ1JFQVRFX1RFQU0iLCJVUERBVEVfREVWSUNFIiwiQ1JFQVRFX1JPTEUiLCJHRVRfUEVSTUlTU0lPTiIsIlVQREFURV9ST1VORCIsIlNVQk1JVF9CTE9HX1BPU1QiLCJERUxFVEVfRk9SVU1DT01NRU5UIiwiR0VUX0JMT0dQT1NUIiwiR0VUX0ZFRURCQUNLX0RFVEFJTFNfQllfRkVFREJBQ0siLCJDUkVBVEVfUkVTT1VSQ0UiLCJDUkVBVEVfVVNFUiIsIlVQREFURV9NWV9JTkZPIiwiR0VUX0JMT0dDT01NRU5UIiwiR0VUX1VTRVJfREVWSUNFIiwiR0VUX0ZFRURCQUNLU19CWV9IQUNLQVRIT04iLCJHRVRfVVNFUl9ERVZJQ0VTIiwiREVMRVRFX0RFVklDRSIsIkNSRUFURV9GT1JVTUNPTU1FTlQiLCJVUERBVEVfRk9SVU1DT01NRU5UIiwiR0VUX1BST0ZJTEVTIiwiQ1JFQVRFX1BFUk1JU1NJT04iLCJDUkVBVEVfQ0FNUFVTIiwiREVMRVRFX1RBU0siLCJHRVRfUk9MRVMiLCJHRVRfUEVSTUlTU0lPTlMiLCJVUExPQURfQVZBVEFSIiwiR0VUX0JMT0dDT01NRU5UU19CWV9QT1NUIiwiREVMRVRFX1JPTEUiLCJHRVRfREVWSUNFUyIsIkdFVF9VU0VSUyIsIkFERF9NRU1CRVJfVE9fVEVBTSIsIlVQREFURV9GRUVEQkFDS19ERVRBSUwiLCJNT1ZFX1RBU0siLCJDUkVBVEVfRk9SVU1USFJFQUQiLCJSRU1PVkVfTUVNQkVSX0ZST01fVEVBTSIsIkdFVF9CTE9HX1BPU1QiLCJERUxFVEVfQkxPR19QT1NUIiwiQ1JFQVRFX0pVREdFIiwiQ1JFQVRFX1JPVU5EIiwiVVBEQVRFX1JPTEUiLCJDUkVBVEVfVVNFUl9ERVZJQ0VfVFJBQ0siLCJERUxFVEVfUEVSTUlTU0lPTiIsIkdFVF9GRUVEQkFDSyIsIkNSRUFURV9GRUVEQkFDS19ERVRBSUwiLCJTRUFSQ0hfQ0FNUFVTRVMiLCJHRVRfUkVTT1VSQ0VTX0JZX1JPVU5EIiwiVVBEQVRFX1RBU0siLCJHRVRfVEFTSyIsIkRFTEVURV9GRUVEQkFDSyIsIkdFVF9ST1VORCIsIkdFVF9IQUNLQVRIT05TIiwiR0VUX0ZPUlVNVEhSRUFEIiwiR0VUX0ZFRURCQUNLX0RFVEFJTCIsIkdFVF9NWV9JTkZPIiwiREVMRVRFX1BST0ZJTEUiLCJHRVRfRk9SVU1DT01NRU5UU19CWV9USFJFQUQiLCJERUxFVEVfVVNFUiIsIkdFVF9ST0xFIiwiQVBQUk9WRV9CTE9HX1BPU1QiLCJHRVRfQkxPR0NPTU1FTlRTIiwiREVMRVRFX0NBTVBVUyIsIkNSRUFURV9CTE9HQ09NTUVOVCIsIkdFVF9GRUVEQkFDS19ERVRBSUxTX0JZX01FTlRPUiIsIkNSRUFURV9ERVZJQ0UiLCJHRVRfRkVFREJBQ0tfREVUQUlMUyIsIkdFVF9GT1JVTVRIUkVBRFMiLCJHRVRfRk9SVU1DT01NRU5UUyIsIlVQREFURV9URUFNIiwiR0VUX0xPRyJdLCJpc3MiOiJuZHRkb2FuaC5jb20iLCJleHAiOjE3NDMzODM1MDcsImlhdCI6MTc0MzM3OTkwNywianRpIjoiNmJiNmYxZDAtZmJmOC00ZmQwLWE3OTMtYmYxMTc4Y2M0ZTZkIn0.8RRy-V5FHlu00Tj2iG0pxEAOQzun9Wq_5FlyoQt1086JEi6Kx_falf_kz1P7Y_hcpzTgETArKITM3kB96t2pkg";
    const isGroup = selectedUsers.length > 1;

    try {
      const userIds = selectedUsers.map((user) => user.id);
      const endpoint = isGroup ? "/api/chats/group" : "/api/chats/single"; // Phân biệt endpoint

      const response = await fetch(endpoint, {
        // 👈 Gọi endpoint khác nhau
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const token =
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOlsiQURNSU4iXSwidXNlcl9pZCI6MSwicGVybWlzc2lvbnMiOlsiREVMRVRFX0JMT0dQT1NUIiwiQVNTSUdOX0pVREdFX1RPX1JPVU5EIiwiQ1JFQVRFX0hBQ0tBVEhPTiIsIkRFTEVURV9GRUVEQkFDS19ERVRBSUwiLCJTRUFSQ0hfTE9HUyIsIkdFVF9GT1JVTUNPTU1FTlQiLCJHRVRfQ0FNUFVTRVMiLCJHRVRfUk9MRV9GUk9NX1RPS0VOIiwiREVMRVRFX0JMT0dDT01NRU5UIiwiR0VUX1VTRVIiLCJERUxFVEVfUk9VTkQiLCJHRVRfUFJPRklMRSIsIlVQREFURV9DQU1QVVMiLCJBU1NJR05fSlVER0VTX0FORF9NRU5UT1JTIiwiVVBEQVRFX0JMT0dDT01NRU5UIiwiREVMRVRFX0ZPUlVNVEhSRUFEIiwiR0VUX0NBTVBVUyIsIkdFVF9GRUVEQkFDS19ERVRBSUxTX0JZX0hBQ0tBVEhPTiIsIkNSRUFURV9QUk9GSUxFIiwiR0VUX0hBQ0tBVEhPTiIsIkdFVF9MT0dTIiwiR0VUX0ZFRURCQUNLU19CWV9URUFNIiwiQ1JFQVRFX1BBU1NXT1JEIiwiQ1JFQVRFX0ZFRURCQUNLIiwiVkVSSUZZX0VNQUlMIiwiR0VUX1RBU0tTIiwiR0VUX1BBU1NFRF9URUFNUyIsIkRFTEVURV9QRVJNSVNTSU9OX0ZST01fUk9MRSIsIkFTU0lHTl9NRU5UT1JfVE9fVEVBTSIsIkdFVF9VU0VSX0RFVklDRV9UUkFDS1MiLCJHRVRfRkVFREJBQ0tTX0JZX01FTlRPUiIsIkdFVF9CTE9HX1BPU1RTIiwiQ1JFQVRFX1RBU0siLCJERUxFVEVfUkVTT1VSQ0UiLCJVUERBVEVfRk9SVU1USFJFQUQiLCJDUkVBVEVfQkxPR1BPU1QiLCJBU1NJR05fVEFTSyIsIkFTU0lHTl9UQVNLX1RPX01FTUJFUiIsIkRFTEVURV9URUFNIiwiQ0hBTkdFX1BBU1NXT1JEIiwiR0VUX0JMT0dQT1NUUyIsIkdFVF9SRVNPVVJDRVMiLCJVUERBVEVfQkxPR19QT1NUIiwiQ1JFQVRFX0JMT0dfUE9TVCIsIkFERF9FTUFJTCIsIlJFSkVDVF9CTE9HX1BPU1QiLCJVUERBVEVfUkVTT1VSQ0UiLCJVUERBVEVfSEFDS0FUSE9OIiwiR0VUX1RFQU1TIiwiQVNTSUdOX0RFVklDRSIsIkdFVF9ERVZJQ0UiLCJVUERBVEVfUFJPRklMRSIsIkdFVF9ST1VORFMiLCJERUxFVEVfSEFDS0FUSE9OIiwiR0VUX0ZFRURCQUNLUyIsIlVQREFURV9QRVJNSVNTSU9OIiwiR0VUX0pVREdFX05BTUVTIiwiVVBEQVRFX0JMT0dQT1NUIiwiQ1JFQVRFX1RFQU0iLCJVUERBVEVfREVWSUNFIiwiQ1JFQVRFX1JPTEUiLCJVUERBVEVfUk9VTkQiLCJHRVRfUEVSTUlTU0lPTiIsIlNVQk1JVF9CTE9HX1BPU1QiLCJERUxFVEVfRk9SVU1DT01NRU5UIiwiR0VUX0JMT0dQT1NUIiwiQ1JFQVRFX1JFU09VUkNFIiwiR0VUX0ZFRURCQUNLX0RFVEFJTFNfQllfRkVFREJBQ0siLCJDUkVBVEVfVVNFUiIsIlVQREFURV9NWV9JTkZPIiwiR0VUX0JMT0dDT01NRU5UIiwiR0VUX1VTRVJfREVWSUNFIiwiR0VUX0ZFRURCQUNLU19CWV9IQUNLQVRIT04iLCJHRVRfVVNFUl9ERVZJQ0VTIiwiREVMRVRFX0RFVklDRSIsIkNSRUFURV9GT1JVTUNPTU1FTlQiLCJHRVRfUFJPRklMRVMiLCJVUERBVEVfRk9SVU1DT01NRU5UIiwiQ1JFQVRFX1BFUk1JU1NJT04iLCJDUkVBVEVfQ0FNUFVTIiwiREVMRVRFX1RBU0siLCJHRVRfUk9MRVMiLCJHRVRfUEVSTUlTU0lPTlMiLCJHRVRfQkxPR0NPTU1FTlRTX0JZX1BPU1QiLCJVUExPQURfQVZBVEFSIiwiREVMRVRFX1JPTEUiLCJHRVRfREVWSUNFUyIsIkdFVF9VU0VSUyIsIkFERF9NRU1CRVJfVE9fVEVBTSIsIk1PVkVfVEFTSyIsIlVQREFURV9GRUVEQkFDS19ERVRBSUwiLCJDUkVBVEVfRk9SVU1USFJFQUQiLCJSRU1PVkVfTUVNQkVSX0ZST01fVEVBTSIsIkdFVF9CTE9HX1BPU1QiLCJERUxFVEVfQkxPR19QT1NUIiwiQ1JFQVRFX0pVREdFIiwiQ1JFQVRFX1JPVU5EIiwiREVMRVRFX1BFUk1JU1NJT04iLCJDUkVBVEVfVVNFUl9ERVZJQ0VfVFJBQ0siLCJVUERBVEVfUk9MRSIsIkdFVF9GRUVEQkFDSyIsIkNSRUFURV9GRUVEQkFDS19ERVRBSUwiLCJTRUFSQ0hfQ0FNUFVTRVMiLCJVUERBVEVfVEFTSyIsIkdFVF9SRVNPVVJDRVNfQllfUk9VTkQiLCJHRVRfVEFTSyIsIkRFTEVURV9GRUVEQkFDSyIsIkdFVF9ST1VORCIsIkdFVF9IQUNLQVRIT05TIiwiR0VUX0ZPUlVNVEhSRUFEIiwiR0VUX0ZFRURCQUNLX0RFVEFJTCIsIkdFVF9NWV9JTkZPIiwiREVMRVRFX1BST0ZJTEUiLCJHRVRfRk9SVU1DT01NRU5UU19CWV9USFJFQUQiLCJERUxFVEVfVVNFUiIsIkdFVF9ST0xFIiwiQVBQUk9WRV9CTE9HX1BPU1QiLCJHRVRfQkxPR0NPTU1FTlRTIiwiREVMRVRFX0NBTVBVUyIsIkNSRUFURV9CTE9HQ09NTUVOVCIsIkdFVF9GRUVEQkFDS19ERVRBSUxTX0JZX01FTlRPUiIsIkNSRUFURV9ERVZJQ0UiLCJHRVRfRk9SVU1USFJFQURTIiwiR0VUX0ZFRURCQUNLX0RFVEFJTFMiLCJHRVRfRk9SVU1DT01NRU5UUyIsIlVQREFURV9URUFNIiwiR0VUX0xPRyJdLCJpc3MiOiJuZHRkb2FuaC5jb20iLCJleHAiOjE3NDM0MzQ0ODAsImlhdCI6MTc0MzQzMDg4MCwianRpIjoiNzEwOGY5MzItN2IxYS00YTBmLThkNmMtYTRmNWNmMTU2YTQyIn0.1GROOG8lzF4jYP3t5aCd583Ilf62f19yIv8FcJNY5AzQFjazx5IMm4pRtb09uwOYaUM70XHRmZTndmFa2GqnaA";
      try {
        const response = await fetch("/api/user", {
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
