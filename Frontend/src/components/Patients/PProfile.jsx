import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "./pNavbar.jsx";
import errorGif from '../../assets/Mobile Login.gif';
import ChatButton from "../Utilties/ChatButton.jsx";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError(

                            <div className="flex flex-col items-center justify-center">
                                <img src={errorGif} alt="Error" className="h-100 w-100 mb-8" />
                                <p className="text-red-600 font-semibold mb-4">لم يتم العثور على المستخدم. يرجى تسجيل الدخول.</p>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="bg-cyan-700 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                                >
                                    تسجيل الدخول
                                </button>
                            </div>

                    );
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/user-profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("لم يتم العثور على المستخدم. يرجى تسجيل الدخول.");
                return;
            }

            await axios.post("http://127.0.0.1:8000/api/logout", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token");
            navigate("/");
        } catch (err) {
            console.error("Error logging out:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!userData) {
        return <div className="text-center mt-8">لا توجد بيانات للمستخدم.</div>;
    }

    return (
        <div className="bg-white max-h-screen">
            <div className="font-sans">
                <Navbar onLogout={handleLogout} />
            </div>

            <div className="flex justify-center items-start p-8">
                <div dir="rtl" className="flex-1 mr-8">
                    <div
                        className="text-white text-lg font-bold py-2 m-4 px-6 rounded-lg relative"
                        style={{ backgroundColor: "#519DB7" }}
                    >
                        أهلاً، {userData.name || "اسم المستخدم"}
                    </div>
                    <InfoRow label="منطقة السكن" value={userData.address || "غير متوفر"} />
                    <InfoRow label="نوع الرعاية" value={userData.care_type || "غير متوفر"} />
                    <InfoRow label="الجنس" value={userData.gender ? `${userData.gender} ` : "غير متوفر"} />
                </div>

                <div dir="rtl" className="flex-1 m-8">
                    <h3 className="text-lg font-bold text-right mb-4" style={{ color: "#519DB7" }}>
                        معلوماتي الشخصية
                    </h3>
                    <InfoRow label="الاسم" value={userData.name || "غير متوفر"} />
                    <InfoRow label="رقم الهوية" value={userData.identity_number || "غير متوفر"} />
                    <InfoRow label="العمر" value={userData.age ? `${userData.age} سنة` : "غير متوفر"} />
                </div>
            </div>
            <ChatButton/>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-right mb-2">{label}</label>
        <input
            type="text"
            value={value}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            readOnly
        />
    </div>
);

export default UserProfile;