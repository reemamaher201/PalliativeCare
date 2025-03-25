import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./comp/Header.jsx";
import Sidebar from "./comp/Sidebar.jsx";

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const users = await getChatUsers();
            setUsers(users);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (receiverId) {
            const fetchMessages = async () => {
                setIsLoading(true);
                const messages = await getMessages(receiverId);
                setMessages(messages);
                setIsLoading(false);
            };
            fetchMessages();
        }
    }, [receiverId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim() && receiverId) {
            setIsLoading(true);
            await sendMessage(receiverId, message);
            setMessage("");
            const updatedMessages = await getMessages(receiverId);
            setMessages(updatedMessages);
            setIsLoading(false);
        }
    };

    const sendMessage = async (receiverId, message) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://127.0.0.1:8000/api/send-message',
                { receiver_id: receiverId, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('خطأ في إرسال الرسالة:', error);
            setError("حدث خطأ أثناء إرسال الرسالة.");
        }
    };

    const getMessages = async (receiverId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/get-messages/${receiverId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.messages;
        } catch (error) {
            console.error('خطأ في جلب الرسائل:', error);
            setError("حدث خطأ أثناء جلب الرسائل.");
            return [];
        }
    };

    const getChatUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://127.0.0.1:8000/api/get-chat-users',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.users;
        } catch (error) {
            console.error('خطأ في جلب المستخدمين:', error);
            setError("حدث خطأ أثناء جلب المستخدمين.");
            return [];
        }
    };

    return (
        <div dir="rtl" className="min-h-screen flex flex-col">

            <div className="flex flex-grow"><Sidebar/>

                <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 shadow-md">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">الدردشات</h3>

                    <div className="relative">

                        <input
                            type="text"
                            placeholder="بحث"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 mb-4 pl-10"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <ul className="space-y-3 overflow-y-auto mt-2">

                        {users.map((user) => (
                            <li
                                key={user.id}
                                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${receiverId === user.id ? "bg-cyan-100" : ""}`}
                                onClick={() => setReceiverId(user.id)}
                            >
                                <div className="flex items-center relative">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center overflow-hidden">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-semibold text-gray-700">{user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                                        <p className="text-sm text-gray-500">{user.user_type === 0 ? "وزارة" : user.user_type === 1 ? "مزود" : "مريض"}</p>
                                    </div>
                                    <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                                </div>
                            </li>
                        ))}
                        {users.length === 0 && (<li className="text-center">لا يوجد محادثات</li>)}
                    </ul>
                </div>
                <div className="w-3/4 p-4 flex flex-col">

                    <div className="border-b pb-4 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {receiverId ? users.find((user) => user.id === receiverId)?.name : "اختر محادثة"}
                        </h3>
                    </div>
                    <div className="flex flex-col space-y-3 mb-4 overflow-y-auto flex-grow">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-sm rounded-xl p-3 ${msg.sender_id === receiverId ? "bg-gray-100 self-start" : "bg-cyan-500 text-white self-end"}`}
                                style={{ maxWidth: "70%" }}
                            >
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="اكتب رسالتك هنا..."
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-cyan-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-cyan-600"
                        >
                            إرسال
                        </button>
                    </div>
                    {isLoading && <div className="text-center mt-4">جاري التحميل...</div>}
                    {error && <div className="text-red-500 text-center mt-4">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;