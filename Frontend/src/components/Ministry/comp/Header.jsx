import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
    const [error, setError] = useState("");
    const [ministryName, setMinistryName] = useState("");

    useEffect(() => {
        const fetchMinistryData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول.");
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/dashboardM", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                console.log("Response Data:", response.data);

                // استخراج اسم المستخدم من الـ response
                if (response.data && response.data.min) {
                    setMinistryName(response.data.min);
                } else {
                    setError("بيانات الوزارة غير متوفرة.");
                }
            } catch (err) {
                console.error("Error fetching provider dashboard data:", err);
                setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
            }
        };

        fetchMinistryData();
    }, []);

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    return (
        <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow-md">
            <h1 className="text-xl font-bold">{ministryName}</h1>

            <div className="flex items-center gap-4">
                <button className="text-blue-500 hover:text-blue-700">
                    <i className="fas fa-sign-out-alt text-xl"></i>
                </button>
                <button className="text-blue-500 hover:text-blue-700">
                    <i className="fas fa-comment-dots text-xl"></i>
                </button>
            </div>
        </header>
    );
};

export default Navbar;