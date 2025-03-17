import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import PNavbar from "./PNavbar.jsx";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiverId, setReceiverId] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (receiverId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [receiverId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/chat/messages/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/chat/send",
                { receiver_id: receiverId, message: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNewMessage("");
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div dir="rtl" className="min-h-screen flex flex-col">
            <PNavbar />
            <div className="container mx-auto bg-white shadow-lg rounded-lg flex flex-grow">
                {/* قائمة الدردشات */}
                <div className="w-1/3 border-r border-gray-300 p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">الدردشات</h3>
                    {/* قائمة المستخدمين */}
                    <ul className="space-y-4">
                        <li onClick={() => setReceiverId(1)} className="cursor-pointer border-b pb-2">
                            <h4 className="font-bold text-gray-700">وزارة الصحة</h4>
                        </li>
                        <li onClick={() => setReceiverId(2)} className="cursor-pointer border-b pb-2">
                            <h4 className="font-bold text-gray-700">مزود الخدمات</h4>
                        </li>
                    </ul>
                </div>

                {/* نافذة المحادثة */}
                <div className="w-2/3 p-4 flex flex-col">
                    <div className="border-b pb-4 mb-4">
                        <h3 className="text-lg font-bold text-gray-700">المحادثة</h3>
                    </div>
                    <div className="flex flex-col space-y-4 mb-4 overflow-y-auto flex-grow">
                        {messages.map((msg, index) => (
                            <div key={index} className={`max-w-sm px-4 py-2 rounded-lg ${msg.sender_id === receiverId ? "self-start bg-gray-200" : "self-end bg-cyan-500 text-white"}`}>
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="اكتب رسالتك هنا..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button onClick={sendMessage} className="bg-cyan-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-cyan-600 transition">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
