import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./comp/Sidebar.jsx";
import Header from "./comp/Header.jsx";

const CreateNotification = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [date, setDate] = useState("");
    const [recipient, setRecipient] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // تحقق من البيانات هنا إذا لزم الأمر

        const notificationData = {
            title,
            text,
            date,
            recipient,
        };

        try {
            const token = localStorage.getItem("token"); // جلب الرمز من localStorage
            await axios.post("http://127.0.0.1:8000/api/addnotification", notificationData, {
                headers: { Authorization: `Bearer ${token}` }, // إضافة الرمز في رؤوس الطلب
            });
            alert("تم إرسال الإشعار بنجاح");
        } catch (error) {
            console.error("خطأ أثناء إرسال الإشعار:", error);
            if (error.response) {
                alert(`خطأ: ${error.response.data.message || error.message}`);
            } else {
                alert(`خطأ: ${error.message}`);
            }
        }

    };

    return (
        <div dir={"rtl"} className="flex min-h-screen bg-gray-100">
           <Sidebar/>

            <main className="flex-1 ">
                {/* Header */}
                <Header/>

                {/* Notification Creation Form */}
                <section>
                    <h3 className="text-lg font-bold text-cyan-700 mb-6 pt-2">إنشاء إشعار</h3>
                    <form className="space-y-4 p-8" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="عنوان الإشعار"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="نص الإشعار"
                                rows="4"
                                maxLength="100"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            >
                                <option value="">المرسل له</option>
                                <option value="الجميع">الجميع</option>
                                <option value="المرضى">المرضى</option>
                                <option value="مزودو الخدمة">مزودو الخدمة</option>
                            </select>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition"
                            >
                                إرسال
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default CreateNotification;