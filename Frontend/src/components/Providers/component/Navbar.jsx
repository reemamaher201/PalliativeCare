import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
    const [error, setError] = useState("");
    const [providerName, setProviderName] = useState(""); // حالة لتخزين اسم المزود

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/dashboardS", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response Data:", response.data); // تحقق من البيانات

                // تعيين اسم المزود
                if (response.data && response.data.name) {
                    setProviderName(response.data.name);
                } else {
                    setError("بيانات المزود غير متوفرة.");
                }
            } catch (err) {
                console.error("Error fetching provider dashboard data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            }
        };

        fetchProviderData();
    }, []);

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    return (
        <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow-md">
            {/* اسم المزود */}
            <h1 className="text-xl font-bold">{providerName}</h1>

            {/* الأيقونات والبيانات الشخصية */}
            <div className="flex items-center space-x-4 space-x-reverse">
                {/* أيقونة تسجيل الخروج */}
                <button className="text-blue-500 hover:text-blue-700">
                    <i className="fas fa-sign-out-alt text-xl"></i>
                </button>
                {/* أيقونة الإشعارات */}
                <button className="relative text-blue-500 hover:text-blue-700">
                    <i className="fas fa-bell text-xl"></i>
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"></span>
                </button>
                {/* أيقونة الرسائل */}
                <button className="text-blue-500 hover:text-blue-700">
                    <i className="fas fa-comment-dots text-xl"></i>
                </button>
            </div>
        </header>
    );
};

export default Navbar;