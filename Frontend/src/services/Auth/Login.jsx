import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [identityNumber, setIdentityNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                identity_number: identityNumber,
                password,
            });

            const token = response.data.data.token;

            // تخزين التوكن في localStorage أو sessionStorage حسب الاحتياج
            localStorage.setItem("token", token);

            // إعادة التوجيه إلى Dashboard المناسب بناءً على نوع المستخدم
            const userType = response.data.data.user.user_type;
            navigate(getUserPath(userType));

        } catch (err) {
            console.error("Login failed:", err);
            if (err.response) {
                // إن كان الخطأ عبارة عن خطأ من الخادم، استخدم رسالة الخطأ
                setError(err.response.data.error || "بيانات الاعتماد غير صحيحة");
            } else {
                setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getUserPath = (userType) => {
        switch (userType) {
            case 0: return "/dashboardM"; // مزود
            case 1: return "/dashboardS"; // وزارة
            case 2: return "/user-profile"; // مريض
            case 3: return "/admin-dashboard"; // إداري
            default: return "/";
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6">تسجيل الدخول</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-2">رقم الهوية</label>
                        <input
                            type="text"
                            value={identityNumber}
                            onChange={(e) => setIdentityNumber(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;