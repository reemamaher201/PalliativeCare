import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./component/Sidebar.jsx";
import Navbar from "./component/Navbar.jsx";
import ChatButton from "../Utilties/ChatButton.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

const DashboardS = () => {
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/dashboardS", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProviderData(response.data);
            } catch (err) {
                console.error("Error fetching provider dashboard data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };

        fetchProviderData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-cyan-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    if (!providerData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-gray-600 text-lg font-semibold">لا توجد بيانات للوحة التحكم.</p>
            </div>
        );
    }

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
                <Navbar />
                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        مرحباً، {providerData.name}!
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                البريد الإلكتروني
                            </h3>
                            <p className="text-gray-600">{providerData.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                رقم الهاتف
                            </h3>
                            <p className="text-gray-600">{providerData.phoneNumber}</p>
                        </div>
                    </div>
                </section>
            </main>
            <ChatButton />
        </div>
    );
};

export default DashboardS;