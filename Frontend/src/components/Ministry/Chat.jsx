import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./comp/Header.jsx";
import Sidebar from "./comp/Sidebar.jsx";
import { BeatLoader } from 'react-spinners';
import Navbar from "../Patients/PNavbar.jsx";

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/user-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            } finally {
                setIsUserLoading(false); // إنهاء التحميل بعد جلب البيانات
            }
        };

        fetchCurrentUser();
    }, []);
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const users = await getChatUsers();
                setUsers(users);
                setFilteredUsers(users);
            } catch (error) {
                setError("حدث خطأ أثناء جلب المستخدمين");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        if (receiverId) {
            const fetchMessages = async () => {
                setIsLoading(true);
                try {
                    const messages = await getMessages(receiverId);
                    setMessages(messages);
                } catch (error) {
                    setError("حدث خطأ أثناء جلب الرسائل");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMessages();
        }
    }, [receiverId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, otherUserTyping]);

    // محاكاة أن المستخدم الآخر يكتب (لأغراض العرض)
    useEffect(() => {
        if (receiverId) {
            const typingInterval = setInterval(() => {
                // محاكاة أن المستخدم الآخر يكتب كل 10 ثواني لمدة 3 ثواني
                setOtherUserTyping(true);
                setTimeout(() => setOtherUserTyping(false), 3000);
            }, 10000);

            return () => clearInterval(typingInterval);
        }
    }, [receiverId]);

    const handleSendMessage = async () => {
        if (message.trim() && receiverId) {
            setIsTyping(true);
            try {
                await sendMessage(receiverId, message);
                setMessage("");
                const updatedMessages = await getMessages(receiverId);
                setMessages(updatedMessages);
            } catch (error) {
                setError("حدث خطأ أثناء إرسال الرسالة");
            } finally {
                setIsTyping(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const newMessage = e.target.value;
        setMessage(newMessage);

        // إعلام الطرف الآخر أن المستخدم يكتب
        if (newMessage.trim() && receiverId) {
            setIsTyping(true);

            // إلغاء المهلة السابقة إذا كانت موجودة
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // تعيين مهلة جديدة لإيقاف مؤشر الكتابة بعد ثانيتين من توقف الكتابة
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        } else {
            setIsTyping(false);
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
    const isPatient = currentUser?.user_type === 2; // تحقق إذا كان المستخدم الحالي مريضاً


    return (
        <div dir="rtl" className="h-screen flex flex-col overflow-hidden">
            {isUserLoading ? (
                // عرض شاشة تحميل حتى يتم جلب بيانات المستخدم
                <div className="flex items-center justify-center h-full">
                    <BeatLoader size={15} color="#06b6d4" />
                </div>
            ) : (
                <div className="flex flex-1 min-h-0">
                    {/* عرض Sidebar فقط لغير المرضى */}
                    {!isPatient && <Sidebar className="overflow-y-auto" />}

                    <div className="flex flex-col flex-1 min-h-0">
                        {/* عرض Navbar للمريض فقط، و Header لغير المرضى */}
                        {isPatient ? <Navbar /> : <Header className="shrink-0" />}

                        <div className="flex flex-1 min-h-0 overflow-hidden">
                        {/* قائمة المستخدمين */}
                        <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 shadow-md overflow-y-auto">
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="بحث"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            <ul className="space-y-3 mt-2">
                                {filteredUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                                            receiverId === user.id ? "bg-cyan-100" : ""
                                        }`}
                                        onClick={() => setReceiverId(user.id)}
                                    >

                                    <div className="flex items-center relative">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center overflow-hidden">
                                            {user.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-700">
                                                    {user.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-gray-800">{user.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {user.user_type === 0
                                                    ? "وزارة"
                                                    : user.user_type === 1
                                                        ? "مزود"
                                                        : "مريض"}
                                            </p>
                                        </div>
                                        <div
                                            className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                                                user.is_active ? "bg-green-500" : "bg-red-500"
                                            }`}
                                        ></div>
                                    </div>
                                </li>
                            ))}
                            {filteredUsers.length === 0 && (
                                <li className="text-center">لا يوجد نتائج بحث</li>
                            )}
                        </ul>
                    </div>

                        <div className="w-3/4 flex flex-col min-h-0">
                            {/* شريط عنوان المحادثة */}
                            <header className="bg-white shadow-sm h-16 flex items-center px-4 border-b shrink-0">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center">
                                    <h1 className="text-lg font-semibold text-gray-800">
                                        {receiverId ?
                                            `محادثة مع ${users.find(u => u.id === receiverId)?.name}`
                                            : "اختر محادثة لبدء الدردشة"}
                                    </h1>
                                    {isTyping && (
                                        <div className="mr-3 flex space-x-1">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="p-1 rounded-full text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-search"></i>
                                    </button>
                                    <button className="p-1 rounded-full text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>
                            </div>
                        </header>
                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <BeatLoader size={15} color="#06b6d4" />
                                    </div>
                                ) : messages.length > 0 ? (
                                    messages.map((msg) => {
                                        const isMyMessage = msg.sender_id !== receiverId; // تحقق ما إذا كانت الرسالة مرسلة من المستخدم الحالي
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex mb-3 ${isMyMessage ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[60%] p-3 rounded-2xl shadow-md ${
                                                        isMyMessage
                                                            ? "bg-cyan-500 text-white rounded-br-none"
                                                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                                                    }`}
                                                >
                                                    <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                                                    <p className="text-xs mt-1 text-gray-400 text-right">
                                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <i className="fas fa-comments text-4xl mb-2 text-gray-300"></i>
                                            <p className="text-gray-400">لا توجد رسائل بعد</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>


                            <div className="p-4 shrink-0">
                                <div className="flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder="اكتب رسالتك هنا..."
                                        className="w-full px-4 py-3 border rounded-full focus:ring-2 focus:ring-cyan-500 pr-12"
                                        value={message}
                                        onChange={handleInputChange}
                                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className={`absolute left-2 p-2 rounded-full ${
                                            !message.trim() || !receiverId
                                                ? "bg-gray-300 text-gray-500"
                                                : "bg-cyan-500 text-white hover:bg-cyan-600"
                                        }`}
                                        disabled={!message.trim() || !receiverId}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                        </div>

                        {error && (
                            <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-center text-sm">
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {error}
                            </div>
                        )}
                        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
                    </div>
                </div>
                    </div>
                </div>
            </div>

                )}

        </div>
    );
};

export default ChatPage;