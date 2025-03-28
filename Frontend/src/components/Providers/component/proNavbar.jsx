import React, { useEffect, useState } from "react";
import axios from "axios";
import {logout} from "../../../services/Auth/auth.jsx";

const pNavbar = () => {
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


                <div className="flex items-center gap-4">
                    <button onClick={logout} className="text-cyan-500 hover:text-cyan-700">
                        <i className="fas fa-sign-out-alt text-xl"></i>
                    </button>
                    <a href="/chat" className="text-lg text-cyan-500 hover:text-cyan-700">
                        <i className="fas fa-comment"></i>
                    </a>
                </div>

        </header>
    );
};

export default pNavbar;