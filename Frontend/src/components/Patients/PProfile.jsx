import React, { useState, useEffect } from "react";
import axios from "axios";
import PNavbar from "./PNavbar.jsx";

const UserProfile = () => {
    const [userData, setUserData] = useState(null); // لتخزين بيانات المستخدم
    const [loading, setLoading] = useState(true); // حالة التحميل
    const [error, setError] = useState(""); // حالة الخطأ

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/user-profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data); // تخزين بيانات المستخدم
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div class="text-center mt-8">جاري تحميل البيانات...</div>;
    }

    if (error) {
        return <div class="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!userData) {
        return <div class="text-center mt-8">لا توجد بيانات للمستخدم.</div>;
    }

    return (
        <div class="bg-white max-h-screen">
            {/* شريط التنقل */}
            <div class="font-sans">
                <PNavbar />           </div>

            {/* محتوى الصفحة */}
            <div class="flex justify-center items-start p-8">
                {/* معلومات السكن */}
                <div dir ="rtl" className="flex-1 mr-8">
                    <div
                       className="text-white text-lg font-bold py-2 m-4 px-6 rounded-lg relative"
                        style={{ backgroundColor: "#519DB7" }}
                >
                أهلاً، {userData.name || "اسم المستخدم"}
            </div>
            <div className="mb-4">
                <label class="block text-gray-700 text-right mb-2">منطقة السكن</label>                        <input
                type="text"
                value={userData.address || "غير متوفر"}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                readOnly
                />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-right mb-2">نوع الرعاية</label >                       <input
                type="text"
                value={userData.care_type || "غير متوفر"}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                readOnly
                />
            </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">الجنس</label> <input
                        type="text"
                        value={userData.gender ? `${userData.gender} ` : "غير متوفر"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
        </div>

    {/* معلومات الشخصية */}
                <div dir="rtl" className="flex-1 m-8">
                    <h3 class="text-lg font-bold text-right mb-4" style={{color: "#519DB7"}}>
                        معلوماتي الشخصية
                    </h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">الاسم</label> <input
                        type="text"
                        value={userData.name || "غير متوفر"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">رقم الهوية</label> <input
                        type="text"
                        value={userData.identity_number || "غير متوفر"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                    />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-right mb-2">العمر</label> <input
                        type="text"
                        value={userData.age ? `${userData.age} سنة` : "غير متوفر"}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                    />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;